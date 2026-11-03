-- Exercise A · What does Duckoffee's warehouse actually do all day?
--
-- Your warehouse has been quietly writing a diary: every query, who ran it, when, and which
-- tables it touched. Read the diary. Three questions:
--   1. Loading patterns: what gets loaded, by whom, and how often?
--   2. Lineage: which table feeds which?
--   3. Dead ends: which tables does nobody (and nothing) ever read?
-- Then put it all in a Dive.
--
-- Tables (a simplified Snowflake ACCOUNT_USAGE export):
--   account_usage.query_history    one row per query: text, type, user, warehouse, query_tag, timing
--   account_usage.access_history   one row per query: which tables it read and which it wrote
--   account_usage.tables           every table, its size and type
--
-- Prefer to let an agent do the typing? Every step has a prompt you can paste into the
-- MotherDuck MCP server. The SQL is here for when the agent gets creative.

-- A1. Loading patterns. Who writes, what kind of statement, and at what time of day?
--     Agent: "From account_usage.query_history, show me per user_name and query_type how many
--             write queries (anything but SELECT) ran per day on average, and at which hours."
SELECT
  user_name,
  query_type,
  count(*)                                   AS queries,
  round(count(*) / count(DISTINCT start_time::DATE), 1) AS per_active_day,
  list(DISTINCT hour(start_time) ORDER BY hour(start_time)) AS hours_of_day
FROM account_usage.query_history
WHERE query_type <> 'SELECT'
GROUP BY ALL
ORDER BY queries DESC;

-- A1b. TODO: same question per *table* instead of per user. Unnest objects_modified from
--      access_history and count writes per table per day. Which tables load hourly, which
--      nightly, and which only once a month? (Hint: count(DISTINCT start_time::DATE).)

-- A2. Lineage. access_history already knows which tables a write query read from.
--     Agent: "Build a table-level lineage graph from account_usage.access_history
--             (base_objects_accessed → objects_modified) and draw it as Mermaid."
SELECT DISTINCT b.objectName AS source, m.objectName AS target
FROM account_usage.access_history,
     unnest(objects_modified)      AS u(m),
     unnest(base_objects_accessed) AS v(b)
WHERE b.objectName <> m.objectName
ORDER BY ALL;

-- A2b. TODO: try to get the same edges by parsing query_history.query_text instead
--      (regexp_extract_all on "from|join <db>.<schema>.<table>"). Which edges are missing?
--      Look at the query_type of the writes that went missing. Why can't text parsing see them?

-- A3. TODO: Dead ends. A table is a dead end when nothing reads it: no downstream table and no
--     person, dashboard or app. Start from account_usage.tables and anti-join everything that
--     shows up in base_objects_accessed. Then split them up:
--       - written but never read  → you are paying to load it for nobody
--       - not written, not read   → leave it behind (after asking around)
--       - not written, still read → careful: somebody depends on a table nothing updates

-- A4. Make it a Dive. Prompt suggestion:
--     "Build a Dive over account_usage in <your database>. Show (1) a heatmap of write queries
--      by hour of day and user_name, (2) the table lineage as a graph, coloured by schema,
--      and (3) a list of dead-end tables with their size in GB and last write."
