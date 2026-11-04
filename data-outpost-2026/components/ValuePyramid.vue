<script setup lang="ts">
import { ref } from 'vue'

// Value only shows up at the top. A deep pipeline makes you build every layer first;
// an independent workload has fewer layers and pays off weeks earlier.
// Widths are illustrative, not measured.
const week = ref(0)
const maxWeek = 10

const pipelines = [
  {
    name: 'Finance reporting',
    sub: 'Deep: 6 layers, shared customer models',
    layers: [
      { label: 'Ingestion: 5 connectors', weeks: 2 },
      { label: 'Snapshot history copied', weeks: 1 },
      { label: 'Staging models', weeks: 1.5 },
      { label: 'Intermediate + shared dims', weeks: 2 },
      { label: 'Marts & metrics', weeks: 2 },
      { label: 'Dashboards repointed', weeks: 1.5 },
    ],
  },
  {
    name: 'Loyalty app',
    sub: 'Independent: reads files in place',
    layers: [
      { label: 'Query events in place', weeks: 0.5 },
      { label: 'One incremental model', weeks: 1.5 },
      { label: 'Loyalty app repointed', weeks: 1 },
    ],
  },
]

const filled = (layers: { weeks: number }[], i: number) => {
  const end = layers.slice(0, i + 1).reduce((s, l) => s + l.weeks, 0)
  const start = end - layers[i].weeks
  return Math.max(0, Math.min(1, (week.value - start) / layers[i].weeks))
}
const done = (layers: { weeks: number }[]) => week.value >= layers.reduce((s, l) => s + l.weeks, 0)
</script>

<template>
  <div class="value-pyramids" @keydown.stop>
    <div v-for="p in pipelines" :key="p.name" class="pyramid" :class="{ done: done(p.layers) }">
      <div class="pyramid-value">{{ done(p.layers) ? 'VALUE ✓' : 'NO VALUE YET' }}</div>
      <div class="pyramid-stack">
        <div v-for="(l, i) in [...p.layers].reverse()" :key="l.label" class="pyramid-layer"
             :style="{ width: `${40 + 60 * (i + 1) / p.layers.length}%` }">
          <i :style="{ width: `${filled(p.layers, p.layers.length - 1 - i) * 100}%` }" />
          <span>{{ l.label }}</span>
        </div>
      </div>
      <strong>{{ p.name }}</strong>
      <span class="pyramid-sub">{{ p.sub }}</span>
    </div>
  </div>
  <label class="week-slider" @keydown.stop>
    <span>WEEK {{ week }}</span>
    <input v-model.number="week" type="range" min="0" :max="maxWeek" step="1" aria-label="Weeks into the migration" />
    <span class="interaction-hint">Drag to move time forward. Durations are illustrative.</span>
  </label>
</template>
