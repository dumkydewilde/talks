<script setup lang="ts">
import { ref } from 'vue'

// Ten tables from the workshop dataset (the devtools_duckoffee_warehouse_lineage share), with the
// evidence an inventory query gives you. Click a card to cycle its bucket; "Reveal" shows the answer.
const buckets = ['copy', 'rebuild', 'query in place', 'leave behind'] as const
type Bucket = typeof buckets[number]

const tables: { name: string; facts: string; answer: Bucket; why: string }[] = [
  { name: 'RAW_POS_V2.PUBLIC.TICKETS', facts: '5.5 GB · loader · read only by dbt', answer: 'rebuild', why: 'Re-sync from the tills, if the connector can backfill.' },
  { name: 'RAW_POS.PUBLIC.TICKETS', facts: '9 GB · dropped 2026-02-16 · still queried every day', answer: 'leave behind', why: 'Already gone. Repoint the royalty app and the procedure first.' },
  { name: 'MARTS.OPS.FCT_TICKET_LINES', facts: '17.3 GB · dbt incremental · 497 build credits', answer: 'copy', why: 'Copy history, continue incrementally. Fix its broken filter first.' },
  { name: 'LOOKER_SCRATCH.LR$MKT_CAMPAIGN_PDT', facts: '10.5 GB · owned by Looker', answer: 'leave behind', why: 'Looker rebuilds its own PDTs on the new connection.' },
  { name: 'MARTS.MARKETING.FCT_MART_57', facts: '0.6 GB · built every night · 0 reads', answer: 'leave behind', why: 'Dead mart: 35 credits for nobody.' },
  { name: 'MARTS.FRANCHISE.FCT_FRANCHISE_MORNING_SALES', facts: '70k reads · Looker, every morning', answer: 'rebuild', why: 'Idempotent dbt model. Validate it hard.' },
  { name: 'RAW_ADS.PUBLIC.AD_SPEND', facts: '5.4 GB · loader · Looker reads it directly', answer: 'rebuild', why: 'Re-sync. And point marketing at fct_campaign_daily.' },
  { name: 'RAW_POS.PUBLIC.TICKET_LINES', facts: '1.4 GB · loader · 0 reads', answer: 'leave behind', why: 'Nothing reads it. Ask once, then archive.' },
  { name: 'STAGING.STG_POS__TICKETS', facts: 'dbt view · read by two models', answer: 'rebuild', why: 'Views cost nothing to rebuild.' },
  { name: 'RAW_LOYALTY.PUBLIC.MEMBERS', facts: '8.9 GB · loader · read by a stored procedure', answer: 'rebuild', why: 'Re-sync, and port SP_REBUILD_LOYALTY_SEGMENTS with it.' },
]

const picks = ref<Record<string, Bucket | undefined>>({})
const revealed = ref(false)
const cycle = (name: string) => {
  const cur = picks.value[name]
  const next = cur === undefined ? 0 : buckets.indexOf(cur) + 1
  picks.value = { ...picks.value, [name]: next < buckets.length ? buckets[next] : undefined }
}
const slug = (b?: string) => (b ?? 'none').replace(/\s+/g, '-')
</script>

<template>
  <div class="bucket-board" @keydown.stop>
    <button v-for="t in tables" :key="t.name" type="button" class="bucket-card" :class="[`b-${slug(revealed ? t.answer : picks[t.name])}`, { wrong: revealed && picks[t.name] && picks[t.name] !== t.answer }]" @click="cycle(t.name)">
      <code>{{ t.name }}</code>
      <span class="bucket-facts">{{ t.facts }}</span>
      <span class="bucket-tag">{{ revealed ? t.answer : picks[t.name] ?? 'click to sort' }}</span>
      <span v-if="revealed" class="bucket-why">{{ t.why }}</span>
    </button>
  </div>
  <div class="bucket-legend">
    <span v-for="b in buckets" :key="b" :class="`b-${slug(b)}`">{{ b }}</span>
    <button type="button" class="text-button" @click="revealed = !revealed">{{ revealed ? 'Hide answers' : 'Reveal answers' }}</button>
  </div>
</template>
