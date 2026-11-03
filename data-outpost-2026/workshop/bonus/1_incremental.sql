-- Bonus 1 · Incremental loads that are safe to rerun
--
-- incremental.app_event_deliveries holds seven nightly deliveries of app events.
-- Two things went wrong upstream, like they always do:
--   - delivery 5 contains delivery 4 again (the upstream job retried)
--   - some events arrive one or two days late

-- 3a. Look at it.
SELECT delivery_id, delivered_at, count(*) AS events, min(event_time) AS first_event, max(event_time) AS last_event
FROM incremental.app_event_deliveries
GROUP BY ALL ORDER BY delivery_id;

-- 3b. The naive way: append each delivery as it arrives.
CREATE OR REPLACE TABLE events_append (event_id VARCHAR, event_time TIMESTAMP, customer_id VARCHAR, event_name VARCHAR);
-- run this once per delivery (1 → 7):
INSERT INTO events_append
SELECT event_id, event_time, customer_id, event_name
FROM incremental.app_event_deliveries WHERE delivery_id = 1;

-- TODO: load all 7 deliveries. How many rows vs distinct event_ids do you end up with?
-- TODO: now "accidentally" run delivery 3 again. What happened to daily event counts?

-- 3c. TODO: make it idempotent. Give the table a key and upsert:
--   CREATE TABLE events_merged (event_id VARCHAR PRIMARY KEY, ...);
--   INSERT OR REPLACE INTO events_merged SELECT ... WHERE delivery_id = ?;
-- (or MERGE INTO ... USING ... ON event_id). Rerun any delivery as often as you like.

-- 3d. TODO: late arrivals. A daily rollup that only recomputes "yesterday" misses late events.
--     Build daily_events from events_merged, recomputing a lookback window of N days on each run.
--     What's the smallest N that gives the same answer as a full rebuild?
