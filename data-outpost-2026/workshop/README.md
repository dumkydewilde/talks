# Workshop data & exercises

The story: **Duckoffee**, a coffee chain of 20 cafes in 14 cities (the same Duckoffee as the [Cloudflare Workers demo](https://motherduck.com/blog/motherduck-on-cloudflare-workers/)), is leaving Snowflake. You're the new data lead.

## Two datasets

**1. Duckoffee's old warehouse** (`generate.sql`, exercises A and B, bonus 1 and 2): a synthetic Snowflake `ACCOUNT_USAGE` export. It's a stand-in until the new synthetic dataset (query history plus dbt runs) is ready.

```sql
CREATE DATABASE duckoffee_legacy;
USE duckoffee_legacy;
-- paste generate.sql and run it
```

Or locally: `duckdb duckoffee_legacy.duckdb < generate.sql`. It runs in under a second and is deterministic, so everyone gets the same numbers.

| Schema | Tables | Used in |
| --- | --- | --- |
| `account_usage` | `tables`, `columns`, `query_history` (31k queries, 91 days), `access_history`, `warehouse_metering_history` | A, B |
| `incremental` | `app_event_deliveries`: 7 nightly deliveries, one redelivered, ~6% late events | Bonus 1 |
| `validation` | `sf_fct_orders` vs `md_fct_orders`, with four planted differences | Bonus 2 |
| `answers` | `table_buckets`: the answer key for B | Facilitator |

**2. Duckoffee's coffee orders** (public share, exercise C): 120k orders, raw → staging → marts.

```sql
ATTACH 'md:_share/duckoffee/1877e7c6-96ea-4f88-a01f-3fed396ea7b8' AS duckoffee;
```

## Exercises

- **A** `exercises/A_query_history.sql`: loading patterns, lineage and dead ends from query history, then a Dive.
- **B** `exercises/B_inventory.sql`: an inventory of every table, sorted into copy / rebuild / query in place / leave behind, then a Dive.
- **C** `exercises/C_validate_duckoffee.sql`: validate the coffee data (nulls, timestamps, categories, row counts per layer), then a data quality Dive.
- **D** `action-plan.md` (also interactive on the slide): your own plan, for your own warehouse.
- Bonus: `bonus/1_incremental.sql` (append vs merge, late data) and `bonus/2_compare_two_warehouses.sql` (find four differences between old and new).

`solutions.sql` has worked answers for all of them. The presenter notes in `../slides.md` list the expected numbers.

## Bring your own Snowflake

Run [md-migration-assessment](https://github.com/motherduckdb/md-migration-assessment) (Public Preview) or query `SNOWFLAKE.ACCOUNT_USAGE` directly. Exercises A and B work the same, with `LATERAL FLATTEN` in place of `unnest`. `ACCESS_HISTORY` needs Enterprise Edition.
