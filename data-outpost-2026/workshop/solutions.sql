-- Facilitator solutions. A and B run against the generated duckoffee_legacy database
-- (generate.sql), C against the public duckoffee share, bonus 1 and 2 against duckoffee_legacy.

-- ── A · Query history: loading patterns ──────────────────────────────────────
-- Write cadence per table. Hourly: Fivetran + Snowpipe. Nightly: Airbyte, dbt, Airflow.
-- Monthly: the hand-uploaded FX rates and the board pack procedure, both on the 1st.
WITH w AS (
  SELECT m.objectName AS fqn, a.query_start_time AS t
  FROM account_usage.access_history a, unnest(a.objects_modified) AS u(m)
)
SELECT fqn, count(*) AS writes, count(DISTINCT t::DATE) AS active_days,
  CASE WHEN count(*) / count(DISTINCT t::DATE) >= 12 THEN 'hourly'
       WHEN count(DISTINCT t::DATE) >= 60 THEN 'daily'
       WHEN count(DISTINCT t::DATE) <= 4 THEN 'monthly or ad hoc' ELSE 'irregular' END AS pattern
FROM w GROUP BY 1 ORDER BY pattern, fqn;

-- ── A · Query history: dead ends ────────────────────────────────────────────
-- Four dead ends: two scratch tables written once and never read (15 GB backup!), and two old
-- tables nobody writes or reads.
WITH t AS (SELECT table_catalog || '.' || table_schema || '.' || table_name AS fqn, round(bytes / 1e9, 1) AS gb FROM account_usage.tables),
reads AS (SELECT DISTINCT o.objectName AS fqn FROM account_usage.access_history, unnest(base_objects_accessed) AS u(o)),
writes AS (SELECT m.objectName AS fqn, max(query_start_time) AS last_write FROM account_usage.access_history, unnest(objects_modified) AS u(m) GROUP BY 1)
SELECT t.fqn, t.gb, w.last_write,
  CASE WHEN w.fqn IS NOT NULL THEN 'written but never read' ELSE 'not written, not read' END AS dead_end
FROM t ANTI JOIN reads r USING (fqn) LEFT JOIN writes w USING (fqn)
ORDER BY dead_end, gb DESC;

-- The opposite trap: read, but nothing writes it. A Google Sheet still reads FCT_ORDERS_V1 every Monday.
WITH reads AS (SELECT DISTINCT o.objectName AS fqn, user_name FROM account_usage.access_history, unnest(base_objects_accessed) AS u(o)),
writes AS (SELECT DISTINCT m.objectName AS fqn FROM account_usage.access_history, unnest(objects_modified) AS u(m))
SELECT fqn, list(DISTINCT user_name) AS readers FROM reads ANTI JOIN writes USING (fqn) WHERE fqn NOT LIKE 'RAW.%' GROUP BY 1;

-- ── A · Query history: lineage ───────────────────────────────────────────────
CREATE OR REPLACE TABLE lineage_from_text AS
WITH parsed AS (
  SELECT DISTINCT
    upper(regexp_extract(lower(query_text), '(?:table|view|into)\s+([a-z_0-9]+\.[a-z_0-9]+\.[a-z_0-9]+)', 1)) AS target,
    upper(unnest(regexp_extract_all(lower(query_text), '(?:from|join)\s+([a-z_0-9]+\.[a-z_0-9]+\.[a-z_0-9]+)', 1))) AS source
  FROM account_usage.query_history
  WHERE query_type <> 'SELECT'
)
SELECT source, target FROM parsed
WHERE target <> '' AND source <> target
  AND source IN (SELECT table_catalog || '.' || table_schema || '.' || table_name FROM account_usage.tables);

CREATE OR REPLACE TABLE lineage_from_access AS
SELECT DISTINCT b.objectName AS source, m.objectName AS target
FROM account_usage.access_history, unnest(objects_modified) AS u(m), unnest(base_objects_accessed) AS v(b)
WHERE b.objectName <> m.objectName;

-- The edges only access_history sees: the stored procedure.
FROM lineage_from_access EXCEPT FROM lineage_from_text;

-- Everything downstream of DIM_CUSTOMERS, including the people and tools reading it.
WITH RECURSIVE edges AS (
  FROM lineage_from_access
  UNION
  SELECT DISTINCT o.objectName, 'consumer:' || user_name
  FROM account_usage.access_history, unnest(base_objects_accessed) AS v(o)
  WHERE len(objects_modified) = 0
),
downstream(node, depth) AS (
  SELECT 'ANALYTICS.MARTS.DIM_CUSTOMERS', 0
  UNION
  SELECT e.target, d.depth + 1 FROM downstream d JOIN edges e ON e.source = d.node
)
SELECT node, min(depth) AS hops FROM downstream GROUP BY 1 ORDER BY hops, node;

-- Workloads: connected components over table→table edges, leaving out the shared customer chain
-- (move that first, as its own workload). Product and the HubSpot staging split off cleanly. Finance,
-- marketing and ops still collapse into one component: FCT_ORDERS feeds attribution, and the monthly
-- board pack reads inventory. Those coupling edges are the conversation to have with the business.
WITH RECURSIVE g AS (
  SELECT source AS a, target AS b FROM lineage_from_access
  WHERE source NOT LIKE '%CUSTOMER%' AND target NOT LIKE '%CUSTOMER%'
  UNION SELECT target, source FROM lineage_from_access
  WHERE source NOT LIKE '%CUSTOMER%' AND target NOT LIKE '%CUSTOMER%'
),
walk(node, root) AS (
  SELECT DISTINCT a, a FROM g
  UNION
  SELECT g.b, w.root FROM walk w JOIN g ON g.a = w.node
),
comp AS (SELECT node, min(root) AS component FROM walk GROUP BY 1)
SELECT component, count(*) AS n_tables, list(node ORDER BY node) AS tables
FROM comp GROUP BY 1 ORDER BY n_tables DESC;

-- ── B · Inventory ────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE table_inventory AS
WITH t AS (
  SELECT table_catalog || '.' || table_schema || '.' || table_name AS fqn, *
  FROM account_usage.tables
),
reads AS (
  SELECT o.objectName AS fqn, count(*) AS n_reads, count(DISTINCT a.user_name) AS n_readers,
         list(DISTINCT a.user_name ORDER BY a.user_name) AS readers, max(a.query_start_time) AS last_read
  FROM account_usage.access_history a, unnest(a.base_objects_accessed) AS u(o)
  WHERE len(a.objects_modified) = 0 OR NOT list_contains(list_transform(a.objects_modified, lambda m: m.objectName), o.objectName)
  GROUP BY 1
),
writes AS (
  SELECT m.objectName AS fqn, count(*) AS n_writes, any_value(q.user_name) AS writer,
         any_value(q.query_tag) FILTER (WHERE q.query_tag <> '') AS query_tag,
         any_value(q.query_type) AS write_type
  FROM account_usage.access_history a
  CROSS JOIN unnest(a.objects_modified) AS u(m)
  JOIN account_usage.query_history q ON q.query_id = a.query_id
  WHERE a.query_start_time >= TIMESTAMP '2026-08-03'
  GROUP BY 1
),
upstreams AS (
  SELECT m.objectName AS fqn, count(DISTINCT b.objectName) AS n_upstream
  FROM account_usage.access_history a, unnest(a.objects_modified) AS u(m), unnest(a.base_objects_accessed) AS v(b)
  WHERE b.objectName <> m.objectName
  GROUP BY 1
),
cols AS (
  SELECT table_catalog || '.' || table_schema || '.' || table_name AS fqn,
         count(*) AS n_columns, count(*) FILTER (WHERE data_type = 'VARIANT') AS n_variant
  FROM account_usage.columns GROUP BY 1
)
SELECT
  t.fqn, t.table_type, round(t.bytes / 1e9, 2) AS gb, t.row_count,
  w.writer, json_extract_string(w.query_tag, '$.materialized') AS dbt_materialized,
  coalesce(w.n_writes, 0) AS writes_90d, t.last_altered,
  coalesce(r.n_reads, 0) AS reads_90d, coalesce(r.n_readers, 0) AS readers_90d, r.readers, r.last_read,
  c.n_columns, c.n_variant, coalesce(u.n_upstream, 0) AS n_upstream,
  CASE
    WHEN coalesce(r.n_reads, 0) = 0 AND coalesce(w.n_writes, 0) = 0 THEN 'leave behind'
    WHEN coalesce(w.n_writes, 0) = 0 THEN 'leave behind (but tell the reader)'
    WHEN t.table_type = 'EXTERNAL TABLE' OR w.writer = 'SNOWPIPE' THEN 'query in place'
    WHEN t.table_schema = 'SNAPSHOTS' OR w.writer = 'K.NAKAMURA' THEN 'copy'
    ELSE 'rebuild'
  END AS proposed_bucket
FROM t
LEFT JOIN reads r USING (fqn) LEFT JOIN writes w USING (fqn)
LEFT JOIN upstreams u USING (fqn) LEFT JOIN cols c USING (fqn);

SELECT fqn, gb, writer, writes_90d, reads_90d, readers, proposed_bucket FROM table_inventory ORDER BY proposed_bucket, gb DESC NULLS LAST;

-- How well did the heuristic do against the answer key?
SELECT i.fqn, i.proposed_bucket, a.bucket AS answer, a.why
FROM table_inventory i JOIN answers.table_buckets a USING (fqn)
WHERE NOT starts_with(i.proposed_bucket, a.bucket);

-- ── C · Validate the duckoffee share ────────────────────────────────────────
-- Run in a database where the share is attached:
--   ATTACH IF NOT EXISTS 'md:_share/duckoffee/1877e7c6-96ea-4f88-a01f-3fed396ea7b8' AS duckoffee; USE duckoffee;
-- These are real quirks of the generated share, not planted ones. Numbers as of the share's current version.

-- 1. order_facts silently drops 8,808 of 120,000 orders (7.3%). Only 216 of them have no items,
--    and it hits every payment_status, so it isn't a "succeeded only" filter.
SELECT 'raw_orders' AS layer, count(*) AS n FROM raw_orders
UNION ALL SELECT 'stg_orders', count(*) FROM stg_orders
UNION ALL SELECT 'orders', count(*) FROM orders
UNION ALL SELECT 'order_facts', count(*) FROM order_facts;
SELECT o.payment_status, count(*) AS missing_from_facts
FROM orders o ANTI JOIN order_facts f USING (order_id) GROUP BY 1 ORDER BY 2 DESC;

-- 2. A quarter of all coffee (29,962 orders) is sold between midnight and 6 a.m.
--    Night owls, or timestamps in UTC while the cafes are in 15 time zones?
SELECT hour(ordered_at) AS hour_of_day, count(*) AS orders FROM orders GROUP BY 1 ORDER BY 1;

-- 3. 20,463 orders (17%) were placed before the customer registered.
SELECT count(*) AS orders_before_registration
FROM orders o JOIN customers c USING (customer_id) WHERE o.ordered_at < c.registered_at;

-- 4. Currency has nothing to do with the cafe: Tokyo is mostly EUR, and the average JPY order is
--    ~169 "yen" (about one euro), the same number as the average EUR order. Summing order_total
--    across currencies, which daily_revenue does, adds yen to euros.
SELECT l.country, o.currency, count(*) AS orders, round(avg(o.order_total), 2) AS avg_total
FROM orders o JOIN locations l USING (location_id)
WHERE l.country IN ('Japan', 'United Kingdom', 'Netherlands')
GROUP BY ALL ORDER BY l.country, orders DESC;

-- 5. daily_revenue covers 5 of the 19 cafes that have orders and stops at 2025-12-31, while orders
--    run until 2026-04-01. Milan (Patolino Presso, location 20) has no orders at all.
SELECT
  (SELECT count(DISTINCT location_id) FROM daily_revenue) AS cafes_in_daily_revenue,
  (SELECT count(DISTINCT location_id) FROM orders) AS cafes_with_orders,
  (SELECT max(revenue_date) FROM daily_revenue) AS daily_revenue_until,
  (SELECT max(ordered_at)::DATE FROM orders) AS orders_until;
SELECT l.* FROM locations l ANTI JOIN orders o USING (location_id);

-- 6. 13 customers share an email address with another customer.
SELECT email, count(*) AS n FROM customers GROUP BY 1 HAVING n > 1 ORDER BY n DESC;

-- 7. Legacy invoice numbers (90001–102000) are also valid order ids. Union them into one
--    "transactions" table and 12,000 keys collide.
SELECT count(*) AS colliding_ids FROM stg_legacy_invoices i JOIN orders o ON o.order_id = i.invoice_number;

-- Checks worth keeping in the Dive until cutover: row counts per layer, % orders before
-- registration, % orders outside opening hours, currency vs country, max date per summary table.

-- ── Bonus 1 · Incremental ────────────────────────────────────────────────────
CREATE OR REPLACE TABLE events_append AS
SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries;
INSERT INTO events_append  -- the accidental rerun of delivery 3
SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries WHERE delivery_id = 3;
SELECT count(*) AS row_count, count(DISTINCT event_id) AS distinct_events, count(*) - count(DISTINCT event_id) AS duplicates FROM events_append;

CREATE OR REPLACE TABLE events_merged (event_id VARCHAR PRIMARY KEY, event_time TIMESTAMP, customer_id VARCHAR, event_name VARCHAR);
INSERT OR REPLACE INTO events_merged SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries WHERE delivery_id BETWEEN 1 AND 4;
INSERT OR REPLACE INTO events_merged SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries WHERE delivery_id = 5;
INSERT OR REPLACE INTO events_merged SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries WHERE delivery_id = 3;
INSERT OR REPLACE INTO events_merged SELECT event_id, event_time, customer_id, event_name FROM incremental.app_event_deliveries WHERE delivery_id BETWEEN 6 AND 7;
SELECT count(*) AS row_count, count(DISTINCT event_id) AS distinct_events FROM events_merged;

-- How late do events arrive? That's your lookback window.
SELECT datediff('day', event_time::DATE, delivered_at::DATE) - 1 AS days_late, count(DISTINCT event_id) AS events
FROM incremental.app_event_deliveries GROUP BY 1 ORDER BY 1;

-- ── Bonus 2 · Compare two warehouses ─────────────────────────────────────────
-- Per-day fingerprint: the edges of the window and one day in the middle stand out.
WITH s AS (SELECT order_date, count(*) AS n, sum(amount_usd) AS amt FROM validation.sf_fct_orders GROUP BY 1),
     m AS (SELECT order_date, count(*) AS n, sum(amount_usd) AS amt FROM validation.md_fct_orders GROUP BY 1)
SELECT order_date, s.n AS sf_rows, m.n AS md_rows, m.n - s.n AS row_diff, m.amt - s.amt AS amount_diff
FROM s FULL JOIN m USING (order_date)
ORDER BY abs(coalesce(m.n, 0) - coalesce(s.n, 0)) DESC LIMIT 10;

-- Missing and extra keys.
SELECT 'missing in motherduck' AS issue, count(*) AS n, min(ordered_at) AS from_ts, max(ordered_at) AS to_ts
FROM (SELECT order_id FROM validation.sf_fct_orders EXCEPT SELECT order_id FROM validation.md_fct_orders) JOIN validation.sf_fct_orders USING (order_id)
UNION ALL
SELECT 'duplicated in motherduck', count(*), min(ordered_at), max(ordered_at)
FROM (SELECT order_id, any_value(ordered_at) AS ordered_at FROM validation.md_fct_orders GROUP BY 1 HAVING count(*) > 1);

-- Column-by-column on matching keys.
WITH md AS (SELECT DISTINCT * FROM validation.md_fct_orders)
SELECT
  count(*) FILTER (WHERE s.order_date <> m.order_date) AS order_date_diffs,
  count(*) FILTER (WHERE s.amount_usd <> m.amount_usd) AS amount_diffs,
  max(abs(s.amount_usd - m.amount_usd)) AS max_amount_diff,
  list(DISTINCT s.currency) FILTER (WHERE s.amount_usd <> m.amount_usd) AS currencies_affected,
  count(*) FILTER (WHERE s.status <> m.status) AS status_diffs
FROM validation.sf_fct_orders s JOIN md m USING (order_id);
-- Causes: (1) order_date in UTC instead of America/Los_Angeles, (2) amounts computed in DOUBLE and truncated
-- instead of rounded DECIMAL (hits USD too: 8.29 * 100 = 828.999…), (3) a retried incremental run with no unique key on 2026-10-14, (4) the copy ran while
-- Snowflake was still loading: the last 3 hours are missing. Check the source watermark first.
