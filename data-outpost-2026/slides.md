---
theme: none
title: Moving your warehouse
titleTemplate: '%s · Data Outpost · MotherDuck'
author: Dumky de Wilde
info: |
  A hands-on workshop for Data Outpost: everything it takes to move your analytics from one
  warehouse to the next, technical and human. Told through Duckoffee, a coffee chain run by ducks.
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
layout: default
class: cover-slide
transition: fade
fonts:
  provider: none
  sans: Aeonik Fono
  mono: Aeonik Mono
favicon: /favicon.svg
monaco: false
record: false
wakeLock: false
selectable: true
presenter: true
drawings:
  enabled: true
  persist: false
defaults:
  layout: default
---

<div class="cover-grid">
  <div>
    <div class="eyebrow">DATA OUTPOST · HANDS-ON WORKSHOP</div>
    <h1>Moving your<br />warehouse.</h1>
    <p class="cover-subtitle">Without spilling<br /><span class="underlined">the coffee</span></p>
    <div class="speaker-line"><strong>Dumky de Wilde</strong><span>Developer &amp; Agent Experience Engineer · MotherDuck</span></div>
    <div class="follow-along"><img src="/follow-along.svg" alt="QR code linking to the slides" /><div><strong>Follow along</strong><span>Slides, data and exercises</span><a href="https://dumkydewilde.github.io/talks/data-outpost-2026/" target="_blank" rel="noopener noreferrer">Open the slides ↗</a></div></div>
  </div>
  <div class="cover-art">
    <div class="orbit-label label-one">DECIDE · INVENTORY · MOVE · VALIDATE · CUT OVER</div>
    <img class="cover-duck" src="/ducks/duck-moving-box.png" alt="A duck carrying a moving box labelled office moving" />
    <div class="orbit-label label-two">ONE WORKLOAD AT A TIME.</div>
    <div class="cover-stamp"><span>90 MIN</span><span>4 EXERCISES · BRING A LAPTOP</span></div>
  </div>
</div>

<!--
00:00–00:30
Welcome. Laptops out, we'll use them. Scan the QR code: the slides are interactive and the exercises live in there too.
-->

---
title: Who am I
section: INTRO
---

<div class="whoami">
<div>
<div class="eyebrow">HELLO, I’M DUMKY</div>

# I’ve moved a lot of other people’s data.

<ol class="numbered">
  <li><span>Data engineering consultant for years<small>Moved companies between platforms, built warehouses from scratch, got dbt running. Saw migrations go well, and a lot more of the other kind.</small></span></li>
  <li><span>Co-wrote the book on it<small><em>Fundamentals of Analytics Engineering</em> (Packt, 2024), with six fellow data nerds.</small></span></li>
  <li><span>Now at MotherDuck<small>Developer &amp; agent experience. I still get to play with other people’s data.</small></span></li>
</ol>
</div>
<figure class="book-cover">
  <img src="/fundamentals-of-analytics-engineering.jpg" alt="Cover of the book Fundamentals of Analytics Engineering, Packt, first edition" />
  <figcaption>Fundamentals of Analytics Engineering · Packt</figcaption>
</figure>
</div>

<!--
00:30–02:00
Keep it short. The point: I've done this many times, and most of what goes wrong isn't technical.
-->

---
title: It's not you, it's me
section: INTRO
---

<div class="duck-aside">
<div>
<div class="eyebrow">A DIFFICULT CONVERSATION</div>

# It’s not you. It’s me.

<p class="big-quote">There comes a day when you realise you and your data warehouse just aren’t a match anymore.</p>
<p class="big-quote">You’ve grown. You’ve changed. The chemistry isn’t there.<br /><em v-click>Also, it’s really expensive.</em></p>
</div>
<img src="/ducks/duck-breakup.png" alt="A duck at a cafe table with a coffee, telling a database cylinder: I think we need to normalize our relationship" />
</div>

<!--
02:00–03:00
Play it straight, let the last line land. Then: breaking up is the easy part. Moving out is where it gets messy. Who keeps the dashboards? Who tells the finance team?
-->

---
title: Who's moving?
section: INTRO
---

<div class="eyebrow">QUICK SHOW OF HANDS</div>

# How’s your relationship with your warehouse?

<ShowOfHands :options="[
  { title: 'Thinking about leaving', detail: 'The invoice arrived. You’ve been browsing other warehouses at night.' },
  { title: 'Moving out right now', detail: 'Half your stuff is in boxes. Both places have a key.' },
  { title: 'Moved recently', detail: 'You survived a cutover. You have stories.' },
]" />

<!--
03:00–04:00
Ask all three, click the biggest group.
If someone moved recently: what took longest? It's almost never copying the data. That's the hook for the rest of the session.
-->

---
title: Meet Duckoffee
section: INTRO
---

<div class="duck-aside">
<div>
<div class="eyebrow">TODAY’S CLIENT</div>

# Meet Duckoffee.

<ol class="numbered">
  <li><span>20 cafes in 14 cities<small>From The Pond Stage in Amsterdam to Ahiru Roast in Tokyo. Run by the head ducks.</small></span></li>
  <li><span>A very normal data stack<small>Snowflake, dbt with 60 models, two stored procedures, Looker plus a second BI tool, three data apps, and twelve analysts with a SQL editor.</small></span></li>
  <li><span>You’re the new data lead<small>The Snowflake contract renews in four months. The head ducks would like to not renew it. Congratulations!</small></span></li>
</ol>
</div>
<img src="/ducks/duck-barista.png" alt="A duck barista in a green apron holding a steaming cup of coffee" />
</div>

<!--
04:00–05:00
Duckoffee is the coffee chain from our Cloudflare Workers demo. Today they're leaving Snowflake.
Everything in the exercises is Duckoffee: their query history, their tables, their (slightly questionable) data.
-->

---
title: Goal for today
section: INTRO
---

<div class="eyebrow">THE GOAL</div>

# Leave feeling ready to move all of your company’s analytics.

<div class="three-col">
  <div>
    <span class="card-index">THE STEPS</span>
    <h3>What actually happens</h3>
    <p>Eight steps, in order, with the bits that go wrong. Technical and human.</p>
  </div>
  <div>
    <span class="card-index">THE EXERCISES</span>
    <h3>Four of them</h3>
    <p>A: read the query history. B: build an inventory. C: validate the data. D: write your own plan.</p>
  </div>
  <div class="highlight">
    <span class="card-index">THE TAKEAWAY</span>
    <h3>A plan for Monday</h3>
    <p>Three Dives and a one-page action plan for your own warehouse.</p>
  </div>
</div>

<!--
05:00–06:00
Set expectations: this is not a MotherDuck sales pitch. Almost everything applies whatever warehouse you're moving to.
-->

---
title: The whole migration on one line
section: INTRO
clicks: 2
---

<div class="eyebrow">THE MAP FOR TODAY</div>

# Eight steps. The last three repeat.

<MigrationFlow reveal />

<p v-click="2" class="bottom-line">A workload is done when its consumers read from the new place, its pipelines write there on a schedule, and nothing in the old warehouse has to run.</p>

<!--
06:00–07:00
Walk the line left to right. Steps 1–5 you do once. Steps 6–8 you do per workload: move, validate, cut over, next.
You'll see these eight steps at the top of every slide from here on, so you always know where we are.
The definition of done is deliberately strict: not "the data is there", but "the old warehouse doesn't have to run for this".
-->

---
title: Get set up
section: SETUP
---

<div class="eyebrow">3 MINUTES · DO THIS NOW</div>

# Grab Duckoffee’s data

<div class="setup-steps">
  <div>
    <span class="card-index">A + B · THE OLD WAREHOUSE</span>
    <h3>Duckoffee’s Snowflake diary</h3>
    <p>Seven months of query and access history, credits, and the whole dbt project. 459k queries, 74 tables.</p>

```sql
ATTACH 'md:_share/dg_devtools_duckoffee_warehouse_lineage_s_bae5bc27_r1/dbcfb372-fef8-4d92-b997-26254d727cd0'
  AS devtools_duckoffee_warehouse_lineage;
```

  </div>
  <div>
    <span class="card-index">C · THE DATA ITSELF</span>
    <h3>Duckoffee’s coffee orders</h3>
    <p>A public share: 120k orders, raw to marts.</p>

```sql
ATTACH 'md:_share/duckoffee/1877e7c6-96ea-4f88-a01f-3fed396ea7b8'
  AS duckoffee;
```

  </div>
  <div>
    <span class="card-index">TOOLS</span>
    <h3>Use what you like</h3>
    <p>MotherDuck UI, the DuckDB CLI, or your agent via the MotherDuck MCP server. Every exercise has an agent prompt and plain SQL.</p>
    <p><a href="https://github.com/dumkydewilde/talks/tree/main/data-outpost-2026/workshop" target="_blank" rel="noopener noreferrer">Workshop files ↗</a></p>
    <div class="setup-qr"><img src="/follow-along.svg" alt="QR code linking to the slides" /><span>Slides, exercises<br />and links</span></div>
  </div>
</div>

<!--
07:00–10:00
Walk around. Both are MotherDuck shares: one ATTACH each, nothing to load. Check before the event that the DuckGen share is attachable from a fresh account outside the MotherDuck org.
A + B: a DuckGen release (devtools-duckoffee-warehouse-lineage, 20261103-bae5bc27-s-r1), shaped like Snowflake ACCOUNT_USAGE plus dbt artifacts.
Own Snowflake account? The md-migration-assessment collector gives you the same tables for your own account. Link on the last slide. Needs Enterprise Edition for ACCESS_HISTORY.
-->

---
title: What does your data landscape look like?
class: compact-slide
section: 01 · DECIDE
step: 1
clicks: 7
---

# First, what are we actually moving?

<DataLandscape />

<!--
10:00–12:00
A warehouse migration is never just a warehouse migration. It touches every box here. Click a few and read one question each.
The next slides go through the boxes one at a time.
-->

---
title: Ingestion
section: 01 · DECIDE
step: 1
clicks: 1
---

<div class="eyebrow">INGESTION · EVERY PIPELINE DOES THE SAME 8 THINGS</div>

# Moving a pipeline? Check all eight.

<div class="ingest-steps" :class="{ hurt: $clicks >= 1 }">
  <div class="ask"><span class="card-index">01 TRIGGER</span><strong>When does it run?</strong><p>Schedule, event, or “whenever Kenji remembers”. Who triggers it after the move?</p></div>
  <div class="ask"><span class="card-index">02 CONNECTION</span><strong>Who does it log in as?</strong><p>Service accounts, keys, network rules. All new on the other side.</p></div>
  <div class="ask"><span class="card-index">03 STATE</span><strong>Where did it leave off?</strong><p>Cursors and watermarks live somewhere. Move them, or you load everything twice.</p></div>
  <div><span class="card-index">04 EXTRACT</span><strong>Pull the data</strong><p>Usually unchanged. The source doesn’t care where you’re going.</p></div>
  <div><span class="card-index">05 TRANSFORM</span><strong>Light cleanup</strong><p>Dedupe, PII, reshaping. Check for SQL dialect surprises.</p></div>
  <div><span class="card-index">06 VALIDATE</span><strong>Schema &amp; checks</strong><p>Uniqueness, nulls, types. Port these first.</p></div>
  <div class="ask"><span class="card-index">07 LOAD</span><strong>Can it write to the new place?</strong><p>Some connectors only speak one warehouse. Find out now.</p></div>
  <div><span class="card-index">08 ARCHIVE</span><strong>Retention</strong><p>How long, where, and who deletes on request.</p></div>
</div>

<p class="small-callout">From <a href="https://www.dumky.net/posts/data-ingestion-pipelines-without-headaches-8-simple-steps/" target="_blank" rel="noopener noreferrer">Data ingestion pipelines without headaches: 8 simple steps ↗</a>. Click: the blue ones are where migrations hurt.</p>

<!--
12:00–14:00
Trigger, connection, state, load: those change when you move. Extraction mostly doesn't.
State is the sneaky one. If your incremental cursor lives in the old warehouse, your first load on the new side will either reload everything or skip data.
-->

---
title: Transformations and metrics
section: 01 · DECIDE
step: 1
---

<div class="eyebrow">TRANSFORMATIONS &amp; METRICS</div>

# Where does the logic live?

<div class="two-col">
<div>

<ol class="numbered">
  <li><span><strong>You use dbt</strong><small>Lovely. The manifest tells you most of it. Most, because nobody has <em>everything</em> in dbt.</small></span></li>
  <li><span><strong>You don’t (or not for everything)</strong><small>Query history knows. Every stored procedure, scheduled query and analyst’s Airflow DAG left a trace.</small></span></li>
  <li><span><strong>Either way: talk to humans</strong><small>Ask who owns the revenue number. Ask again. Get two answers.</small></span></li>
</ol>

</div>
<div>

<p class="small-callout">Your call: move the logic as it is, or put it in dbt on the way. As-is is easier to compare. dbt-on-the-way means you only translate it once.</p>

<br />

<p class="small-callout">Metrics are logic too. If “revenue” is defined inside a BI tool, it moves when the BI tool moves, not when the warehouse does.</p>

</div>
</div>

<!--
14:00–15:00
Exercise A is exactly this: we'll rebuild the lineage from the query history in a few minutes.
-->

---
title: Data quality, archival and backup
section: 01 · DECIDE
step: 1
---

# The two things nobody puts on the plan

<div class="two-col">
<div>
<span class="card-index">DATA QUALITY CHECKS</span>

### Your proof that the move worked

<ol class="numbered">
  <li><span>What checks run today?<small>dbt tests, row counts, freshness alerts, “Ana looks at it on Monday”.</small></span></li>
  <li><span>Port them before anything else<small>Without them you can’t tell “moved” from “moved and broken”.</small></span></li>
</ol>

</div>
<div v-click>
<span class="card-index">ARCHIVAL, RETENTION &amp; BACKUP</span>

### How, how often, and where?

<ol class="numbered">
  <li><span>Time Travel isn’t a backup<small>And it doesn’t move with you. Neither does Fail-safe.</small></span></li>
  <li><span>Keep a copy somewhere else<small>Parquet in S3 or GCS, off site, on a schedule you’ve actually tested.</small></span></li>
</ol>

</div>
</div>

<!--
15:00–16:00
Quick slide. Legal holds and deletion requests also live here. Ask whoever does compliance before you drop anything.
-->

---
title: Consumers
section: 01 · DECIDE
step: 1
---

<div class="eyebrow">CONSUMERS · THE PEOPLE WHO WILL EMAIL YOU</div>

# Who reads the data, and how?

<div class="consumer-cols">
  <div v-click>
    <span class="card-index">01</span>
    <h3>Reverse ETL &amp; signals</h3>
    <p>Duckoffee has none (yet). Elsewhere: audiences synced to the CRM, alerts when a cafe’s sales drop.</p>
    <p class="trap">Trap: they write into other systems. Break them and marketing emails the wrong ducks.</p>
  </div>
  <div v-click>
    <span class="card-index">02</span>
    <h3>Data apps &amp; sheets</h3>
    <p>A supply planner, royalty statements, and <code>cafe_ops</code>, which polls three marts every 30 seconds and isn’t declared anywhere.</p>
    <p class="trap">Trap: nobody remembers they exist until Monday morning.</p>
  </div>
  <div v-click>
    <span class="card-index">03</span>
    <h3>BI tools</h3>
    <p>Looker for the head ducks, a second BI tool for franchisees, and a morning-sales dashboard opened at 06:30 sharp.</p>
    <p class="trap">Trap: monthly reports. A two-week test run won’t catch them.</p>
  </div>
</div>

<!--
16:00–18:00
Ask the room: which of these do you have that nobody has a list of? Usually: sheets.
You find all of them in query history: every one of these logs in as some user and runs SELECTs. That's Exercise A.
-->

---
title: "Exercise A: Read the query history"
class: exercise-slide
section: 01 · DECIDE
step: 1
dive: https://app.motherduck.com/dives/data-outpost-exercise-a-what-the-warehouse-does-1a9433d3-d757-425b-8097-61d46f572062/presentation
---

<div class="exercise-head">
<div>
<span class="exercise-badge">EXERCISE A · 15 MIN</span>

# Read your warehouse’s diary

</div>
<ExerciseTimer :minutes="15" />
</div>

<div class="exercise-grid">
<ol class="numbered">
  <li><span><strong>Loading patterns</strong><small>What runs when? When does the nightly dbt build finish, and has that changed?</small></span></li>
  <li><span><strong>Lineage</strong><small>Observed reads from <code>access_history</code> vs what dbt declares. What’s missing?</small></span></li>
  <li><span><strong>Dead ends</strong><small>Marts nobody reads. And the opposite: a table that’s gone but still queried.</small></span></li>
  <li><span><strong>Make it a Dive</strong><small>Nightly finish time, lineage graph, dead ends.</small></span></li>
</ol>
<div class="exercise-side">
  <div class="exercise-file">workshop/exercises/A_query_history.sql</div>
  <p class="small-callout">Agent prompt: “Read query_history, access_history and the dbt tables. When does the nightly build finish? Draw the lineage as Mermaid, flag edges dbt doesn’t declare, and list every mart nothing reads.”</p>
  <p class="small-callout">Your own Snowflake? Same tables in <code>SNOWFLAKE.ACCOUNT_USAGE</code>, with <code>LATERAL FLATTEN</code> instead of <code>json_extract</code>.</p>
</div>
</div>

<!--
18:00–33:00
Start the timer. Walk around.
Answers in workshop/solutions.sql, section A.
Debrief (2 min):
- Patterns: procedures at 01:00, dbt from 02:00, done by ~05:30. Until 2026-02-02: then it finishes ~07:30. fct_ticket_lines went from 4 to 50 minutes, 0.4M to 120M rows a run. A broken is_incremental filter rebuilds it in full every night. Since then ~70% of the 06:30–08:00 morning-sales views show yesterday's data. (That's the incremental slide, for real.)
- Lineage: 14 reads dbt doesn't declare. Marketing's Looker explores read RAW_ADS and RAW_LOYALTY directly. cafe_ops reads three marts with no exposure. A dbt staging model reads a Looker PDT. The stored procedures read RAW tables but their writes don't show up at all.
- Dead ends: 8 of 32 marts have no reads outside dbt: 6.4% of the transform bill for nobody.
- The opposite: RAW_POS.PUBLIC.TICKETS was dropped on 2026-02-16 after POS moved to RAW_POS_V2. The royalty app and SP_CALC_FRANCHISE_ROYALTIES still query it: 3,400+ failed queries. That's what an unfinished migration looks like.
-->

---
title: Four buckets
class: compact-slide
section: 02 · INVENTORY
step: 2
---

# Everything you own goes in one of four boxes.

<BucketBoard />

<!--
33:00–36:00
Copy: data that exists nowhere else. SCD2 snapshots, hand uploads, history from a prod DB that only keeps current state.
Rebuild: anything you can re-derive. Idempotent dbt models, connectors that can re-sync. Rebuilding beats copying when you have the choice: you also prove the pipeline works.
Query in place: data already in S3, GCS or Iceberg. Don't move it, point at it.
Leave behind: decided by query and access history, not by gut feeling. Sorry, FCT_MART_57.
Let the room shout answers, click to sort, then reveal. The traps: RAW_POS.PUBLIC.TICKETS (gone, but still queried), the Looker PDT (not yours to move), and FCT_TICKET_LINES (the only copy). Nothing at Duckoffee lives in object storage, so nothing is query in place. That's a finding too.
-->

---
title: Sort by bucket, size and complexity
section: 02 · INVENTORY
step: 2
---

<div class="duck-aside">
<div>
<div class="eyebrow">THEN SORT THE BOXES</div>

# Bucket, size, complexity.

<ol class="numbered">
  <li><span><strong>Bucket</strong><small>Who writes it? Can that source replay history?</small></span></li>
  <li><span><strong>Size</strong><small>GB and rows decide how long a copy or rebuild takes.</small></span></li>
  <li><span><strong>Complexity</strong><small>How many upstreams, semi-structured columns, procedures, consumers.</small></span></li>
</ol>

<p class="small-callout">Query history goes back a year in Snowflake, 180 days in BigQuery, and about a week in Redshift. On Redshift? Start saving it today.</p>
</div>
<img src="/ducks/duck-packing.png" alt="A duck in a cap carrying a box full of folders" />
</div>

<!--
36:00–37:00
Everything you need for this is already logged. Snowflake: ACCOUNT_USAGE. BigQuery: INFORMATION_SCHEMA.JOBS per region. Redshift: SYS_QUERY_HISTORY, but only for about a week.
-->

---
title: "Exercise B: Build the inventory"
class: exercise-slide
section: 02 · INVENTORY
step: 2
dive: https://app.motherduck.com/dives/data-outpost-exercise-b-everything-duckoffee-owns-1196b18f-3e3a-4f13-ac5d-c202ca9a018d/presentation
---

<div class="exercise-head">
<div>
<span class="exercise-badge">EXERCISE B · 12 MIN</span>

# Pack Duckoffee’s boxes

</div>
<ExerciseTimer :minutes="12" />
</div>

<div class="exercise-grid">
<ol class="numbered">
  <li><span>What’s big? Start from <code>account_usage.tables</code>.</span></li>
  <li><span>Who reads it, how often, and when last?</span></li>
  <li><span>Who writes it, and how complex is it?</span></li>
  <li><span>Pick a bucket per table. Save it as <code>table_inventory</code>.</span></li>
  <li><span>Make it a Dive<small>GB per bucket, GB per workload, “big but never read”.</small></span></li>
</ol>
<div class="exercise-side">
  <div class="exercise-file">workshop/exercises/B_inventory.sql</div>
  <p class="small-callout">Reuse your answers from exercise A: write patterns and dead ends are half the work.</p>
  <p class="small-callout">Three traps: a table nobody writes but somebody reads, a report that only runs on the 1st, and history that exists nowhere else.</p>
</div>
</div>

<!--
37:00–49:00
Answers: solutions.sql section B, and the answers.table_buckets table.
Debrief: the heuristic in solutions.sql puts 61 tables in rebuild, 12 in leave behind, 1 in copy. Then the human questions: can the loaders re-sync full history? Does anyone need the POS history that was in the dropped table? In real life the last 10% of tables needs a conversation, not a query.
-->

---
title: Lift and shift, greenfield, or both
section: 03 · STRATEGY
step: 3
---

# Lift and shift, greenfield, or both?

<div class="three-col">
  <div v-click>
    <span class="card-index">01</span>
    <h3>Lift &amp; shift</h3>
    <p>Same models, same names, translated SQL. Easy to check: old and new should match row for row.</p>
    <p class="verdict">FASTEST TO PROVE · BRINGS THE MESS ALONG</p>
  </div>
  <div v-click>
    <span class="card-index">02</span>
    <h3>Greenfield</h3>
    <p>Start over from the sources. Very clean. Nothing to compare against, and every consumer has to change.</p>
    <p class="verdict">PRETTIEST · HARDEST TO PROVE RIGHT</p>
  </div>
  <div v-click class="highlight">
    <span class="card-index">03</span>
    <h3>Lift, shift &amp; improve</h3>
    <p>Move it, prove it matches, then fix what the old warehouse forced on you. Models that were incremental only to save money can become plain tables. Use what the old place didn’t have.</p>
    <p class="verdict">USUALLY THE RIGHT CALL</p>
  </div>
</div>

<!--
49:00–51:00
Greenfield sounds like a fresh start after a breakup. It's also how you end up with two half-finished warehouses.
Improve examples: drop extract tables made for the BI tool, simplify oversized incrementals, replace a few dashboards with Dives.
-->

---
title: Lineage tells you what moves together
section: 04 · GROUP
step: 4
---

<div class="eyebrow">NO LINEAGE, NO PLAN</div>

# Find what can move on its own.

<div class="two-col">
<div>

<ol class="numbered">
  <li><span>A <strong>workload</strong> is tables + pipelines + consumers that cut over together.</span></li>
  <li><span>Shared tables tie workloads together<small>Duckoffee’s <code>FCT_TICKET_LINES</code> feeds morning sales, royalties and the <code>cafe_ops</code> app. Move it with care, on its own.</small></span></li>
  <li><span>No dbt everywhere? Let your agent read the query history.<small>dbt query tags make this much easier.</small></span></li>
</ol>

</div>
<div>

```sql
-- table → table edges, from what was actually read and written
SELECT DISTINCT
  unnest(json_extract_string(base_objects_accessed,
                             '$[*].objectName')) AS source,
  json_extract_string(objects_modified,
                      '$[0].objectName')      AS target
FROM access_history
WHERE objects_modified <> '[]';
```

<p class="small-callout">On query tags: <a href="https://www.dumky.net/posts/optimizing-snowflake-costs-with-dbt-query-tags/" target="_blank" rel="noopener noreferrer">Optimizing Snowflake costs with dbt query tags ↗</a></p>

</div>
</div>

<!--
51:00–53:00
You built this lineage in exercise A. Now use it: groups of tables with no edges between them can move independently.
For Duckoffee: everything downstream of POS tickets (fct_ticket_lines → morning sales, royalty base, cafe_ops) moves together. Ask the room which group they'd move first, and why.
-->

---
title: Value only comes at the end
section: 04 · GROUP
step: 4
---

<div class="eyebrow">THEN PICK WHAT GOES FIRST</div>

# Nobody sees value until the top of the pyramid.

<ValuePyramid />

<!--
53:00–55:00
Drag the slider slowly. Finance needs every layer before one dashboard reads from the new warehouse. Weeks of work, nobody notices.
The loyalty app reads events in place, has one model, and is live in week 3.
Priority rule: start with something small, independent and visible. You learn the whole path end to end, and the head ducks see progress early. Durations are illustrative.
-->

---
title: Three things every workload needs
section: 05 · INFRA
step: 5
---

<div class="duck-aside">
<div>

# Set up the boring stuff once.

<ol class="numbered">
  <li><span><strong>Credentials &amp; secrets</strong><small>One service account per job: loading, transforming, reading. Separate dev and prod. Tokens in a secret manager, not in a repo.</small></span></li>
  <li><span><strong>Git repos</strong><small>dbt, Terraform, Airflow, ingestion. MotherDuck has a <a href="https://motherduck.com/integrations/dev-tools/terraform/" target="_blank" rel="noopener noreferrer">Terraform provider ↗</a>.</small></span></li>
  <li><span><strong>Compute to run it</strong><small>One-time loads, recurring ingestion and transformations, and CI/CD.</small></span></li>
</ol>
</div>
<img src="/ducks/builder_duck_plans_hard_hat.png" alt="A duck in a hard hat reading building plans" />
</div>

<p class="bottom-line">Snowflake habit to unlearn: in MotherDuck a database belongs to whoever made it. Share it to give others access.</p>

<!--
55:00–57:00
Boring, and it blocks you for weeks if you skip it.
Flights can run Python on a schedule inside MotherDuck itself; the cookbook has recipes for Snowflake and S3 ingestion.
-->

---
title: Move in this order
section: 06 · MOVE
step: 6
---

<div class="eyebrow">PER WORKLOAD</div>

# Move it in this order.

<div class="two-col">
<div>

<ol class="numbered">
  <li><span><strong>Quality checks first</strong><small>Row counts, sizes, nulls, freshness. Running before anything moves.</small></span></li>
  <li v-click><span><strong>Land raw data</strong> → validate<small>Repoint or duplicate ingestion. Copy what can’t be rebuilt.</small></span></li>
  <li v-click><span><strong>Port transformations</strong> → validate<small>Dialect fixes, timezones, number types.</small></span></li>
  <li v-click><span><strong>Repoint consumers</strong>, one at a time<small>Cutover, coming up.</small></span></li>
</ol>

</div>
<div>

<p class="small-callout">A Dive makes a great migration dashboard: tables landed, row-count differences, checks passing. Everyone looks at the same screen. Fewer status meetings!</p>

<br />

<p class="small-callout">Snowflake traps: <code>NUMBER(38,0)</code> becomes a huge <code>DECIMAL</code> (cast to <code>BIGINT</code>). Pin timezones in models. Streams and Tasks become Flights.</p>

</div>
</div>

<!--
57:00–58:00
Checks first is the step everyone skips. A Dive works great for this, and you'll build one in exercise C.
-->

---
title: Incremental loads, safely
class: compact-slide
section: 06 · MOVE
step: 6
clicks: 6
---

<div class="eyebrow">IDEMPOTENT = SAFE TO RUN TWICE</div>

# Incremental data piles up over time. So do mistakes.

<IncrementalBuild />

<!--
58:00–61:00
Six clicks, the caption on the slide tells the story:
1. Nights 1–2 appended. The dashed chip is a late event: it belongs to day 1.
2. Night 3. Rows = events.
3. Night 3 retried with INSERT: every chip of that night is in there twice. Day 3 counts double.
4. Same runs with MERGE on event_id: the retry overwrites. Duplicates back to 0.
5. Night 4 and a retry: nothing changes. Idempotent.
6. Night 4 also brought events for days 2 and 3 (hatched). A rollup that only rebuilds "yesterday" misses them: use a lookback window.
Why this matters: you'll rerun loads constantly while you move and check things. Every rerun has to be safe.
Duckoffee's own version, from exercise A: a broken is_incremental filter quietly turned fct_ticket_lines into a full rebuild every night. Nobody noticed until franchisees saw yesterday's numbers.
Bonus exercise 1 in the repo lets people try it in SQL.
-->

---
title: When rebuilding takes hours
section: 06 · MOVE
step: 6
clicks: 3
---

<div class="eyebrow">COPY, THEN CARRY ON</div>

# When a rebuild takes hours, don’t.

<CopyThenContinue />

<div v-click="3">

```sql
CREATE VIEW marts.fct_ticket_lines AS
SELECT * FROM legacy_copy.fct_ticket_lines WHERE business_date <  DATE '2026-11-01'
UNION ALL BY NAME
SELECT * FROM marts.fct_ticket_lines_new    WHERE business_date >= DATE '2026-11-01';
```

</div>

<p class="small-callout">Duckoffee’s <code>fct_ticket_lines</code>: 144M rows, and ~50 minutes a night since its incremental filter broke. Copy the history once, build only new nights, glue both together behind one view.</p>

<!--
61:00–62:00
Start: the old table, four years of increments, hours to rebuild.
Click 1: cut it at a date and copy everything before it once.
Click 2: from the cutoff, build each night in MotherDuck.
Click 3: one view glues both together, so consumers see one table.
You lose the "proved by rebuilding" guarantee for the old range, so check the copied range with aggregates.
-->

---
title: Validate against the source
section: 07 · VALIDATE
step: 7
---

<div class="duck-aside">
<div>

# Trust, but count.

<ol class="numbered">
  <li><span><strong>Compare fingerprints, not hashes</strong><small>Row count, distinct keys, sums, min and max, per day. Hash functions differ between engines.</small></span></li>
  <li><span><strong>Check the shape of the data</strong><small>Nulls, timestamps, categories. Does it make sense to a barista?</small></span></li>
  <li><span><strong>Usual suspects</strong><small>Timezones, rounding, and copying while the source was still loading.</small></span></li>
</ol>
</div>
<img src="/ducks/duck-detective.png" alt="A detective duck inspecting a long receipt with a magnifying glass" />
</div>

<!--
62:00–63:00
Most mismatches aren't bugs in the new pipeline: they're timing. Check the source watermark before chasing a diff.
And even when old and new match perfectly, both can be wrong. Exercise C is about that.
Bonus exercise 2 in the repo is the classic old-vs-new comparison with four planted differences.
-->

---
title: "Exercise C: Validate Duckoffee"
class: exercise-slide
section: 07 · VALIDATE
step: 7
---

<div class="exercise-head">
<div>
<span class="exercise-badge">EXERCISE C · 12 MIN</span>

# Would you trust this with your coffee money?

</div>
<ExerciseTimer :minutes="12" />
</div>

<div class="exercise-grid">
<ol class="numbered">
  <li><span><strong>Nulls &amp; shapes</strong><small><code>SUMMARIZE orders</code> and squint.</small></span></li>
  <li><span><strong>Row counts per layer</strong><small>raw → stg → marts. Does every order survive the trip?</small></span></li>
  <li><span><strong>Timestamps</strong><small>When do people buy coffee? Before they signed up?</small></span></li>
  <li><span><strong>Categories</strong><small>Does the currency match the cafe’s country?</small></span></li>
  <li><span><strong>Make it a Dive</strong><small>Every check with a red or green light. Keep it until cutover.</small></span></li>
</ol>
<div class="exercise-side">
  <div class="exercise-file">workshop/exercises/C_validate_duckoffee.sql</div>
  <p class="small-callout">At least six things in here should make a data person squint. First table to name them all gets a duck.</p>
</div>
</div>

<!--
63:00–75:00
Answers: solutions.sql section C. Real quirks of the duckoffee share:
1. order_facts silently drops 8,808 of 120,000 orders, across every payment status.
2. A quarter of all coffee is sold between midnight and 6 a.m. Night owls, or UTC timestamps?
3. 20,463 orders were placed before the customer registered.
4. Currency is unrelated to the cafe: Tokyo is mostly EUR, and the average JPY order is about 169 "yen". daily_revenue sums all currencies together.
5. daily_revenue covers 5 of 19 cafes and stops at 2025-12-31. Milan has no orders at all.
6. 13 customers share an email address. Bonus: legacy invoice numbers collide with order ids.
-->

---
title: Cutover timeline
section: 08 · CUT OVER
step: 8
clicks: 5
---

# Repoint, run both, switch off. Then wait.

<CutoverTimeline />

<!--
75:00–77:00
Click through:
1. Point consumers at the new data one at a time. The old warehouse stays readable.
2. Run both for one full reporting cycle. Two weeks catches weekly reports, not the monthly board pack. That's why this window is over a month.
3. Stop source compute: suspend warehouses, Tasks and Snowpipes. Don't delete anything yet.
4. Write down the date you stopped, as an annotation on your dashboards. When someone asks in three months why a number moved, that's your answer.
5. Drop only after the parallel window closes and query history shows nothing reading it.
-->

---
title: What we learned the hard way
section: LEARNINGS
---

<div class="duck-aside">
<div>

# What I learned the hard way

<ol class="numbered">
  <li><span><strong>Build components</strong><small>Reusable macros and model patterns make every next workload faster.</small></span></li>
  <li v-click><span><strong>Put your agent to work</strong><small>Translating SQL, mapping lineage, writing checks. AngelList had 20 parallel agents move 14,000 Metabase cards in three weeks. <a href="https://devin.ai/customers/angellist" target="_blank" rel="noopener noreferrer">↗</a></small></span></li>
  <li v-click><span><strong>Keeping two warehouses in sync is the hard part</strong><small>Every week of running both costs effort. Move whole workloads, not single tables.</small></span></li>
  <li v-click><span><strong>Copy what takes hours to rebuild</strong><small>Then carry on from there.</small></span></li>
</ol>
</div>
<img src="/ducks/celebration_duck_party_hat.png" alt="A duck celebrating in a party hat" />
</div>

<!--
77:00–79:00
AngelList moved Redshift → Snowflake, not to MotherDuck. It's here to show what agents can do with the boring consumer-side work. Numbers as stated on Devin's case study page.
-->

---
title: "Exercise D: Your action plan"
class: compact-slide
section: 09 · YOUR PLAN
---

<div class="exercise-head">
<div>
<span class="exercise-badge">EXERCISE D · 9 MIN</span>

# Now do it for your own warehouse.

</div>
<img class="exercise-duck" src="/ducks/duck-clipboard.png" alt="A duck holding a checklist reading plan, code, test, done" />
<ExerciseTimer :minutes="9" />
</div>

<ActionPlan />

<!--
79:00–88:00
Everyone fills this in for their own company. It saves in their browser; Copy as Markdown takes it home.
Last 2 minutes: ask two or three people to share their first workload and why.
Printed version: workshop/action-plan.md.
-->

---
title: Start with one workload
class: statement-slide
section: CLOSE
---

# Move one small workload end to end. Then do the next one.

<!--
88:00–89:00
One sentence to take home.
-->

---
title: Links & resources
class: resources-slide
section: RESOURCES
---

# Links &amp; resources

<div class="resources-grid">
  <div class="resource-card resource-featured">
    <span class="card-index">START HERE</span>
    <a href="https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/" target="_blank" rel="noopener noreferrer"><strong>Migrate your data warehouse</strong><span>MOTHERDUCK DOCS ↗</span></a>
    <a href="https://github.com/dumkydewilde/talks/tree/main/data-outpost-2026/workshop" target="_blank" rel="noopener noreferrer"><strong>Workshop data &amp; exercises</strong><span>GITHUB ↗</span></a>
    <a href="https://github.com/motherduckdb/md-migration-assessment" target="_blank" rel="noopener noreferrer"><strong>Snowflake migration assessment</strong><span>PUBLIC PREVIEW ↗</span></a>
  </div>
  <div class="resource-card">
    <span class="card-index">GUIDES, RECIPES &amp; READING</span>
    <a href="https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-snowflake/" target="_blank" rel="noopener noreferrer">Migrating from Snowflake <span>DOCS ↗</span></a>
    <a href="https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-bigquery/" target="_blank" rel="noopener noreferrer">Migrating from BigQuery <span>DOCS ↗</span></a>
    <a href="https://motherduck.com/docs/key-tasks/data-warehousing/migrating-your-data-warehouse/migrating-from-redshift/" target="_blank" rel="noopener noreferrer">Migrating from Redshift <span>DOCS ↗</span></a>
    <a href="https://motherduck.com/cookbook/flight-snowflake-ingest/" target="_blank" rel="noopener noreferrer">Snowflake ingest Flight <span>RECIPE ↗</span></a>
    <a href="https://motherduck.com/blog/motherduck-on-cloudflare-workers/" target="_blank" rel="noopener noreferrer">Duckoffee on Cloudflare Workers <span>BLOG ↗</span></a>
    <a href="https://www.dumky.net/posts/data-ingestion-pipelines-without-headaches-8-simple-steps/" target="_blank" rel="noopener noreferrer">Ingestion pipelines in 8 steps <span>BLOG ↗</span></a>
    <a href="https://www.dumky.net/posts/optimizing-snowflake-costs-with-dbt-query-tags/" target="_blank" rel="noopener noreferrer">dbt query tags in Snowflake <span>BLOG ↗</span></a>
  </div>
</div>
