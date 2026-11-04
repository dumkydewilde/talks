# Workshop data & exercises

The story: **Duckoffee**, a coffee franchise (the same Duckoffee as the [Cloudflare Workers demo](https://motherduck.com/blog/motherduck-on-cloudflare-workers/)), is leaving Snowflake. You're the new data lead.

## Data

Everything is a MotherDuck share: one `ATTACH`, nothing to load.

**Duckoffee's old warehouse** (exercises A and B): seven months (2025-09-01 → 2026-03-31) of Snowflake-style `ACCOUNT_USAGE` plus the dbt project. Generated with DuckGen, release `20261103-bae5bc27-s-r1` ([manifest](https://us.data.motherduck.com/duckgen/devtools-duckoffee-warehouse-lineage/20261103-bae5bc27-s-r1/manifest.json)).

```sql
ATTACH 'md:_share/dg_devtools_duckoffee_warehouse_lineage_s_bae5bc27_r1/dbcfb372-fef8-4d92-b997-26254d727cd0'
  AS devtools_duckoffee_warehouse_lineage;
```

| Table | Rows | What |
| --- | ---: | --- |
| `query_history` | 459,365 | One row per query: text, type, user, warehouse, `query_tag`, timing, status |
| `query_metering_history` | 455,939 | Credits per query |
| `access_history` | 455,939 | Tables read and written per query, as JSON arrays (`objectName`, `objectId`) |
| `account_tables` | 74 | Every table, its owner and size; `comment` holds the dbt node |
| `sessions` | 29,680 | Client per session |
| `dbt_models`, `dbt_run_results`, `dbt_invocations`, `dbt_exposures` | 60 / 12,720 / 212 / 9 | The dbt side: declared lineage, run times, declared consumers |

**Duckoffee's coffee orders** (exercise C): 120k orders, raw → staging → marts.

```sql
ATTACH 'md:_share/duckoffee/1877e7c6-96ea-4f88-a01f-3fed396ea7b8' AS duckoffee;
```

## Exercises

- **A** `exercises/A_query_history.sql`: loading patterns, observed vs declared lineage, dead ends, then a Dive.
- **B** `exercises/B_inventory.sql`: an inventory of every table, sorted into copy / rebuild / query in place / leave behind, then a Dive.
- **C** `exercises/C_validate_duckoffee.sql`: validate the coffee data (nulls, timestamps, categories, row counts per layer), then a data quality Dive.
- **D** `action-plan.md` (also interactive on the slide): your own plan, for your own warehouse.
- Bonus: `bonus/1_incremental.sql` (append vs merge, late data) and `bonus/2_compare_two_warehouses.sql` (four differences between old and new). These run on `generate.sql`: `CREATE DATABASE duckoffee_legacy; USE duckoffee_legacy;` then paste it, or `duckdb duckoffee_legacy.duckdb < generate.sql` locally.

`solutions.sql` has worked answers for all of them. The presenter notes in `../slides.md` list the expected numbers. The A numbers match the answer keys DuckGen publishes for this release.

Reference Dives for A and B, to show after each exercise (source in `dives/`, styled like dataoutpost.ai):

- [Exercise A: what the warehouse does all day](https://app.motherduck.com/dives/data-outpost-exercise-a-what-the-warehouse-does-1a9433d3-d757-425b-8097-61d46f572062): five steps (what's in the logs, over time, readers, lineage, errors + dead ends)
- [Exercise B: everything Duckoffee owns](https://app.motherduck.com/dives/data-outpost-exercise-b-everything-duckoffee-owns-1196b18f-3e3a-4f13-ac5d-c202ca9a018d)

## Bring your own Snowflake

Run [md-migration-assessment](https://github.com/motherduckdb/md-migration-assessment) (Public Preview) or query `SNOWFLAKE.ACCOUNT_USAGE` directly. Exercises A and B use the same tables and columns; replace `json_extract_string(...)` + `unnest` with `LATERAL FLATTEN`. `ACCESS_HISTORY` needs Enterprise Edition.
