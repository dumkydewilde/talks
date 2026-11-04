<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import { links } from '../config'

// A deliberately reduced version of a16z's "Unified Data Infrastructure 2.0":
// five stages left to right, three concerns that span all of them.
type Layer = { key: string; title: string; examples: string; questions: string[] }

const stages: Layer[] = [
  { key: 'sources', title: 'Sources', examples: 'Tills, Shopify bean shop, Stripe, the loyalty app', questions: ['These stay where they are.', 'But: which ones can you re-read from scratch, and which only give you “now”?', 'That decides copy vs rebuild later.'] },
  { key: 'ingestion', title: 'Ingestion', examples: 'Fivetran, Airbyte, Snowpipe, one heroic Python script', questions: ['Can the connector write to MotherDuck, or only to the old warehouse?', 'Can it re-sync full history?', 'Which loads are full refresh vs incremental?'] },
  { key: 'storage', title: 'Storage', examples: 'Snowflake tables, app events in S3, a 2019 CRM export', questions: ['What already lives in object storage? Query it in place.', 'What exists only inside the warehouse (snapshots, manual uploads)?', 'What hasn’t been read in a year?'] },
  { key: 'transform', title: 'Transform & metrics', examples: 'dbt, a stored procedure on the 1st, scheduled SQL', questions: ['Is all logic in git, or is some hiding in procedures and scheduled queries?', 'Which models take hours to rebuild?', 'Where are metrics defined: BI tool, semantic layer, or SQL?'] },
  { key: 'consume', title: 'Consumption', examples: 'BI · data apps & sheets · reverse ETL & signals', questions: ['Who reads what? Query history knows.', 'Which consumers run weekly, monthly, quarterly?', 'Which ones write back into other systems (reverse ETL)?'] },
]
const bands: Layer[] = [
  { key: 'orchestration', title: 'Orchestration', examples: 'Airflow, dbt, a cron job on someone’s laptop', questions: ['What triggers what, and when?', 'Can the same orchestrator drive both warehouses during the parallel run?'] },
  { key: 'quality', title: 'Data quality & observability', examples: 'dbt tests, row counts, freshness, anomaly checks', questions: ['Do checks exist today? Port them first: they’re how you know the move worked.', 'A MotherDuck Dive makes a good shared quality dashboard.'] },
  { key: 'retention', title: 'Archival, retention & backup', examples: 'Time travel, snapshots, cold archives, legal holds', questions: ['What do you need to keep, and for how long?', 'Can old partitions become Parquet in object storage instead of warehouse tables?'] },
]

// Stepped with → (frontmatter `clicks: 7`): click 0 is Sources, click 7 is the last band.
// Clicking a box jumps to its click, so the arrows carry on from there.
const layers = [...stages, ...bands]
const { $clicks } = useSlideContext()
const { go, currentSlideNo } = useNav()
const current = computed(() => layers[Math.min($clicks.value, layers.length - 1)])
const selected = computed(() => current.value.key)
// Blur so the arrow keys go back to Slidev instead of the focused button.
const select = (key: string, e: MouseEvent) => {
  (e.currentTarget as HTMLElement).blur()
  go(currentSlideNo.value, layers.findIndex(l => l.key === key))
}
</script>

<template>
  <div class="landscape">
    <div class="landscape-diagram">
      <div class="landscape-stages">
        <button v-for="(s, i) in stages" :key="s.key" type="button" class="landscape-stage" :class="{ active: selected === s.key }" @click="select(s.key, $event)">
          <span class="card-index">0{{ i + 1 }}</span>
          <strong>{{ s.title }}</strong>
          <span>{{ s.examples }}</span>
          <i v-if="i < stages.length - 1" aria-hidden="true">→</i>
        </button>
      </div>
      <button v-for="b in bands" :key="b.key" type="button" class="landscape-band" :class="{ active: selected === b.key }" @click="select(b.key, $event)">
        <strong>{{ b.title }}</strong><span>{{ b.examples }}</span>
      </button>
    </div>
    <aside class="landscape-detail">
      <div class="eyebrow">Ask before you move</div>
      <h3>{{ current.title }}</h3>
      <ul><li v-for="q in current.questions" :key="q">{{ q }}</li></ul>
      <p class="landscape-credit">Simplified from <a :href="links.a16z" target="_blank" rel="noopener noreferrer">a16z, Emerging Architectures ↗</a></p>
    </aside>
  </div>
</template>
