// Slide copy and data for the Infrastructure for Answers deck.
// Edit text here, not in deck.tsx.

export const DECK_META = {
  title: "Infrastructure for Answers",
  subtitle: "From copy-paste SQL to context-rich data agents that are faster, cheaper, and more correct.",
  author: "Dumky de Wilde",
  event: "Amsterdam Analytics Engineering Meetup",
  date: "27 May 2026",
  slideUrl: "https://dumkydewilde.github.io/talks/infrastructure-for-answers/",
  handle: "@dumkydewilde",
};

export const QR_FOLLOW = {
  src: "infrastructure-for-answers-qr.svg",
  label: "Follow along",
  url: "dumkydewilde.github.io/talks",
};

export const QR_MCP_MEMORY = {
  src: "mcp-memory-layer-qr.svg",
  label: "Try the wrapper",
  url: "github.com/dumkydewilde/mcp-memory-layer",
};

// S2 — where we are
export const TRANSITION_WHERE = {
  eyebrow: "Where we are",
  headlineLines: ["Your dbt project is about to become", "an answer engine."],
  highlightLast: true,
  body: "The interface to data is shifting from dashboards and notebooks to agents that need context, tools, and feedback.",
  image: "scenario-workflow-scene-2.png",
  imageAlt: "Duck beside a lineage graph and database tables",
};

// S3 — trap setup
export const TRAP_SETUP = {
  question: '"What\'s the average\norder value?"',
  filename: "agent.log",
  code: `> User:   What's the average order value?

> Agent:  SELECT avg(order_total) FROM raw_orders;

> Result: 16,990.42`,
  caption: "→ Looks plausible. That is the problem.",
};

// S4 — trap catch
export const TRAP_CATCH = {
  eyebrow: "The catch",
  headline: "The agent found the column.\nIt missed the unit.",
  body: "In the raw source, `order_total` is stored in cents. The dbt mart is where the useful business value gets normalized.",
  filename: "models/marts/orders.sql",
  code: `-- raw_orders
avg(order_total) = 16,990.42   -- cents

-- dbt mart
avg(order_total) / 100.0
= 169.9042                    -- euros`,
  conversionLabel: "conversion",
  conversion: "16,990.42 / 100 = €169.90",
};

// S5 — trap reveal
export const TRAP_REVEAL = {
  eyebrow: "Actual answer",
  bigstat: "€169.90",
  body: "vs €16,990.42 the agent told you.",
  tagline: "100× off.\nOne column away from the truth.",
};

// S6 — why
export const TRANSITION_WHY = {
  eyebrow: "Why?",
  headlineLines: ["The loop isn't broken.", "The input is."],
  highlightLast: true,
};

// S7 — three levels
export const LEVELS = {
  headline: "Three levels of agentic SQL.",
  cards: [
    {
      num: "01",
      img: "duck-level-duckling.svg",
      name: "Copy-paste",
      sub: "Duckling",
      desc: "You are the loop. Paste schema, ask, copy SQL back, fix the errors yourself.",
    },
    {
      num: "02",
      img: "duck-level-coding.svg",
      name: "Agentic clients",
      sub: "Working duck",
      desc: "Claude Code, opencode, Cursor. The loop is built in. Tool calls go directly to your shell.",
    },
    {
      num: "03",
      img: "duck-level-duckzilla.svg",
      name: "Own the loop",
      sub: "Duckzilla",
      desc: "When the answers matter, own tools, traces, evals, and the context promotion path.",
    },
  ],
};

// S8 — animated loop
export const LOOP_ANIM = {
  eyebrow: "The agentic loop",
  headline: "The model is only one node.",
  body: "Most of the value comes from the loop around it: tools, exact errors, result traces, and the context you feed back into the next turn.",
};

// S9 — loop code
export const LOOP_CODE = {
  headline: "Owning the loop is cheap.",
  filename: "agent_loop.py",
  caption: "20 lines of Python + a tools dict.",
  code: `def ask(question):
    messages = [{"role": "user", "content": question}]
    while True:
        resp = client.chat.completions.create(
            model=MODEL, tools=tools, messages=messages,
        )
        choice = resp.choices[0]
        messages.append(choice.message)
        if choice.finish_reason != "tool_calls":
            return choice.message.content
        for call in choice.message.tool_calls:
            args = json.loads(call.function.arguments)
            result = run_tool(call.function.name, args)
            messages.append({"role": "tool",
                             "tool_call_id": call.id,
                             "content": result})`,
};

// S10 — context was it
export const TRANSITION_CONTEXT = {
  eyebrow: "But",
  headlineLines: ["The loop wasn't the problem.", "The context was."],
  highlightLast: true,
};

// S11 — two layers
export const CONTEXT_STACK = {
  headline: "Context is a stack.",
  layers: [
    { label: "Schema", desc: "Names, types, comments, units. The agent's first map.", color: "var(--sky)" },
    { label: "dbt", desc: "Descriptions, tests, lineage, semantic models, saved queries.", color: "var(--sun)" },
    { label: "Memory", desc: "Corrections, stale-table warnings, known gotchas, popular joins.", color: "var(--garden)" },
    { label: "Traces", desc: "Every tool call, error, answer, and user reaction becomes eval fuel.", color: "var(--watermelon)" },
  ],
};

// S12 — comment on
export const COMMENT_ON = {
  headline: "Context that ships with the data.",
  filename: "comments.sql",
  code: `COMMENT ON TABLE orders IS
  'Clean orders mart. Amounts in EUROS. Use this, not raw_orders.';

COMMENT ON TABLE daily_revenue IS
  'STALE. Only 5 of 20 locations. Use orders instead.';

COMMENT ON COLUMN orders.order_total IS
  'Total in EUROS (subtotal + tax). Use for revenue.';`,
};

// S13 — benchmark reality
export const BENCHMARK = {
  eyebrow: "Why this is worth engineering",
  bigstat: "14.55%",
  headline: "Best published hard-question score on DABstep before the context work.",
  body: "Real analytics questions need joins, filters, units, docs, and recovery from mistakes. Single-shot SQL is not the problem shape.",
};

// S14 — context beats model
export const CONTEXT_BEATS = {
  eyebrow: "The performance lesson",
  headline: "Context beats model choice.",
  cards: [
    { label: "Column names", stat: "7.2% → 44.4%", desc: "Gemini Flash hard accuracy after replacing placeholder names with explicit names." },
    { label: "Better than model swap", stat: "$23 beats $108", desc: "Cheap model + good schema beat Opus on a bad schema in the DABstep experiment." },
    { label: "Full context + modeling", stat: "29.8% → 93.2%", desc: "Gemini 3 Flash hard accuracy with domain context plus views and macros." },
  ],
  body: "The low-cost/high-speed path is not \"buy the biggest model\". It is to make the warehouse easier for any agent to understand.",
};

// S15 — manual drift
export const MANUAL_DRIFT = {
  eyebrow: "Context failure mode",
  headline: "Prose context drifts.",
  body: "A manual helped the baseline schema, then hurt the explicit schema because the column names had evolved.",
  rows: [
    ["manual.md", "Separate file. Easy to forget. Can contradict the schema."],
    ["COMMENT ON", "Lives with the object. Every catalog-aware tool can read it."],
    ["dbt model", "Business logic becomes tested SQL, not prompt reconstruction."],
  ] as const,
  cta: "Move reusable meaning closer to the data.",
};

// S16 — eval loop
export const EVAL_LOOP = {
  eyebrow: "The discipline",
  headline: "Optimize the recipe, not the demo.",
  body: "The agentic loop gets you behavior. The eval loop tells you whether the behavior got better.",
  steps: [
    ["Question set", "25 real questions + gold answers"],
    ["Baseline", "accuracy, turns, cost"],
    ["One lever", "naming, comments, dbt, memory"],
    ["Train lever", "read traces, patch, rerun"],
    ["Held-out", "score once, ship or kill"],
    ["Telemetry", "promote real misses back into evals"],
  ] as const,
};

// S17 — skills drift transition
export const TRANSITION_SKILLS = {
  eyebrow: "The path forward",
  headlineLines: ["Stop making agents", "rediscover your warehouse.", "Package the context."],
  highlightLast: true,
};

// S18 — mcp-memory-layer pattern
export const MCP_MEMORY = {
  headline: "The mcp-memory-layer pattern.",
  cards: [
    {
      num: "01",
      name: "Extract",
      desc: "Serve small dbt manifest slices: descriptions, lineage, tests, SQL, metrics.",
      duck: "extract" as const,
    },
    {
      num: "02",
      name: "Correct",
      desc: "Keep known traps in a memory layer: stale tables, units, renamed columns.",
      duck: "correct" as const,
    },
    {
      num: "03",
      name: "Observe",
      desc: "Track popular joins and failed attempts so real use improves the next run.",
      duck: "observe" as const,
    },
  ],
};

// S19 — wait transition
export const TRANSITION_WAIT = {
  eyebrow: "Wait",
  headlineLines: ["You might already have", "the best semantic context", "on the planet."],
  highlightLast: true,
};

// S20 — dbt golden split
export const DBT_SPLIT = {
  eyebrow: "Your dbt project",
  headline: "You've been writing semantic context for years.",
  filename: "models/marts/orders.sql",
  code: `{{ config(materialized='table') }}

-- Clean orders mart. Amounts in EUROS.
-- One row per customer order.
SELECT
  o.order_id,
  o.customer_id,
  o.ordered_at,
  o.location_id,
  o.subtotal + o.tax_paid AS order_total
FROM {{ ref('stg_orders') }} o`,
  rows: [
    { label: "Tests", desc: "not_null, unique, relationships" },
    { label: "Docs", desc: "description per column" },
    { label: "Lineage", desc: "ref() graph, source to mart" },
    { label: "Metrics", desc: "definitions, owners, layer" },
  ],
};

// S21 — dbt stagger
export const DBT_STAGGER = {
  headline: "What your dbt already has.",
  lines: [
    "Schemas, definitions, owners.",
    "Tests catching the bad joins.",
    "Docs that explain the columns.",
    "Lineage that traces the metric.",
  ],
  highlight: "You've been writing context for years.",
};

// S22 — context layer
export const CONTEXT_LAYER = {
  eyebrow: "Where this goes",
  headline: "A context layer for analytics.",
  body: "Fragments start as observations, become team lore when repeated, and become canon when reviewed.",
  items: [
    { label: "rumor", desc: "Trace, correction, Slack thread", top: "4%", left: "2%", color: "var(--watermelon)" },
    { label: "lore", desc: "Multiple analysts hit the same rule", top: "33%", left: "30%", color: "var(--sun)" },
    { label: "canon", desc: "Reviewed metric, model, macro", top: "62%", left: "58%", color: "var(--garden)" },
  ],
};

// S23 — answer workflow
export const ANSWER_WORKFLOW = {
  eyebrow: "From dbt project to answers",
  headline: "The workflow is the product.",
  body: "dbt is the durable source of truth. The agent runtime should consume it, measure it, and push proven context back into it.",
  steps: [
    { label: "Compile", desc: "dbt build produces manifest.json, docs, tests, lineage.", color: "var(--sun)", duck: "compile" as const },
    { label: "Wrap", desc: "MCP exposes query tools plus small dbt context slices.", color: "var(--garden)", duck: "wrap" as const },
    { label: "Evaluate", desc: "A/B the levers: corrections, docs, popularity, models.", color: "var(--sky)", duck: "evaluate" as const },
    { label: "Promote", desc: "Repeated fixes become comments, views, macros, metrics.", color: "var(--watermelon)", duck: "promote" as const },
    { label: "Operate", desc: "Telemetry refreshes evals and keeps context from going stale.", color: "var(--sun)", duck: "operate" as const },
  ],
};

// S24 — role change reveal
export const ROLE_CHANGE = {
  eyebrow: "The new job",
  headlineLines: ["You've been doing this", "all along."],
  highlightLast: true,
  tagline: "The bar moved up.\nYou cleared it.",
};

// S25 — actions
export const ACTIONS = {
  headline: "Three things to do Monday.",
  cards: [
    { num: "01", name: "Score", desc: "Write 25 warehouse questions with gold answers. Split train and held-out." },
    { num: "02", name: "Expose", desc: "Serve dbt manifest context, corrections, and popularity through MCP." },
    { num: "03", name: "Promote", desc: "Move repeated fixes into comments, views, macros, and dbt docs." },
  ],
};

// S26 — about me + MotherDuck
export const ABOUT = {
  eyebrow: "Who's talking",
  mePhoto: "dumky-profile.jpeg",
  meHeadline: "Dumky de Wilde",
  meSub: "Developer & Agent Experience Engineer · MotherDuck",
  meBody:
    "10+ years as a consultant building data pipelines, models, and cloud infrastructure across government, fintech, retail, and energy. Now at MotherDuck helping people and their AI agents make the most of it through docs, examples, and content. Co-author of The Fundamentals of Analytics Engineering.",
  meLink: "linkedin.com/in/dumkydewilde",
  duckHeadline: "Not just for small data.",
  duckBody:
    "MotherDuck takes DuckDB's portable, embeddable engine and ships it as a managed cloud warehouse. Hybrid execution between your laptop and the cloud, terabytes of data, and dbt-native workflows.",
  duckLink: "motherduck.com/product/data-teams",
};

// Propositions overview (after AboutSlide)
export const PROPOSITIONS = {
  eyebrow: "Why MotherDuck for agents",
  headline: "Four things that make agents fast.",
  cards: [
    {
      duck: "hybrid" as const,
      label: "Hybrid execution",
      desc: "Local DuckDB and cloud compute in the same query. Fast feedback locally, scale to the cloud when needed.",
    },
    {
      duck: "mcp" as const,
      label: "MCP server",
      desc: "Official MCP for MotherDuck. Tool-call your warehouse, surface schemas and comments to any agent client.",
    },
    {
      duck: "perUser" as const,
      label: "A database per user",
      desc: "Cheap, isolated per-user databases. Every analyst, every agent gets a sandbox without breaking shared data.",
    },
    {
      duck: "dives" as const,
      label: "Dives",
      desc: "Live, queryable Dives: a React + SQL surface for shipping interactive reports straight from your data.",
    },
  ],
};

// Dives focus slide with two examples
export const DIVES = {
  eyebrow: "Dives",
  headline: "Dashboards as code, served from MotherDuck.",
  body: "A Dive is a single React component backed by live SQL. Filters, charts, tables — all driven by the warehouse and shareable like a URL.",
  examples: [
    { src: "dive-example-jobs.png", caption: "Jobs distribution explorer" },
    { src: "dive-example-spotify.png", caption: "Spotify tracks Dive (114k rows)" },
  ],
};

// S27 — resources
export const RESOURCES = {
  headline: "Fork the workflow, not the slideware.",
  featured: {
    image: "vibes-to-evals-cover.png",
    label: "Field guide",
    title: "From Vibes to Evals",
    sub: "MotherDuck Practitioner Series",
    url: "motherduck.com/lp/ai-analytics-eval-field-guide",
  },
  items: [
    {
      label: "The wrapper",
      title: "mcp-memory-layer",
      url: "github.com/dumkydewilde/mcp-memory-layer",
      kind: "code",
    },
    {
      label: "Workshop harnesses",
      title: "motherduckdb/labs",
      url: "github.com/motherduckdb/labs",
      kind: "code",
    },
    {
      label: "The benchmark",
      title: "DABstep paper",
      url: "arxiv.org/pdf/2506.23719",
      kind: "paper",
    },
    {
      label: "Read next",
      title: "MotherDuck agent skills",
      url: "motherduck.com/blog/motherduck-agent-skills",
      kind: "post",
    },
    {
      label: "Read next",
      title: "Vibe coding comes for BI",
      url: "motherduck.com/blog/vibe-coding-comes-for-bi",
      kind: "post",
    },
  ],
};

// S28 — closing CTA
export const CTA = {
  eyebrow: "Thanks for listening",
  headline: "Slides + repo:",
  url: "dumkydewilde.github.io",
  urlSuffix: "/infrastructure-for-answers",
  signoff: "@dumkydewilde · Dumky de Wilde · Amsterdam AE Meetup · 27 May 2026",
};
