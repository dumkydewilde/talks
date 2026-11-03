# My migration action plan

Exercise D. Fill it in for your own warehouse, not Duckoffee's. One line per box is fine: it's a plan, not a novel.

## Why are we moving?

Cost, speed, a renewal date, a CFO with opinions…

## Stakeholders & consumers

Who reads the data, and how? Dashboards, data apps, sheets, reverse ETL syncs. Who signs off on "it works"?

| Consumer | Tool | How often | Owner |
| --- | --- | --- | --- |
|  |  |  |  |

## Key assets

The 5–10 tables or models that matter most. Mark anything that only exists in the old warehouse (copy it).

| Asset | Bucket (copy / rebuild / query in place / leave behind) | Size | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## First workload, and why

Small, independent, visible. Who will notice when it works?

## Data quality checks

Row counts, nulls, freshness, and the one number finance always asks about. Where will you watch them?

## Cutover & parallel run

How long do you run both? Which weekly or monthly report do you have to wait for? Who do you tell, and when?
