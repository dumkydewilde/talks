# Migrating your warehouse to MotherDuck · Data Outpost

A hands-on [Slidev](https://sli.dev) workshop: the technical steps and the process around moving a data warehouse to MotherDuck. Told through Duckoffee, a coffee chain run by ducks. **31 slides, ~90 minutes, 4 exercises.** Timings are in the presenter notes.

## Run

Node.js 22.12+ required.

```sh
npm ci
npm run dev        # http://localhost:3030, presenter at /presenter/1
npm run build
```

## Structure

The deck follows the migration flow from the [docs](https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/): decide → inventory → strategy → group → infra → move → validate → cut over.

| Slide | Interaction |
| --- | --- |
| 4 | Show of hands |
| 7 | `MigrationFlow`: the eight steps. After this, slides with `step:` in their frontmatter show a "you are here" strip in the header |
| 9 | `DataLandscape`: simplified a16z architecture; click a box for migration questions |
| 15 | `BucketBoard`: sort 12 tables into four buckets, then reveal |
| 20 | `ValuePyramid`: week slider; deep vs independent workload |
| 3, 7, 10–13, 18, 22, 28 | Step-through reveals with → (`v-click`, or `clicks:` in the frontmatter) |
| 23 | `IncrementalBuild`: a scripted 6-click story: append, late events, a retry that duplicates, MERGE, lookback window |
| 24 | `CopyThenContinue`: to-scale timeline of copy-once history + nightly builds behind one view (3 clicks) |
| 27 | `CutoverTimeline`: step through with → (5 clicks) |
| 14, 17, 26 | Exercises A, B, C with a countdown timer |
| 29 | Exercise D: `ActionPlan`, a fill-in plan saved in the browser, copyable as Markdown |

Ducks in `public/ducks/`: `duck-*.png` were generated with the Scenario "Motherduck pose generator (no background)" workflow (background knocked out), the others come from the MotherDuck illustration library. The book cover is *Fundamentals of Analytics Engineering* (Packt, 2024).

## Dataset

See [`workshop/README.md`](workshop/README.md). Exercises A–C run on public MotherDuck shares. The bonus exercises use `workshop/generate.sql`: `npm run generate:data` builds it locally (needs the `duckdb` CLI).

## Edit

- `slides.md`: copy, order, presenter notes and timings.
- `style.css`: base styles reused from the Helsinki deck, plus the workshop components.
- `components/`: interactive pieces.
- `config.ts`: all external links.
- `scripts/generate-follow-along.mjs`: regenerate the QR code if the URL changes.

## Sources

- Migration steps, SQL and gotchas: MotherDuck migration docs (parent plus the Snowflake, BigQuery and Redshift guides).
- Architecture: simplified from [a16z, Emerging Architectures for Modern Data Infrastructure](https://a16z.com/emerging-architectures-for-modern-data-infrastructure/).
- Ingestion steps: [Data ingestion pipelines without headaches](https://www.dumky.net/posts/data-ingestion-pipelines-without-headaches-8-simple-steps/).
- AngelList example: [Devin case study](https://devin.ai/customers/angellist). Redshift → Snowflake, 14,000 Metabase cards, 20 parallel agents, three weeks, as stated on that page.
- The dataset is synthetic. Durations on the value-pyramid slide are illustrative.
