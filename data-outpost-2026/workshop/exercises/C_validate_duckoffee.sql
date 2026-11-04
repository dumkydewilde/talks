-- Exercise C · Would you trust this data with your coffee money?
--
-- Duckoffee's data has "landed" in MotherDuck. Before anyone points a dashboard at it, you check
-- it. No old warehouse to compare against this time: just the data, your common sense, and a Dive.
--
-- Attach the share (it's public, free, and already full of coffee):
ATTACH IF NOT EXISTS 'md:_share/duckoffee/1877e7c6-96ea-4f88-a01f-3fed396ea7b8' AS duckoffee;
USE duckoffee;
--
-- Layers: raw_*  →  stg_*  →  orders, customers, order_facts, daily_revenue, customer_segments
--
-- There are at least six things in here that should make a data person squint.
-- Find as many as you can in 12 minutes. Then build the Dive that would have caught them.

-- C1. Nulls and shapes. SUMMARIZE gives you min, max, nulls and distinct counts per column.
SUMMARIZE orders;

-- C2. Row counts through the layers. Every order should survive the trip from raw to marts.
--     TODO: compare raw_orders, stg_orders, orders, order_facts. Which layer loses rows?
--     Is it on purpose? (Check which orders go missing: payment_status? items?)
SELECT 'raw_orders' AS layer, count(*) AS n FROM raw_orders
UNION ALL SELECT 'orders', count(*) FROM orders;

-- C3. Timestamps. TODO: Ask questions a barista could answer.
--     - When do people buy coffee? (hour of day)
--     - Do customers order before they registered?
--     - Does every cafe have orders after it opened? Does every cafe have orders at all?
--     - Do the summary tables cover the same date range as the orders?

-- C4. Categories. TODO: look at currency, payment_status, customer_type, status codes.
--     - Does the currency match the country of the cafe?
--     - Is an average order in JPY a plausible number of yen?
--     - raw_legacy_invoices uses status codes (P, C, X). Did they map cleanly in stg?

-- C5. Keys. TODO: are customer emails unique? Do legacy invoice numbers collide with order ids?

-- C6. Make it a Dive. Prompt suggestion:
--     "Build a data quality Dive over the duckoffee database: row counts per layer (raw → stg →
--      marts), null percentage per column for orders, orders per hour of day, orders per
--      currency per country, and a list of checks that fail, each with a red/green status."
--     Bonus: keep this Dive. It's your migration dashboard for the rest of the move.
