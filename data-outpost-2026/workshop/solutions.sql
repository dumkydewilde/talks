-- Facilitator solutions.
--   A and B: the DuckGen share   USE devtools_duckoffee_warehouse_lineage;
--   C:       the duckoffee share USE duckoffee;
--   Bonus:   generate.sql        USE duckoffee_legacy;
-- Numbers below are from release 20261103-bae5bc27-s-r1. A few A queries are DuckGen's own
-- answer queries (guide.md next to the release manifest); their published answer keys match.

-- ── A1 · Loading patterns ────────────────────────────────────────────────────
-- Nightly rhythm: TASK_SVC runs two stored procedures at 01:00, DBT_SVC builds from 02:00 to ~05:30.
-- Then on 2026-02-02 the build starts finishing at ~07:30: fct_ticket_lines went from ~4 to ~50
-- minutes and from 0.4M to 120M+ rows per run. A broken is_incremental filter rebuilds it in full
-- every night while full_refresh stays false.
WITH inv AS (
  SELECT date_trunc('month', run_started_at)::DATE AS month,
    strftime(to_timestamp(avg(epoch(run_completed_at) - epoch(run_completed_at::DATE)))::TIMESTAMP, '%H:%M') AS avg_completed
  FROM dbt_invocations GROUP BY 1),
tl AS (
  SELECT date_trunc('month', execute_started_at)::DATE AS month,
    round(avg(execution_time) / 60, 1) AS fct_ticket_lines_minutes, round(avg(rows_affected) / 1e6, 1) AS million_rows_per_run
  FROM dbt_run_results WHERE name = 'fct_ticket_lines' GROUP BY 1)
SELECT * FROM inv JOIN tl USING (month) ORDER BY month;

-- Who notices: franchisees open the morning-sales dashboard between 06:30 and 08:00. From
-- 2026-02-02 roughly 70% of those reads start before the nightly build has finished: stale data.
SELECT date_trunc('week', q.start_time)::DATE AS week, count(*) AS morning_reads,
  sum((q.start_time < i.run_completed_at)::INTEGER) AS stale_reads,
  round(100.0 * avg((q.start_time < i.run_completed_at)::INTEGER), 1) AS stale_pct,
  strftime(to_timestamp(avg(epoch(i.run_completed_at) - epoch(i.run_completed_at::DATE)))::TIMESTAMP, '%H:%M') AS avg_nightly_completion
FROM query_history q JOIN dbt_invocations i ON i.run_started_at::DATE = q.start_time::DATE
WHERE q.query_tag = 'franchisee_morning_sales' AND strftime(q.start_time, '%H:%M') >= '06:30' AND strftime(q.start_time, '%H:%M') < '08:00'
  AND q.start_time >= TIMESTAMP '2026-01-05'
GROUP BY 1 ORDER BY 1;

-- ── A2 · Lineage: observed vs declared ──────────────────────────────────────
-- 14 observed reads that dbt doesn't declare. The big ones:
--   - marketing_campaigns (Looker) reads RAW_ADS and RAW_LOYALTY directly through PDT SQL,
--     instead of fct_campaign_daily (since 2025-11-17: cache hits drop, queries triple in cost)
--   - cafe_ops, a data app with no exposure at all, polls three marts every 30 s since 2026-03-02
--   - royalty_statements still reads RAW_POS.PUBLIC.TICKETS, which was replaced by RAW_POS_V2
--   - dbt model stg_src_09 reads a Looker PDT (LR$MKT_CAMPAIGN_PDT). dbt depends on the BI tool.
-- Also: the two stored procedures read RAW_LOYALTY / RAW_POS but access_history records no write
-- target for them. Their output is invisible to lineage built from objects_modified.
WITH a AS (
  SELECT a.query_id, a.query_start_time, a.user_name, unnest(json_extract_string(a.base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id
  FROM access_history a WHERE a.query_start_time >= TIMESTAMP '2026-01-01'),
o AS (SELECT table_id, table_catalog || '.' || table_schema || '.' || table_name AS object_name, replace(comment, 'dbt node ', '') AS node_uid FROM account_tables),
obs AS (
  SELECT 'dbt model ' || d.name AS reader, o.object_name, d.depends_on_nodes LIKE '%"' || o.node_uid || '"%' AS declared, count(*) AS reads_90d
  FROM a JOIN dbt_run_results r USING (query_id) JOIN dbt_models d USING (unique_id) JOIN o USING (table_id)
  WHERE o.object_name <> d.database_name || '.' || d.schema_name || '.' || upper(d.name) GROUP BY ALL
  UNION ALL
  SELECT 'consumer ' || q.query_tag, o.object_name, coalesce(e.depends_on_nodes LIKE '%"' || o.node_uid || '"%', false), count(*)
  FROM a JOIN query_history q USING (query_id) JOIN o USING (table_id) LEFT JOIN dbt_exposures e ON e.name = q.query_tag
  WHERE q.user_name IN ('LOOKER_SVC', 'BI_TOOL_B_SVC', 'DATA_APP_SVC') GROUP BY ALL)
SELECT reader, object_name, reads_90d FROM obs WHERE NOT declared ORDER BY reads_90d DESC, reader, object_name;

-- ── A3 · Dead ends ──────────────────────────────────────────────────────────
-- 8 of 32 marts (FCT_MART_53 … FCT_MART_60) have no reads outside dbt since 2026-01-01.
-- They cost 64.88 credits to build in that period: 6.4% of TRANSFORM_WH. Don't move them.
WITH reads AS (
  SELECT DISTINCT unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id FROM access_history
  WHERE user_name <> 'DBT_SVC' AND query_start_time >= TIMESTAMP '2026-01-01'),
marts AS (
  SELECT d.unique_id, t.table_name, t.table_id IN (SELECT table_id FROM reads) AS read_outside_dbt
  FROM dbt_models d JOIN account_tables t ON t.comment = 'dbt node ' || d.unique_id WHERE d.database_name = 'MARTS'),
cost AS (
  SELECT r.unique_id, sum(m.credits_used_compute::DECIMAL(18, 6)) AS credits FROM dbt_run_results r JOIN query_metering_history m USING (query_id)
  WHERE m.start_time >= TIMESTAMP '2026-01-01' GROUP BY 1),
tot AS (SELECT sum(credits_used_compute::DECIMAL(18, 6)) AS credits FROM query_metering_history WHERE warehouse_name = 'TRANSFORM_WH' AND start_time >= TIMESTAMP '2026-01-01')
SELECT CASE WHEN read_outside_dbt THEN 'read' ELSE 'unread' END AS mart_status, count(*) AS marts,
  round(sum(c.credits), 2) AS build_credits, round(100 * sum(c.credits) / max(tot.credits), 1) AS pct_of_transform_wh,
  list(table_name ORDER BY table_name) FILTER (WHERE NOT read_outside_dbt) AS unread_marts
FROM marts JOIN cost c USING (unique_id) CROSS JOIN tot GROUP BY 1 ORDER BY 1;

-- The other direction: RAW_POS.PUBLIC.TICKETS was dropped on 2026-02-16 (POS loads moved to
-- RAW_POS_V2 on 2026-01-12). The royalty_statements app and SP_CALC_FRANCHISE_ROYALTIES never got
-- the memo: 3,118 + 308 failed queries with error 002003 since the drop.
SELECT query_tag, error_code, any_value(error_message) AS error_message, count(*) AS failed_queries, min(start_time)::DATE AS first_failure
FROM query_history WHERE execution_status <> 'SUCCESS' GROUP BY ALL;

-- ── B · Inventory ────────────────────────────────────────────────────────────
-- One row per table with reads, readers and build credits, plus a first-pass bucket.
-- Run it in a database of your own (the share is read-only), e.g.
--   CREATE DATABASE IF NOT EXISTS my_migration; then prefix with CREATE TABLE my_migration.table_inventory AS
WITH r AS (
  SELECT unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id, user_name, query_start_time
  FROM access_history),
reads AS (
  SELECT table_id,
    count(*) FILTER (WHERE user_name <> 'DBT_SVC') AS consumer_reads,
    count(*) FILTER (WHERE user_name = 'DBT_SVC') AS dbt_reads,
    count(DISTINCT user_name) FILTER (WHERE user_name <> 'DBT_SVC') AS readers,
    list(DISTINCT user_name) FILTER (WHERE user_name <> 'DBT_SVC' AND user_name NOT LIKE 'ANALYST%') AS services,
    max(query_start_time) FILTER (WHERE user_name <> 'DBT_SVC') AS last_consumer_read
  FROM r GROUP BY 1),
w AS (
  SELECT unnest(json_extract_string(objects_modified, '$[*].objectId'))::INTEGER AS table_id, query_id FROM access_history),
builds AS (
  SELECT w.table_id, round(sum(m.credits_used_compute::DECIMAL(18, 6)), 1) AS build_credits
  FROM w JOIN query_metering_history m USING (query_id) GROUP BY 1),
inv AS (
  SELECT t.table_catalog || '.' || t.table_schema || '.' || t.table_name AS fqn, t.table_owner, t.table_type,
    round(t.bytes / 1e9, 1) AS gb, t.deleted < TIMESTAMP '9999-01-01' AS dropped,
    coalesce(r.consumer_reads, 0) AS consumer_reads, coalesce(r.dbt_reads, 0) AS dbt_reads, coalesce(r.readers, 0) AS readers,
    r.services, r.last_consumer_read::DATE AS last_consumer_read, coalesce(b.build_credits, 0) AS build_credits
  FROM account_tables t LEFT JOIN reads r USING (table_id) LEFT JOIN builds b USING (table_id))
SELECT *,
  CASE
    WHEN dropped THEN 'leave behind'                                          -- gone already; repoint its readers first
    WHEN table_owner = 'LOOKER_ROLE' THEN 'leave behind'                      -- Looker PDTs: Looker rebuilds them on the new connection
    WHEN table_owner = 'LOADER' AND consumer_reads = 0 AND dbt_reads = 0 THEN 'leave behind'
    WHEN fqn LIKE 'MARTS.%' AND consumer_reads = 0 THEN 'leave behind'        -- the 8 dead marts from A3
    WHEN build_credits > 100 THEN 'copy'                                      -- fct_ticket_lines: copy history, continue incrementally
    ELSE 'rebuild'                                                            -- dbt models, and raw tables a loader can re-sync
  END AS bucket
FROM inv ORDER BY bucket, build_credits DESC, gb DESC;

-- What the heuristic can't know, and you have to ask a human about:
--   - RAW_* tables: can the loader re-sync full history? If the source only keeps recent data, copy instead of rebuild.
--   - RAW_POS.PUBLIC.TICKETS held POS history from before 2026-01-12. It's dropped: is that history needed, and does it exist anywhere else?
--   - Nothing at Duckoffee lives in object storage yet, so "query in place" is empty. That's a finding too.
--   - FCT_TICKET_LINES (17.3 GB, 497 build credits, most of TRANSFORM_WH): fix the is_incremental filter before you port it.

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
