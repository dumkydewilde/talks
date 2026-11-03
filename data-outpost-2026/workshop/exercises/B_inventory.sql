-- Exercise B · Inventory: everything Duckoffee owns, and what to do with each piece
--
-- Moving house rule: you don't pack the box before you know what's in it.
-- Goal: one row per table with enough evidence to put it in a bucket:
--   copy · rebuild · query in place · leave behind
-- Then turn it into a Dive that the head ducks can look at without reading SQL.
--
-- Reuse what you learned in exercise A: writes, reads and dead ends.

-- B1. Warm-up: what's big?
SELECT table_catalog, table_schema, table_name, table_type, row_count, round(bytes / 1e9, 1) AS gb, last_altered
FROM account_usage.tables
ORDER BY bytes DESC NULLS LAST;

-- B2. Who reads what? base_objects_accessed is a list of structs: unnest it.
--     TODO: add distinct readers and the last read per table. Leave out reads that are part of a
--     write (a dbt model reading its upstream): you want the consumers.
SELECT
  o.objectName AS fqn,
  count(*) AS n_reads
FROM account_usage.access_history, unnest(base_objects_accessed) AS u(o)
GROUP BY ALL
ORDER BY n_reads DESC;

-- B3. TODO: one inventory row per table. Add:
--   - who writes it (user_name of the writing query; dbt runs carry a query_tag with JSON)
--   - how often it's written
--   - complexity: column count, VARIANT columns (account_usage.columns), number of upstream tables
--   - size in GB
--   - your proposed bucket
-- Then: CREATE TABLE table_inventory AS ...
--
-- Three traps are hidden in there (no spoilers):
--   - a table nobody writes any more but somebody still reads
--   - a report that only runs once a month
--   - history that exists nowhere except in this warehouse

-- B4. Make it a Dive. Prompt suggestion for the MotherDuck agent / MCP:
--   "Build a Dive over <db>.main.table_inventory: a sortable table of every table with its
--    bucket, size and last read; bar charts of GB per bucket and per workload; and a
--    highlight of tables that are large but never read."
