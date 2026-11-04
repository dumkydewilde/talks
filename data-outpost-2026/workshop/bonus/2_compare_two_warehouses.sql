-- Bonus 2 · Validate against the source before you cut over
--
-- validation.sf_fct_orders  = fct_orders exported from Snowflake (Parquet → MotherDuck)
-- validation.md_fct_orders  = the same model, rebuilt in MotherDuck
-- They don't match. Find every reason why. There are four.

-- 4a. Aggregate fingerprint, side by side. Hash checksums don't carry across engines; these do.
SELECT 'snowflake' AS side, count(*) AS row_count, count(DISTINCT order_id) AS distinct_keys,
       sum(amount_usd) AS amount_total, min(ordered_at) AS first_row, max(ordered_at) AS last_row
FROM validation.sf_fct_orders
UNION ALL
SELECT 'motherduck', count(*), count(DISTINCT order_id), sum(amount_usd), min(ordered_at), max(ordered_at)
FROM validation.md_fct_orders;

-- 4b. TODO: same fingerprint, per order_date. Where do the days disagree?

-- 4c. TODO: row-level diff on the key, both directions (EXCEPT / anti join).
--     Which orders are missing? Which are extra?

-- 4d. TODO: for matching order_ids, compare column by column. Which columns differ, and how often?

-- 4e. Write down the four causes and the fix for each. Then: which of these checks would you
--     keep running every day until cutover? Put them in a Dive.
