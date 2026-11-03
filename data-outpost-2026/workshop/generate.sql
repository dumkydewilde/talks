-- Duckoffee — a synthetic "legacy warehouse" for the Data Outpost migration workshop.
--
-- Mimics what you'd export from Snowflake's SNOWFLAKE.ACCOUNT_USAGE views for a ~40-table
-- dbt + Fivetran + Airflow stack, plus two small datasets for the incrementality and
-- validation exercises. Fully deterministic (hash-based randomness), so every participant
-- gets identical numbers.
--
-- Run locally:      duckdb duckoffee_legacy.duckdb < workshop/generate.sql
-- Run in MotherDuck: CREATE DATABASE duckoffee_legacy; USE duckoffee_legacy; then paste this file.
--
-- Schemas created:
--   account_usage  tables, columns, query_history, access_history, warehouse_metering_history
--   incremental    app_event_deliveries         (bonus 1)
--   validation     sf_fct_orders, md_fct_orders (bonus 2)
--   answers        table_buckets                (facilitator only; drop before sharing if you like)

CREATE SCHEMA IF NOT EXISTS account_usage;
CREATE SCHEMA IF NOT EXISTS incremental;
CREATE SCHEMA IF NOT EXISTS validation;
CREATE SCHEMA IF NOT EXISTS answers;

-- Deterministic pseudo-random number in [0, 1) from any key.
CREATE OR REPLACE MACRO rnd(k) AS (hash(k::VARCHAR) % 1000003) / 1000003.0;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The catalog: every table in the old warehouse, how it's written, and what it reads.
--    ord is a topological order (upstreams always have a lower ord).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE catalog AS
SELECT * FROM (VALUES
  ( 1,'RAW','SHOPIFY','ORDERS',                 'BASE TABLE',    'fivetran',        'hourly',  'finance',  [],                                                                                     48200000,   61e9, 42,'2021-03-02','rebuild',      'Fivetran can re-sync the full history from Shopify.'),
  ( 2,'RAW','SHOPIFY','ORDER_LINES',            'BASE TABLE',    'fivetran',        'hourly',  'finance',  [],                                                                                    131000000,   88e9, 28,'2021-03-02','rebuild',      'Re-sync from source.'),
  ( 3,'RAW','SHOPIFY','CUSTOMERS',              'BASE TABLE',    'fivetran',        'hourly',  'shared',   [],                                                                                      6100000,    9e9, 35,'2021-03-02','rebuild',      'Re-sync from source. Only current state though: history lives in the snapshot.'),
  ( 4,'RAW','STRIPE','CHARGES',                 'BASE TABLE',    'fivetran',        'hourly',  'finance',  [],                                                                                     51000000,   70e9, 54,'2021-05-19','rebuild',      'Re-sync from source.'),
  ( 5,'RAW','STRIPE','REFUNDS',                 'BASE TABLE',    'fivetran',        'hourly',  'finance',  [],                                                                                      2300000,    2e9, 18,'2021-05-19','rebuild',      'Re-sync from source.'),
  ( 6,'RAW','HUBSPOT','CONTACTS',               'BASE TABLE',    'airbyte',         'daily',   'marketing',[],                                                                                      7400000,   14e9,212,'2022-01-11','rebuild',      'Re-sync. 212 columns of custom properties: expect schema drift.'),
  ( 7,'RAW','ZENDESK','TICKETS',                'BASE TABLE',    'airbyte',         'daily',   'support',  [],                                                                                      1900000,    6e9, 64,'2022-06-30','rebuild',      'Re-sync from source.'),
  ( 8,'RAW','GA4','EVENTS',                     'EXTERNAL TABLE','external_stage',  'daily',   'marketing',[],                                                                                   2100000000,      0, 31,'2023-02-14','query in place','Parquet already sits in object storage (1.4 TB). Point MotherDuck at it.'),
  ( 9,'RAW','APP','EVENTS',                     'BASE TABLE',    'snowpipe',        'hourly',  'product',  [],                                                                                   3400000000,  910e9, 22,'2022-09-01','query in place','Snowpipe lands JSON from S3. The files are still there: read them in place, land only what you model.'),
  (10,'RAW','ERP','INVENTORY_LEVELS',           'BASE TABLE',    'airflow_python',  'daily',   'ops',      [],                                                                                       410000,  0.3e9, 14,'2022-03-08','rebuild',      'Full overwrite each night. Current state only.'),
  (11,'RAW','FINANCE','FX_RATES',               'BASE TABLE',    'manual',          'monthly', 'finance',  [],                                                                                        18000,    1e6,  5,'2021-04-01','copy',         'Hand-uploaded CSV. No source system to re-sync from.'),
  (12,'RAW','LEGACY','CRM_EXPORT_2019',         'BASE TABLE',    'manual',          'none',    'marketing',[],                                                                                      2200000,    3e9, 88,'2021-02-20','leave behind', 'Nobody has read it in the query-history window. Archive to Parquet if legal wants it.'),
  (13,'ANALYTICS','SNAPSHOTS','CUSTOMERS_SNAPSHOT','BASE TABLE', 'dbt_snapshot',    'daily',   'shared',   ['RAW.SHOPIFY.CUSTOMERS'],                                                            19000000,   21e9, 39,'2021-06-01','copy',         'SCD2 history exists nowhere else. Copy it, then keep snapshotting on top.'),
  (14,'ANALYTICS','SNAPSHOTS','INVENTORY_SNAPSHOT','BASE TABLE', 'dbt_snapshot',    'daily',   'ops',      ['RAW.ERP.INVENTORY_LEVELS'],                                                         96000000,   30e9, 17,'2022-03-09','copy',         'SCD2 history of a full-overwrite source. Copy.'),
  (15,'ANALYTICS','STAGING','STG_ORDERS',       'VIEW',          'dbt_view',        'daily',   'finance',  ['RAW.SHOPIFY.ORDERS'],                                                                       0,      0, 24,'2021-06-01','rebuild',      'dbt view.'),
  (16,'ANALYTICS','STAGING','STG_ORDER_LINES',  'VIEW',          'dbt_view',        'daily',   'finance',  ['RAW.SHOPIFY.ORDER_LINES'],                                                                  0,      0, 16,'2021-06-01','rebuild',      'dbt view.'),
  (17,'ANALYTICS','STAGING','STG_CUSTOMERS',    'VIEW',          'dbt_view',        'daily',   'shared',   ['ANALYTICS.SNAPSHOTS.CUSTOMERS_SNAPSHOT'],                                                  0,      0, 21,'2021-06-01','rebuild',      'dbt view.'),
  (18,'ANALYTICS','STAGING','STG_CHARGES',      'VIEW',          'dbt_view',        'daily',   'finance',  ['RAW.STRIPE.CHARGES'],                                                                       0,      0, 19,'2021-06-01','rebuild',      'dbt view.'),
  (19,'ANALYTICS','STAGING','STG_REFUNDS',      'VIEW',          'dbt_view',        'daily',   'finance',  ['RAW.STRIPE.REFUNDS'],                                                                       0,      0,  9,'2021-06-01','rebuild',      'dbt view.'),
  (20,'ANALYTICS','STAGING','STG_CONTACTS',     'VIEW',          'dbt_view',        'daily',   'marketing',['RAW.HUBSPOT.CONTACTS'],                                                                     0,      0, 33,'2022-01-12','rebuild',      'dbt view.'),
  (21,'ANALYTICS','STAGING','STG_TICKETS',      'VIEW',          'dbt_view',        'daily',   'support',  ['RAW.ZENDESK.TICKETS'],                                                                      0,      0, 22,'2022-07-01','rebuild',      'dbt view.'),
  (22,'ANALYTICS','STAGING','STG_GA4_SESSIONS', 'BASE TABLE',    'dbt_incremental', 'daily',   'marketing',['RAW.GA4.EVENTS'],                                                                   410000000,  120e9, 27,'2023-02-15','rebuild',      'Incremental over 3 years of GA4: rebuilding is hours. Consider copying + continuing incrementally.'),
  (23,'ANALYTICS','STAGING','STG_APP_EVENTS',   'BASE TABLE',    'dbt_incremental', 'daily',   'product',  ['RAW.APP.EVENTS'],                                                                  3300000000,  640e9, 18,'2022-09-02','rebuild',      'Expensive incremental. Rebuild by month, or copy and continue.'),
  (24,'ANALYTICS','STAGING','STG_INVENTORY',    'VIEW',          'dbt_view',        'daily',   'ops',      ['ANALYTICS.SNAPSHOTS.INVENTORY_SNAPSHOT'],                                                  0,      0, 15,'2022-03-09','rebuild',      'dbt view.'),
  (25,'ANALYTICS','INTERMEDIATE','INT_ORDER_PAYMENTS','BASE TABLE','dbt_table',     'daily',   'finance',  ['ANALYTICS.STAGING.STG_ORDERS','ANALYTICS.STAGING.STG_CHARGES','ANALYTICS.STAGING.STG_REFUNDS'], 48100000, 22e9, 19,'2021-06-01','rebuild', 'dbt table.'),
  (26,'ANALYTICS','INTERMEDIATE','INT_CUSTOMER_HISTORY','BASE TABLE','dbt_table',   'daily',   'shared',   ['ANALYTICS.STAGING.STG_CUSTOMERS','ANALYTICS.STAGING.STG_CONTACTS'],                 19500000,   16e9, 44,'2022-01-12','rebuild',      'dbt table.'),
  (27,'ANALYTICS','INTERMEDIATE','INT_SESSIONS_ATTRIBUTED','BASE TABLE','dbt_incremental','daily','marketing',['ANALYTICS.STAGING.STG_GA4_SESSIONS','ANALYTICS.STAGING.STG_ORDERS'],      405000000,  98e9, 23,'2023-02-15','rebuild',      'Incremental.'),
  (28,'ANALYTICS','MARTS','DIM_CUSTOMERS',      'BASE TABLE',    'dbt_table',       'daily',   'shared',   ['ANALYTICS.INTERMEDIATE.INT_CUSTOMER_HISTORY'],                                       6100000,    5e9, 38,'2021-06-01','rebuild',      'Used by four workloads. Move it first.'),
  (29,'ANALYTICS','MARTS','FCT_ORDERS',         'BASE TABLE',    'dbt_incremental', 'daily',   'finance',  ['ANALYTICS.STAGING.STG_ORDERS','ANALYTICS.STAGING.STG_ORDER_LINES','ANALYTICS.INTERMEDIATE.INT_ORDER_PAYMENTS','RAW.FINANCE.FX_RATES'], 48100000, 34e9, 31,'2021-06-01','rebuild', 'Incremental with FX conversion: watch rounding and timezones.'),
  (30,'ANALYTICS','MARTS','FCT_REVENUE_DAILY',  'BASE TABLE',    'dbt_table',       'daily',   'finance',  ['ANALYTICS.MARTS.FCT_ORDERS'],                                                           1900,   1e6, 12,'2021-06-01','rebuild',      'dbt table.'),
  (31,'ANALYTICS','MARTS','FCT_MARKETING_ATTRIBUTION','BASE TABLE','dbt_table',     'daily',   'marketing',['ANALYTICS.INTERMEDIATE.INT_SESSIONS_ATTRIBUTED','ANALYTICS.MARTS.FCT_ORDERS','ANALYTICS.MARTS.DIM_CUSTOMERS'], 47000000, 19e9, 26,'2023-02-20','rebuild', 'dbt table.'),
  (32,'ANALYTICS','MARTS','FCT_FEATURE_USAGE',  'BASE TABLE',    'dbt_incremental', 'daily',   'product',  ['ANALYTICS.STAGING.STG_APP_EVENTS','ANALYTICS.MARTS.DIM_CUSTOMERS'],                  220000000,  41e9, 14,'2022-09-05','rebuild',      'Incremental.'),
  (33,'ANALYTICS','MARTS','FCT_INVENTORY_DAILY','BASE TABLE',    'dbt_table',       'daily',   'ops',      ['ANALYTICS.STAGING.STG_INVENTORY'],                                                  31000000,    8e9, 11,'2022-03-10','rebuild',      'dbt table.'),
  (34,'ANALYTICS','MARTS','FCT_SUPPORT_TICKETS','BASE TABLE',    'dbt_table',       'daily',   'support',  ['ANALYTICS.STAGING.STG_TICKETS','ANALYTICS.MARTS.DIM_CUSTOMERS'],                     1900000,    2e9, 20,'2022-07-01','rebuild',      'dbt table.'),
  (35,'ANALYTICS','REVERSE_ETL','HUBSPOT_AUDIENCES','BASE TABLE','dbt_table',       'daily',   'marketing',['ANALYTICS.MARTS.DIM_CUSTOMERS','ANALYTICS.MARTS.FCT_MARKETING_ATTRIBUTION'],         2400000,    1e9, 15,'2023-05-02','rebuild',      'Read hourly by Hightouch. Repoint the sync at cutover.'),
  (36,'ANALYTICS','REPORTING','EXEC_KPIS',      'BASE TABLE',    'airflow_sql',     'daily',   'finance',  ['ANALYTICS.MARTS.FCT_REVENUE_DAILY','ANALYTICS.MARTS.FCT_MARKETING_ATTRIBUTION','ANALYTICS.MARTS.FCT_SUPPORT_TICKETS'], 1200, 1e6, 18,'2023-08-14','rebuild', 'Not in dbt. Lineage only visible in query history.'),
  (37,'ANALYTICS','REPORTING','BOARD_PACK_MONTHLY','BASE TABLE', 'stored_procedure','monthly', 'finance',  ['ANALYTICS.MARTS.FCT_REVENUE_DAILY','ANALYTICS.MARTS.FCT_INVENTORY_DAILY','RAW.FINANCE.FX_RATES'], 40, 1e5, 22,'2024-01-31','rebuild', 'Stored procedure, runs on the 1st. Invisible in query text: only access_history shows what it reads. Easy to miss in a two-week parallel run.'),
  (38,'ANALYTICS','SCRATCH','ORDERS_FIX_JAN25', 'BASE TABLE',    'manual',          'none',    'finance',  ['ANALYTICS.MARTS.FCT_ORDERS'],                                                        310000,  0.2e9, 31,'2025-01-14','leave behind', 'One-off fix table. Unread.'),
  (39,'ANALYTICS','SCRATCH','MKT_Q3_2024_BACKUP','BASE TABLE',   'manual',          'none',    'marketing',['ANALYTICS.MARTS.FCT_MARKETING_ATTRIBUTION'],                                        39000000,   15e9, 26,'2024-10-02','leave behind', 'Backup nobody reads. 15 GB of storage bill.'),
  (40,'ANALYTICS','ANALYTICS_OLD','FCT_ORDERS_V1','BASE TABLE',  'legacy',          'none',    'finance',  [],                                                                                     39000000,   27e9, 29,'2021-03-15','leave behind', 'Nothing has written it since 2024, but a Google Sheet still reads it every Monday. Find that person before you leave it behind.'),
  (41,'ANALYTICS','ANALYTICS_OLD','DIM_CUSTOMERS_V1','BASE TABLE','legacy',         'none',    'shared',   [],                                                                                      5000000,    4e9, 30,'2021-03-15','leave behind', 'Unread.')
) AS t(ord, db, sch, tbl, table_type, loader, cadence, workload, upstream, row_count, bytes, col_count, created, bucket, why);

ALTER TABLE catalog ADD COLUMN fqn VARCHAR;
UPDATE catalog SET fqn = db || '.' || sch || '.' || tbl;

-- Facilitator answer key.
CREATE OR REPLACE TABLE answers.table_buckets AS
SELECT fqn, workload, loader, bucket, why FROM catalog ORDER BY ord;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. account_usage.tables and account_usage.columns
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE days AS
SELECT d::DATE AS day FROM range(DATE '2026-08-03', DATE '2026-11-02', INTERVAL 1 DAY) AS r(d);

CREATE OR REPLACE TABLE account_usage.columns AS
WITH col_ids AS (
  SELECT c.*, i.i AS ordinal_position, rnd(c.fqn || i.i) AS r
  FROM catalog c, LATERAL range(1, c.col_count + 1) AS i(i)
)
SELECT
  db AS table_catalog, sch AS table_schema, tbl AS table_name,
  CASE WHEN ordinal_position = 1 THEN 'ID'
       WHEN ordinal_position = col_count AND db = 'RAW' AND loader IN ('fivetran','airbyte') THEN '_LOADED_AT'
       ELSE 'COLUMN_' || lpad(ordinal_position::VARCHAR, 3, '0') END AS column_name,
  ordinal_position,
  CASE
    WHEN ordinal_position = 1 THEN 'NUMBER(38,0)'
    WHEN db = 'RAW' AND r < 0.12 THEN 'VARIANT'
    WHEN r < 0.45 THEN 'TEXT'
    WHEN r < 0.65 THEN 'NUMBER(38,0)'
    WHEN r < 0.75 THEN 'NUMBER(38,2)'
    WHEN r < 0.85 THEN 'TIMESTAMP_NTZ'
    WHEN r < 0.90 THEN 'TIMESTAMP_TZ'
    WHEN r < 0.95 THEN 'BOOLEAN'
    ELSE 'DATE' END AS data_type,
  ordinal_position > 1 AS is_nullable
FROM col_ids;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Writes: every load / transform run over 91 days.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE writes AS
WITH schedule AS (
  -- hourly loaders
  SELECT c.*, d.day + INTERVAL (h.h) HOUR + INTERVAL (floor(rnd(c.fqn) * 50)::INT) MINUTE AS run_at
  FROM catalog c, days d, range(24) AS h(h)
  WHERE c.cadence = 'hourly' AND c.loader IN ('fivetran', 'snowpipe')
  UNION ALL
  -- nightly: loaders at 01:00, dbt from 02:00 in dependency order, airflow SQL at 06:30
  SELECT c.*, d.day + CASE
      WHEN c.loader IN ('airbyte','airflow_python','external_stage') THEN INTERVAL 1 HOUR + INTERVAL (floor(rnd(c.fqn) * 40)::INT) MINUTE
      WHEN c.loader = 'airflow_sql' THEN INTERVAL 390 MINUTE
      ELSE INTERVAL 2 HOUR + INTERVAL (c.ord * 3) MINUTE END AS run_at
  FROM catalog c, days d
  WHERE c.cadence = 'daily' OR (c.cadence = 'hourly' AND c.loader NOT IN ('fivetran','snowpipe'))
  UNION ALL
  -- monthly: fx rates uploaded by hand on the 1st, board pack procedure on the 1st at 07:00
  SELECT c.*, d.day + CASE WHEN c.loader = 'manual' THEN INTERVAL 9 HOUR + INTERVAL 12 MINUTE ELSE INTERVAL 7 HOUR END
  FROM catalog c, days d
  WHERE c.cadence = 'monthly' AND day(d.day) = 1
)
SELECT
  s.*,
  'w-' || md5(s.fqn || s.run_at::VARCHAR)[1:20] AS query_id,
  CASE s.loader
    WHEN 'fivetran' THEN 'FIVETRAN_SVC' WHEN 'airbyte' THEN 'AIRBYTE_SVC' WHEN 'snowpipe' THEN 'SNOWPIPE'
    WHEN 'airflow_python' THEN 'AIRFLOW_SVC' WHEN 'airflow_sql' THEN 'AIRFLOW_SVC' WHEN 'external_stage' THEN 'AIRFLOW_SVC'
    WHEN 'stored_procedure' THEN 'AIRFLOW_SVC' WHEN 'manual' THEN 'K.NAKAMURA'
    ELSE 'DBT_PROD' END AS user_name,
  CASE WHEN s.loader IN ('fivetran','airbyte','snowpipe','airflow_python','external_stage') THEN 'LOADER'
       WHEN s.loader = 'manual' THEN 'ANALYST' ELSE 'TRANSFORMER' END AS role_name,
  CASE WHEN s.loader IN ('fivetran','airbyte','snowpipe','airflow_python','external_stage','manual') THEN 'LOAD_WH'
       ELSE 'TRANSFORM_WH' END AS warehouse_name
FROM schedule s;

CREATE OR REPLACE TABLE write_queries AS
SELECT
  w.query_id,
  CASE w.loader
    WHEN 'fivetran' THEN
      'MERGE INTO ' || w.fqn || ' AS T USING (SELECT * FROM "' || w.db || '"."' || w.sch || '"."' || w.tbl || '_STAGING_' || upper(md5(w.run_at::VARCHAR)[1:8]) || '") AS S ON T."ID" = S."ID" WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *'
    WHEN 'airbyte' THEN
      'INSERT INTO ' || w.fqn || ' SELECT * FROM ' || w.db || '.' || w.sch || '._AIRBYTE_RAW_' || w.tbl || ' QUALIFY ROW_NUMBER() OVER (PARTITION BY ID ORDER BY _AIRBYTE_EXTRACTED_AT DESC) = 1'
    WHEN 'snowpipe' THEN
      'COPY INTO ' || w.fqn || ' FROM @RAW.APP.S3_APP_EVENTS_STAGE FILE_FORMAT = (TYPE = JSON) MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE'
    WHEN 'external_stage' THEN
      'ALTER EXTERNAL TABLE ' || w.fqn || ' REFRESH'
    WHEN 'airflow_python' THEN
      'COPY INTO ' || w.fqn || ' FROM @RAW.ERP.ERP_DAILY_STAGE/inventory_' || strftime(w.run_at, '%Y%m%d') || '.csv FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1) PURGE = TRUE'
    WHEN 'manual' THEN
      'PUT file:///Users/knakamura/Downloads/fx_rates_' || strftime(w.run_at, '%Y_%m') || '.csv @RAW.FINANCE.%FX_RATES; COPY INTO ' || w.fqn || ' FROM @RAW.FINANCE.%FX_RATES'
    WHEN 'stored_procedure' THEN
      'CALL ANALYTICS.REPORTING.SP_BUILD_BOARD_PACK(DATE_TRUNC(''month'', CURRENT_DATE()) - 1)'
    WHEN 'dbt_view' THEN
      'create or replace   view ' || lower(w.fqn) || E'\n  \n   as (\n    with source as (\n    select * from ' || lower(w.upstream[1]) || E'\n),\nrenamed as (\n    select\n        id,\n        ...\n    from source\n)\nselect * from renamed\n  );'
    WHEN 'dbt_table' THEN
      'create or replace transient table ' || lower(w.fqn) || E'\n         as\n        (select\n    ...\nfrom ' || lower(w.upstream[1]) || ' as t1'
      || COALESCE(array_to_string(list_transform(w.upstream[2:], lambda u, i: E'\nleft join ' || lower(u) || ' as t' || (i + 1) || ' on t1.id = t' || (i + 1) || '.id'), ''), '')
      || E'\n        );'
    WHEN 'dbt_incremental' THEN
      'insert into ' || lower(w.fqn) || E' (\n    select\n        ...\n    from ' || lower(w.upstream[1]) || ' as t1'
      || COALESCE(array_to_string(list_transform(w.upstream[2:], lambda u, i: E'\n    join ' || lower(u) || ' as t' || (i + 1) || ' on t1.id = t' || (i + 1) || '.id'), ''), '')
      || E'\n    where t1._loaded_at > (select coalesce(max(_loaded_at), ''1900-01-01'') from ' || lower(w.fqn) || E')\n);'
    WHEN 'dbt_snapshot' THEN
      'merge into ' || lower(w.fqn) || E' as DBT_INTERNAL_DEST\n    using ' || lower(w.fqn) || E'__dbt_tmp as DBT_INTERNAL_SOURCE\n    on DBT_INTERNAL_SOURCE.dbt_scd_id = DBT_INTERNAL_DEST.dbt_scd_id\n    when matched and DBT_INTERNAL_DEST.dbt_valid_to is null and DBT_INTERNAL_SOURCE.dbt_change_type in (''update'', ''delete'')\n        then update set dbt_valid_to = DBT_INTERNAL_SOURCE.dbt_valid_to\n    when not matched and DBT_INTERNAL_SOURCE.dbt_change_type = ''insert''\n        then insert (...) values (...)\n;\n-- source: select * from ' || lower(w.upstream[1])
    WHEN 'airflow_sql' THEN
      'INSERT OVERWRITE INTO ' || w.fqn || E'\nSELECT r.REPORT_DATE, r.NET_REVENUE_USD, m.CAC_USD, s.TICKETS_PER_1K_ORDERS\nFROM ' || w.upstream[1] || E' r\nJOIN ' || w.upstream[2] || E' m ON m.REPORT_DATE = r.REPORT_DATE\nJOIN ' || w.upstream[3] || E' s ON s.REPORT_DATE = r.REPORT_DATE\nWHERE r.REPORT_DATE >= DATEADD(day, -400, CURRENT_DATE())'
  END AS query_text,
  w.db AS database_name, w.sch AS schema_name,
  CASE WHEN w.loader IN ('fivetran','dbt_snapshot') THEN 'MERGE'
       WHEN w.loader IN ('snowpipe','airflow_python','manual') THEN 'COPY'
       WHEN w.loader = 'external_stage' THEN 'ALTER_TABLE'
       WHEN w.loader = 'stored_procedure' THEN 'CALL'
       WHEN w.loader IN ('dbt_view') THEN 'CREATE_VIEW'
       WHEN w.loader IN ('dbt_table') THEN 'CREATE_TABLE_AS_SELECT'
       ELSE 'INSERT' END AS query_type,
  w.user_name, w.role_name, w.warehouse_name,
  CASE WHEN w.user_name = 'DBT_PROD' THEN
    '{"app":"dbt","dbt_version":"1.9.4","project_name":"duckoffee_analytics","target_name":"prod","node_name":"' || lower(w.tbl)
    || '","materialized":"' || replace(w.loader, 'dbt_', '') || '","invocation_id":"' || md5(w.run_at::DATE::VARCHAR)[1:8] || '-' || md5(w.run_at::DATE::VARCHAR)[9:12] || '"}'
  ELSE '' END AS query_tag,
  w.run_at AS start_time,
  -- runtime grows with table size; big incrementals are the slow ones
  (CASE WHEN w.loader = 'dbt_view' THEN 300 + rnd(w.query_id) * 400
        ELSE 800 + ln(1 + w.bytes / 1e6) * 900 * (0.6 + rnd(w.query_id || 't')) END)::BIGINT AS total_elapsed_time,
  CASE WHEN w.loader = 'dbt_view' THEN 0
       WHEN w.cadence = 'hourly' THEN (w.bytes / 2000 * (0.5 + rnd(w.query_id || 'b')))::BIGINT
       ELSE (w.bytes / 40 * (0.5 + rnd(w.query_id || 'b')))::BIGINT END AS bytes_scanned,
  CASE WHEN w.loader = 'dbt_view' THEN 0
       WHEN w.cadence = 'hourly' THEN (w.row_count / 2000 * (0.5 + rnd(w.query_id || 'r')))::BIGINT
       ELSE (w.row_count / 90 * (0.5 + rnd(w.query_id || 'r')))::BIGINT END AS rows_produced,
  w.upstream AS objects_read,
  [w.fqn] AS objects_written
FROM writes w;

-- One-off creation statements for tables that are never written on a schedule.
CREATE OR REPLACE TABLE oneoff_queries AS
SELECT
  'o-' || md5(fqn)[1:20] AS query_id,
  'CREATE TABLE ' || fqn || ' AS SELECT * FROM ' || upstream[1] || ' WHERE ORDER_DATE BETWEEN ''2025-01-01'' AND ''2025-01-13''' AS query_text,
  db AS database_name, sch AS schema_name, 'CREATE_TABLE_AS_SELECT' AS query_type,
  'K.NAKAMURA' AS user_name, 'ANALYST' AS role_name, 'ADHOC_WH' AS warehouse_name, '' AS query_tag,
  created::TIMESTAMP + INTERVAL 15 HOUR AS start_time, 41000::BIGINT AS total_elapsed_time,
  bytes::BIGINT AS bytes_scanned, row_count::BIGINT AS rows_produced,
  upstream AS objects_read, [fqn] AS objects_written
FROM catalog WHERE loader = 'manual' AND cadence = 'none' AND len(upstream) > 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Reads: BI, reverse ETL, apps, spreadsheets, notebooks, and analysts.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE consumers AS
SELECT * FROM (VALUES
  ('LOOKER_SVC',     'REPORTER',  'BI_WH',    'looker',    'business_hours', 140,
     ['ANALYTICS.MARTS.FCT_ORDERS','ANALYTICS.MARTS.FCT_REVENUE_DAILY','ANALYTICS.MARTS.FCT_REVENUE_DAILY','ANALYTICS.MARTS.DIM_CUSTOMERS','ANALYTICS.MARTS.FCT_MARKETING_ATTRIBUTION','ANALYTICS.MARTS.FCT_SUPPORT_TICKETS','ANALYTICS.MARTS.FCT_INVENTORY_DAILY','ANALYTICS.REPORTING.EXEC_KPIS']),
  ('HIGHTOUCH_SVC',  'REVERSE_ETL','BI_WH',   'hightouch', 'hourly',         1,  ['ANALYTICS.REVERSE_ETL.HUBSPOT_AUDIENCES']),
  ('STREAMLIT_APP',  'REPORTER',  'BI_WH',    'streamlit', 'business_hours', 35, ['ANALYTICS.MARTS.FCT_FEATURE_USAGE','ANALYTICS.MARTS.FCT_FEATURE_USAGE','ANALYTICS.MARTS.DIM_CUSTOMERS']),
  ('GSHEETS_SVC',    'REPORTER',  'BI_WH',    'sheets',    'weekly_monday',  1,  ['ANALYTICS.ANALYTICS_OLD.FCT_ORDERS_V1']),
  ('M.OKAFOR',       'FINANCE',   'ADHOC_WH', 'snowsight', 'month_start',    6,  ['ANALYTICS.REPORTING.BOARD_PACK_MONTHLY','ANALYTICS.MARTS.FCT_REVENUE_DAILY']),
  ('DS_NOTEBOOKS',   'DATA_SCIENCE','DS_WH',  'jupyter',   'weekly_thursday',12, ['RAW.APP.EVENTS','RAW.GA4.EVENTS','ANALYTICS.STAGING.STG_APP_EVENTS','ANALYTICS.MARTS.FCT_FEATURE_USAGE']),
  ('K.NAKAMURA',     'ANALYST',   'ADHOC_WH', 'snowsight', 'weekdays',       9,  ['ANALYTICS.MARTS.FCT_ORDERS','ANALYTICS.MARTS.DIM_CUSTOMERS','ANALYTICS.STAGING.STG_ORDERS','ANALYTICS.INTERMEDIATE.INT_ORDER_PAYMENTS','RAW.SHOPIFY.ORDERS']),
  ('A.LINDQVIST',    'ANALYST',   'ADHOC_WH', 'snowsight', 'weekdays',       7,  ['ANALYTICS.MARTS.FCT_MARKETING_ATTRIBUTION','ANALYTICS.STAGING.STG_GA4_SESSIONS','ANALYTICS.STAGING.STG_CONTACTS','ANALYTICS.MARTS.DIM_CUSTOMERS']),
  ('R.BELLO',        'ANALYST',   'ADHOC_WH', 'dbeaver',   'weekdays',       5,  ['ANALYTICS.MARTS.FCT_SUPPORT_TICKETS','ANALYTICS.STAGING.STG_TICKETS','ANALYTICS.MARTS.FCT_INVENTORY_DAILY'])
) AS t(user_name, role_name, warehouse_name, client, pattern, per_slot, reads);

CREATE OR REPLACE TABLE read_queries AS
WITH slots AS (
  SELECT c.*, d.day, n.n,
    CASE c.pattern
      WHEN 'hourly' THEN d.day + INTERVAL (n.n) HOUR + INTERVAL 20 MINUTE
      ELSE d.day + INTERVAL (8 * 60 + floor(rnd(c.user_name || d.day || n.n) * 600)::INT) MINUTE END AS start_time
  FROM consumers c
  JOIN days d ON CASE c.pattern
      WHEN 'business_hours'  THEN true
      WHEN 'hourly'          THEN true
      WHEN 'weekdays'        THEN dayofweek(d.day) BETWEEN 1 AND 5
      WHEN 'weekly_monday'   THEN dayofweek(d.day) = 1
      WHEN 'weekly_thursday' THEN dayofweek(d.day) = 4
      WHEN 'month_start'     THEN day(d.day) <= 3 END
  JOIN LATERAL range(CASE
      WHEN c.pattern = 'hourly' THEN 24
      WHEN c.pattern = 'business_hours' AND dayofweek(d.day) IN (0, 6) THEN c.per_slot // 8
      ELSE c.per_slot END) AS n(n) ON true
),
picked AS (
  SELECT *, reads[1 + floor(rnd(user_name || start_time || 'pick') * len(reads))::INT] AS tbl_read,
            'r-' || md5(user_name || start_time::VARCHAR || n)[1:20] AS query_id
  FROM slots
)
SELECT
  query_id,
  CASE client
    WHEN 'looker' THEN '-- Looker Query Context ''{"user_id":' || (1 + floor(rnd(query_id) * 180))::INT || ',"history_slug":"' || md5(query_id)[1:12] || E'","instance_slug":"duckoffee"}''\nSELECT\n    DATE_TRUNC(''week'', t."REPORT_DATE") AS "t.report_week",\n    COALESCE(SUM(t."NET_REVENUE_USD"), 0) AS "t.total_revenue"\nFROM ' || tbl_read || E' AS t\nGROUP BY 1\nORDER BY 1 DESC\nFETCH NEXT 500 ROWS ONLY'
    WHEN 'hightouch' THEN 'SELECT * FROM ' || tbl_read || ' /* hightouch sync 4471: hubspot_lifecycle_audiences */'
    WHEN 'streamlit' THEN 'SELECT feature_name, plan_tier, count(DISTINCT customer_id) AS customers FROM ' || tbl_read || ' WHERE usage_date >= dateadd(day, -30, current_date) GROUP BY 1, 2'
    WHEN 'sheets'    THEN 'SELECT ORDER_DATE, REGION, SUM(TOTAL) AS TOTAL FROM ' || tbl_read || ' WHERE ORDER_DATE >= DATEADD(week, -1, CURRENT_DATE) GROUP BY 1, 2 /* Google Sheets: Weekly Regional Sales (do not delete!!) */'
    WHEN 'jupyter'   THEN 'SELECT * FROM ' || tbl_read || ' SAMPLE (2) WHERE EVENT_DATE >= DATEADD(day, -90, CURRENT_DATE)'
    ELSE 'select * from ' || lower(tbl_read) || ' limit 1000'
  END AS query_text,
  split_part(tbl_read, '.', 1) AS database_name, split_part(tbl_read, '.', 2) AS schema_name,
  'SELECT' AS query_type, user_name, role_name, warehouse_name, '' AS query_tag, start_time,
  (200 + rnd(query_id || 't') * CASE WHEN client = 'jupyter' THEN 240000 ELSE 9000 END)::BIGINT AS total_elapsed_time,
  (rnd(query_id || 'b') * CASE WHEN client = 'jupyter' THEN 8e10 ELSE 4e8 END)::BIGINT AS bytes_scanned,
  (1 + rnd(query_id || 'r') * 500)::BIGINT AS rows_produced,
  [tbl_read] AS objects_read,
  []::VARCHAR[] AS objects_written
FROM picked;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Assemble query_history and access_history.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE all_queries AS
SELECT * FROM write_queries
UNION ALL BY NAME SELECT * FROM oneoff_queries
UNION ALL BY NAME SELECT * FROM read_queries;

CREATE OR REPLACE TABLE account_usage.query_history AS
SELECT
  q.query_id,
  q.query_text,
  q.database_name,
  q.schema_name,
  q.query_type,
  q.user_name,
  q.role_name,
  q.warehouse_name,
  CASE q.warehouse_name WHEN 'LOAD_WH' THEN 'X-Small' WHEN 'TRANSFORM_WH' THEN 'Medium'
       WHEN 'DS_WH' THEN 'Large' ELSE 'Small' END AS warehouse_size,
  q.query_tag,
  CASE WHEN rnd(q.query_id || 'fail') < 0.004 THEN 'FAIL' ELSE 'SUCCESS' END AS execution_status,
  q.start_time,
  q.start_time + to_milliseconds(q.total_elapsed_time) AS end_time,
  q.total_elapsed_time,
  q.bytes_scanned,
  q.rows_produced
FROM all_queries q
ORDER BY q.start_time;

CREATE OR REPLACE TABLE account_usage.access_history AS
SELECT
  q.query_id,
  q.start_time AS query_start_time,
  q.user_name,
  -- direct_objects_accessed: what the query text names. A CALL names nothing.
  CASE WHEN q.query_type = 'CALL' THEN []
       ELSE list_transform(q.objects_read, lambda o: {'objectName': o, 'objectDomain': 'Table'}) END AS direct_objects_accessed,
  -- base_objects_accessed: what was actually read underneath, including inside procedures.
  list_transform(q.objects_read, lambda o: {'objectName': o, 'objectDomain': 'Table'}) AS base_objects_accessed,
  list_transform(q.objects_written, lambda o: {'objectName': o, 'objectDomain': 'Table'}) AS objects_modified
FROM all_queries q
ORDER BY q.start_time;

-- Last write / last read per table, folded into account_usage.tables.
CREATE OR REPLACE TABLE account_usage.tables AS
WITH last_write AS (
  SELECT o AS fqn, max(start_time) AS last_altered FROM all_queries, unnest(objects_written) AS u(o) GROUP BY 1
)
SELECT
  c.db AS table_catalog, c.sch AS table_schema, c.tbl AS table_name,
  ('t-' || md5(c.fqn)[1:8]) AS table_id,
  CASE WHEN c.table_type = 'VIEW' THEN 'VIEW' WHEN c.table_type = 'EXTERNAL TABLE' THEN 'EXTERNAL TABLE' ELSE 'BASE TABLE' END AS table_type,
  CASE WHEN c.loader = 'dbt_table' THEN 'YES' ELSE 'NO' END AS is_transient,
  CASE WHEN c.db = 'RAW' THEN 'LOADER' WHEN c.loader LIKE 'dbt%' THEN 'TRANSFORMER' ELSE 'ANALYST' END AS table_owner,
  NULLIF(c.row_count, 0)::BIGINT AS row_count,
  NULLIF(c.bytes, 0)::BIGINT AS bytes,
  c.created::TIMESTAMP + INTERVAL 10 HOUR AS created,
  COALESCE(w.last_altered,
    CASE WHEN c.loader = 'legacy' THEN TIMESTAMP '2024-02-27 03:12:00' ELSE c.created::TIMESTAMP + INTERVAL 15 HOUR END) AS last_altered,
  CASE WHEN c.table_type = 'EXTERNAL TABLE' THEN 'gcs://duckoffee-ga4-export/events/' END AS location,
  CASE WHEN c.tbl IN ('FCT_ORDERS','STG_APP_EVENTS','STG_GA4_SESSIONS') THEN 'LINEAR(EVENT_DATE)' END AS clustering_key,
  CASE c.tbl
    WHEN 'FCT_ORDERS_V1' THEN 'DEPRECATED — use MARTS.FCT_ORDERS'
    WHEN 'HUBSPOT_AUDIENCES' THEN 'Synced to HubSpot by Hightouch'
  END AS comment,
  NULL::TIMESTAMP AS deleted
FROM catalog c LEFT JOIN last_write w USING (fqn)
ORDER BY c.ord;

-- Hourly credits per warehouse: busy fraction of the hour plus the 10-minute auto-suspend tail, × credits/hour for the size.
CREATE OR REPLACE TABLE account_usage.warehouse_metering_history AS
WITH busy AS (
  SELECT warehouse_name, any_value(warehouse_size) AS warehouse_size,
         date_trunc('hour', start_time) AS start_time,
         least(sum(total_elapsed_time) / 3.6e6, 1.0) AS busy_fraction
  FROM account_usage.query_history GROUP BY ALL
)
SELECT
  start_time,
  start_time + INTERVAL 1 HOUR AS end_time,
  warehouse_name,
  round(least(busy_fraction + 10 / 60.0, 1.0) * CASE warehouse_size
        WHEN 'X-Small' THEN 1 WHEN 'Small' THEN 2 WHEN 'Medium' THEN 4 WHEN 'Large' THEN 8 END, 3) AS credits_used_compute,
  round(busy_fraction * 0.04, 4) AS credits_used_cloud_services
FROM busy
ORDER BY start_time, warehouse_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Bonus 1: incremental loads. Seven days of app-event deliveries.
--    Delivery 5 is a redelivery of delivery 4. About 6% of events arrive a day or two late.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE incremental.app_event_deliveries AS
WITH events AS (
  SELECT
    e AS n,
    'evt_' || lpad(e::VARCHAR, 6, '0') AS event_id,
    TIMESTAMP '2026-10-26 00:00:00' + INTERVAL (floor(rnd(e || 'ts') * 7 * 86400)::INT) SECOND AS event_time,
    'cus_' || lpad((1 + floor(rnd(e || 'c') * 900))::INT::VARCHAR, 4, '0') AS customer_id,
    ['page_view','page_view','page_view','add_to_cart','checkout','search','search','share'][1 + floor(rnd(e || 'n') * 8)::INT] AS event_name
  FROM range(1, 14001) AS r(e)
),
assigned AS (
  SELECT *,
    -- daily delivery at 01:00 the next day; late events slip one or two deliveries
    datediff('day', DATE '2026-10-26', event_time::DATE) + 1
      + CASE WHEN rnd(n || 'late') < 0.06 THEN 1 + floor(rnd(n || 'late2') * 2)::INT ELSE 0 END AS delivery_id
  FROM events
)
SELECT delivery_id, TIMESTAMP '2026-10-26 01:00:00' + INTERVAL (delivery_id) DAY AS delivered_at,
       event_id, event_time, customer_id, event_name
FROM assigned WHERE delivery_id <= 7
UNION ALL
-- the redelivery: the upstream job retried and shipped delivery 4 again as delivery 5
SELECT 5, TIMESTAMP '2026-10-31 01:07:00', event_id, event_time, customer_id, event_name
FROM assigned WHERE delivery_id = 4
ORDER BY delivery_id, event_time;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Bonus 2: validation. fct_orders exported from Snowflake vs the migrated MotherDuck build.
--    Planted differences: timezone at the date boundary, FX rounding, a non-idempotent rerun,
--    and a load that ran while Snowflake was still being written to.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE TABLE validation.sf_fct_orders AS
SELECT
  1000000 + o AS order_id,
  'cus_' || lpad((1 + floor(rnd(o || 'c') * 9000))::INT::VARCHAR, 4, '0') AS customer_id,
  ordered_at,
  -- Snowflake account timezone is America/Los_Angeles (UTC-7 in this window)
  (ordered_at - INTERVAL 7 HOUR)::DATE AS order_date,
  currency,
  amount_local,
  round(amount_local * CASE currency WHEN 'EUR' THEN 1.0837 WHEN 'GBP' THEN 1.2719 ELSE 1 END, 2)::DECIMAL(38,2) AS amount_usd,
  ['paid','paid','paid','paid','refunded','partially_refunded'][1 + floor(rnd(o || 's') * 6)::INT] AS status
FROM (
  SELECT o,
    TIMESTAMP '2026-09-01 00:00:00' + INTERVAL (floor(rnd(o || 't') * 61 * 86400)::INT) SECOND AS ordered_at,
    ['USD','USD','USD','EUR','EUR','GBP'][1 + floor(rnd(o || 'cur') * 6)::INT] AS currency,
    round(8 + rnd(o || 'a') * 240, 2)::DECIMAL(38,2) AS amount_local
  FROM range(1, 60001) AS r(o)
);

CREATE OR REPLACE TABLE validation.md_fct_orders AS
WITH migrated AS (
  SELECT
    order_id, customer_id, ordered_at,
    ordered_at::DATE AS order_date,                -- forgot to pin the timezone: UTC dates
    currency, amount_local,
    -- double arithmetic, truncated instead of rounded
    (floor(amount_local::DOUBLE * CASE currency WHEN 'EUR' THEN 1.0837 WHEN 'GBP' THEN 1.2719 ELSE 1 END * 100) / 100)::DECIMAL(18,2) AS amount_usd,
    status
  FROM validation.sf_fct_orders
  -- the copy started while Snowflake was still loading the last hours
  WHERE ordered_at < (SELECT max(ordered_at) FROM validation.sf_fct_orders) - INTERVAL 3 HOUR
)
SELECT * FROM migrated
UNION ALL
-- an incremental run was retried without a unique key
SELECT * FROM migrated WHERE ordered_at >= TIMESTAMP '2026-10-14 00:00:00' AND ordered_at < TIMESTAMP '2026-10-14 06:00:00';

-- Clean up the scratch tables used to build everything above.
DROP TABLE all_queries; DROP TABLE read_queries; DROP TABLE consumers; DROP TABLE oneoff_queries;
DROP TABLE write_queries; DROP TABLE writes; DROP TABLE days; DROP TABLE catalog; DROP MACRO rnd;

-- Quick summary so you can see it worked.
SELECT 'account_usage.tables' AS tbl, count(*) AS row_count FROM account_usage.tables
UNION ALL SELECT 'account_usage.columns', count(*) FROM account_usage.columns
UNION ALL SELECT 'account_usage.query_history', count(*) FROM account_usage.query_history
UNION ALL SELECT 'account_usage.access_history', count(*) FROM account_usage.access_history
UNION ALL SELECT 'account_usage.warehouse_metering_history', count(*) FROM account_usage.warehouse_metering_history
UNION ALL SELECT 'incremental.app_event_deliveries', count(*) FROM incremental.app_event_deliveries
UNION ALL SELECT 'validation.sf_fct_orders', count(*) FROM validation.sf_fct_orders
UNION ALL SELECT 'validation.md_fct_orders', count(*) FROM validation.md_fct_orders;
