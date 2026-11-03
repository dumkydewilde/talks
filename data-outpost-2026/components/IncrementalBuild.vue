<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// A scripted story, stepped through with → (frontmatter `clicks: 6`).
// Each night delivers that day's events plus a few late ones for earlier days.
const { $clicks } = useSlideContext()

type Ev = { id: string; day: number }
const nights: Ev[][] = [
  [1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 1],
  [3, 3, 3, 3, 3, 2],
  [4, 4, 4, 4, 4, 3, 2],
].map((days, n) => days.map((day, i) => ({ id: `n${n + 1}e${i}`, day })))

type Step = { runs: number[]; mode: 'INSERT' | 'MERGE'; caption: string }
const steps: Step[] = [
  { runs: [], mode: 'INSERT', caption: 'Every night, a batch of new events arrives. We append it.' },
  { runs: [0, 1], mode: 'INSERT', caption: 'Nights 1 and 2. One day-1 event showed up late: it lands on day 1, not day 2.' },
  { runs: [0, 1, 2], mode: 'INSERT', caption: 'Night 3. Rows = events. All good.' },
  { runs: [0, 1, 2, 2], mode: 'INSERT', caption: 'Night 3 failed halfway, so someone hit retry. Every row is now in there twice.' },
  { runs: [0, 1, 2, 2], mode: 'MERGE', caption: 'Same runs, but MERGE on event_id. The retry overwrites instead of adding.' },
  { runs: [0, 1, 2, 2, 3, 3], mode: 'MERGE', caption: 'Retry as often as you like. Nothing changes. That’s idempotent.' },
  { runs: [0, 1, 2, 2, 3, 3], mode: 'MERGE', caption: 'Night 4 still brought events for days 2 and 3. Rebuild only “yesterday” and you miss them: use a lookback window.' },
]
const step = computed(() => steps[Math.min($clicks.value, steps.length - 1)])

type Chip = Ev & { dup: boolean; late: boolean; fresh: boolean }
const chips = computed<Chip[]>(() => {
  const { runs, mode } = step.value
  const out: Chip[] = []
  const at = new Map<string, number>()
  runs.forEach((n, r) => {
    const fresh = r === runs.length - 1
    for (const e of nights[n]) {
      const late = e.day < n + 1
      if (mode === 'MERGE' && at.has(e.id)) { out[at.get(e.id)!] = { ...e, dup: false, late, fresh }; continue }
      const dup = at.has(e.id)
      if (!dup) at.set(e.id, out.length)
      out.push({ ...e, dup, late, fresh })
    }
  })
  return out
})
const byDay = computed(() => [1, 2, 3, 4].map(d => chips.value.filter(c => c.day === d)))
const rows = computed(() => chips.value.length)
const unique = computed(() => new Set(chips.value.map(c => c.id)).size)
const lookback = computed(() => $clicks.value >= 6)
</script>

<template>
  <div class="inc">
    <div class="inc-top">
      <span class="inc-mode" :class="step.mode.toLowerCase()">{{ step.mode === 'INSERT' ? 'INSERT (append)' : 'MERGE on event_id' }}</span>
      <p class="inc-caption">{{ step.caption }}</p>
      <dl class="inc-stats">
        <div><dt>Rows</dt><dd>{{ rows }}</dd></div>
        <div><dt>Events</dt><dd>{{ unique }}</dd></div>
        <div :class="{ bad: rows > unique }"><dt>Duplicates</dt><dd>{{ rows - unique }}</dd></div>
      </dl>
    </div>
    <div class="inc-chart">
      <div v-for="(col, i) in byDay" :key="i" class="inc-day" :class="{ window: lookback && (i === 1 || i === 2) }">
        <div class="inc-stack">
          <i v-for="(c, j) in col" :key="c.id + j" :class="{ dup: c.dup, late: c.late, fresh: c.fresh }" />
        </div>
        <span>DAY {{ i + 1 }}</span>
      </div>
    </div>
    <div class="inc-legend">
      <span><i /> event</span>
      <span><i class="fresh" /> loaded by the last run</span>
      <span><i class="late" /> arrived late</span>
      <span><i class="dup" /> duplicate</span>
      <span class="interaction-hint">Use → to step through.</span>
    </div>
  </div>
</template>
