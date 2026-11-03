<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

// Exercise D: a one-page migration plan participants fill in on their own laptop.
// Saved in their browser only; "Copy as Markdown" takes it home.
const fields = [
  { key: 'why', label: 'Why are we moving?', hint: 'Cost, speed, renewal date, a CFO with opinions…' },
  { key: 'consumers', label: 'Stakeholders & consumers', hint: 'Who reads the data, and how? Dashboards, apps, sheets, syncs. Who signs off?' },
  { key: 'assets', label: 'Key assets', hint: 'The 5–10 tables or models that matter most. Anything that only exists in the old warehouse?' },
  { key: 'first', label: 'First workload & why', hint: 'Small, independent, visible. Who will notice when it works?' },
  { key: 'checks', label: 'Data quality checks', hint: 'Row counts, nulls, freshness, the number finance always asks about.' },
  { key: 'cutover', label: 'Cutover & parallel run', hint: 'How long do you run both? Which monthly report must you wait for?' },
] as const
type Key = typeof fields[number]['key']

const STORAGE = 'data-outpost-action-plan'
const plan = reactive<Record<Key, string>>(Object.fromEntries(fields.map(f => [f.key, ''])) as Record<Key, string>)
const copied = ref('')

onMounted(() => {
  try { Object.assign(plan, JSON.parse(localStorage.getItem(STORAGE) || '{}')) } catch {}
})
watch(plan, v => { try { localStorage.setItem(STORAGE, JSON.stringify(v)) } catch {} }, { deep: true })

async function copy() {
  const md = ['# My migration action plan', '', ...fields.flatMap(f => [`## ${f.label}`, plan[f.key] || '_TBD_', ''])].join('\n')
  try { await navigator.clipboard.writeText(md); copied.value = 'Copied. Paste it somewhere your future self will find it.' }
  catch { copied.value = 'Copy failed. Select the text and copy it by hand.' }
}
</script>

<template>
  <div class="action-plan" @keydown.stop>
    <label v-for="f in fields" :key="f.key" class="action-field">
      <span>{{ f.label }}</span>
      <textarea v-model="plan[f.key]" :placeholder="f.hint" rows="3" />
    </label>
    <div class="action-footer">
      <button type="button" class="pill" @click="copy">Copy as Markdown</button>
      <span class="interaction-hint">{{ copied || 'Saved in this browser as you type.' }}</span>
    </div>
  </div>
</template>
