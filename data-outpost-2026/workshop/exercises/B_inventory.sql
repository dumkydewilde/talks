-- Exercise B · Inventory: everything Duckoffee owns, and what to do with each piece
--
-- Moving house rule: you don't pack the box before you know what's in it.
-- Goal: one row per table with enough evidence to put it in a bucket:
--   copy · rebuild · query in place · leave behind
-- Then turn it into a Dive the head ducks can read without SQL.
--
-- Same share as exercise A:
--   USE devtools_duckoffee_warehouse_lineage;
-- Reuse what you learned in A: who reads what, dead ends, the dropped table.

-- B1. Warm-up: what's there, and what's big?
SELECT table_catalog, table_schema, table_name, table_owner, table_type,
       round(bytes / 1e9, 1) AS gb, deleted < TIMESTAMP '9999-01-01' AS dropped, comment
FROM account_tables
ORDER BY bytes DESC;

-- B2. Who reads what? base_objects_accessed is a JSON array: unnest its objectId values and
--     join them to account_tables.table_id.
--     TODO: split reads into "dbt reading its parents" (DBT_SVC) and real consumers, and add
--     the readers and the last read per table.
SELECT
  unnest(json_extract_string(base_objects_accessed, '$[*].objectId'))::INTEGER AS table_id,
  count(*) AS n_reads
FROM access_history
GROUP BY ALL
ORDER BY n_reads DESC;

-- B3. TODO: one inventory row per table. Add:
--   - owner (LOADER, TRANSFORMER, LOOKER_ROLE) and whether it was dropped
--   - consumer reads, readers, last read
--   - what it costs to build: credits of the queries that write it
--     (access_history.objects_modified → query_metering_history)
--   - your proposed bucket and a one-line reason
-- Then: CREATE TABLE table_inventory AS ...   (in a database of your own)
--
-- Things to look out for (no spoilers, but they are in there):
--   - a table that no longer exists but is still queried every day
--   - scratch tables that belong to the BI tool, not to you
--   - one table that is far bigger and more expensive than everything else
--   - marts that cost credits every night and are read by nobody

-- B4. Make it a Dive. Prompt suggestion for the MotherDuck agent / MCP:
--   "Build a Dive over <your db>.main.table_inventory: a sortable table of every table with its
--    bucket, size, build credits and last read; bar charts of GB and credits per bucket; and a
--    highlight of tables that cost credits but have no consumer reads."
