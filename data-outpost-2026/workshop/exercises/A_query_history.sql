-- Exercise A · What does Duckoffee's warehouse actually do all day?
--
-- Your warehouse has been quietly writing a diary: every query, who ran it, when, what it cost,
-- and which tables it touched. Seven months of it (2025-09-01 → 2026-03-31). Read the diary.
--
-- Attach the old warehouse (a public share, a synthetic Snowflake ACCOUNT_USAGE + dbt export):
ATTACH IF NOT EXISTS 'md:_share/dg_devtools_duckoffee_warehouse_lineage_s_bae5bc27_r1/dbcfb372-fef8-4d92-b997-26254d727cd0'
  AS devtools_duckoffee_warehouse_lineage;
USE devtools_duckoffee_warehouse_lineage;
--
-- Tables:
--   query_history            one row per query: text, type, user, warehouse, query_tag, timing, status
--   query_metering_history   credits per query (join on query_id)
--   access_history           per query: JSON arrays of tables read (base_objects_accessed) and written (objects_modified)
--   account_tables           every table: owner, type, size, and the dbt node in `comment`
--   dbt_models, dbt_run_results, dbt_invocations, dbt_exposures   the dbt side of the story
--
-- Three questions:
--   1. Loading patterns: what runs when, and has that changed?
--   2. Lineage: which table feeds which, and does that match what dbt says?
--   3. Dead ends: what does nobody read, and what is read but no longer exists?
-- Every step has an agent prompt for the MotherDuck MCP server. The SQL is there for when the agent gets creative.

-- A1. Loading patterns. Who writes, what kind of statement, and at what time of day?
--     Agent: "From query_history, show per user_name and query_type how many non-SELECT queries
--             ran per day, and at which hours of the day."
SELECT
  user_name,
  warehouse_name,
  query_type,
  count(*)                                                AS queries,
  round(count(*) / count(DISTINCT start_time::DATE), 1)  AS per_active_day,
  list(DISTINCT hour(start_time) ORDER BY hour(start_time)) AS hours_of_day
FROM query_history
WHERE query_type <> 'SELECT'
GROUP BY ALL
ORDER BY queries DESC;

-- A1b. TODO: when does the nightly dbt build finish? Use dbt_invocations (run_started_at,
--      run_completed_at) and group by week or month. Something changed. When, and which model
--      is to blame? (Hint: dbt_run_results.execution_time per model, before and after.)
--      Then: the Looker franchisee_morning_sales dashboard is read between 06:30 and 08:00.
--      How often did franchisees look at yesterday's data?

-- A2. Lineage. access_history knows which tables every write query read from.
--     Agent: "Build a table-level lineage graph from access_history (base_objects_accessed →
--             objects_modified, both JSON arrays) and draw it as Mermaid."
SELECT DISTINCT
  unnest(json_extract_string(base_objects_accessed, '$[*].objectName')) AS source,
  json_extract_string(objects_modified, '$[0].objectName')             AS target
FROM access_history
WHERE objects_modified <> '[]'
ORDER BY target, source;

-- A2b. TODO: compare with what dbt declares. dbt_models.depends_on_nodes lists the declared
--      parents, dbt_exposures lists the declared consumers (exposure name = query_tag).
--      Which observed reads are not declared anywhere? Look at both dbt models and consumers
--      (LOOKER_SVC, BI_TOOL_B_SVC, DATA_APP_SVC). Bonus: the stored procedures (query_type CALL)
--      read RAW tables, but where do they write?

-- A3. TODO: Dead ends, in both directions.
--   - Marts (database MARTS) that nothing except dbt has read since 2026-01-01.
--     How many, and what share of TRANSFORM_WH credits do they cost to build?
--   - Tables that are read, but no longer exist. account_tables.deleted tells you what was dropped,
--     query_history.execution_status and error_message tell you who noticed.

-- A4. Make it a Dive. Prompt suggestion:
--     "Build a Dive over devtools_duckoffee_warehouse_lineage. Show (1) nightly dbt completion time
--      per week with the 06:30 dashboard deadline as a line, (2) the table lineage as a graph with
--      undeclared edges in red, and (3) a list of dead-end marts with their build credits and the
--      dropped table that is still being queried."
