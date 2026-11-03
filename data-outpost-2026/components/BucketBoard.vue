<script setup lang="ts">
import { ref } from 'vue'

// Twelve tables from the workshop dataset (workshop/generate.sql), with the evidence
// an inventory query gives you. Click a card to cycle its bucket; "Reveal" shows the answer key.
const buckets = ['copy', 'rebuild', 'query in place', 'leave behind'] as const
type Bucket = typeof buckets[number]

const tables: { name: string; facts: string; answer: Bucket; why: string }[] = [
  { name: 'RAW.SHOPIFY.ORDERS', facts: '61 GB · Fivetran, hourly · read daily by dbt', answer: 'rebuild', why: 'Connector can re-sync full history.' },
  { name: 'SNAPSHOTS.CUSTOMERS_SNAPSHOT', facts: '21 GB · dbt snapshot · SCD2', answer: 'copy', why: 'This history exists nowhere else.' },
  { name: 'RAW.APP.EVENTS', facts: '910 GB · Snowpipe from S3 JSON', answer: 'query in place', why: 'The files are still in S3.' },
  { name: 'RAW.GA4.EVENTS', facts: 'External table · 1.4 TB Parquet in GCS', answer: 'query in place', why: 'Already Parquet in object storage.' },
  { name: 'RAW.FINANCE.FX_RATES', facts: '1 MB · uploaded by hand monthly', answer: 'copy', why: 'No source system to re-sync from.' },
  { name: 'MARTS.FCT_ORDERS', facts: '34 GB · dbt incremental · 1,483 reads', answer: 'rebuild', why: 'Idempotent dbt model. Validate it hard.' },
  { name: 'STAGING.STG_APP_EVENTS', facts: '640 GB · dbt incremental · hours to rebuild', answer: 'rebuild', why: 'Rebuild, or copy and continue incrementally if hours hurt.' },
  { name: 'SCRATCH.MKT_Q3_2024_BACKUP', facts: '15 GB · created 2024 · 0 reads', answer: 'leave behind', why: 'Nobody reads it.' },
  { name: 'ANALYTICS_OLD.FCT_ORDERS_V1', facts: '27 GB · no writes since 2024 · 13 reads', answer: 'leave behind', why: 'A Google Sheet still reads it every Monday. Talk to them first.' },
  { name: 'REPORTING.BOARD_PACK_MONTHLY', facts: 'Stored procedure · runs on the 1st', answer: 'rebuild', why: 'Port the procedure. Easy to miss in a two-week parallel run.' },
  { name: 'REVERSE_ETL.HUBSPOT_AUDIENCES', facts: '1 GB · dbt · Hightouch reads hourly', answer: 'rebuild', why: 'Repoint the sync at cutover.' },
  { name: 'RAW.LEGACY.CRM_EXPORT_2019', facts: '3 GB · manual · 0 reads', answer: 'leave behind', why: 'Archive to Parquet if legal wants it.' },
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
