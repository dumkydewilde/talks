<script setup lang="ts">
const steps = [
  { title: 'Dive', lines: ['App'], fill: 'var(--sky)' },
  { title: 'Flight', lines: ['Load data'], fill: '#FBF8F4' },
  { title: 'Human', lines: ['Review & edit', 'the codebook'], fill: 'var(--garden-light)' },
  { title: 'Flight', lines: ['SQL analysis', 'with Jev'], fill: '#FBF8F4' },
  { title: 'Dive', lines: ['Insights'], fill: 'var(--sky)' },
]
</script>

<template>
  <svg class="interview-flow" viewBox="0 0 1176 360" role="img" aria-labelledby="interview-flow-title interview-flow-description">
    <title id="interview-flow-title">From the Dive app to human-reviewed insights</title>
    <desc id="interview-flow-description">Dive app → Flight loading data → human review and editing of the codebook → Flight running SQL analysis with Jev → Dive with insights.</desc>
    <defs>
      <marker id="interview-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="var(--ink)" stroke-width="1.5" /></marker>
    </defs>
    <path v-for="i in 4" :key="`arrow-${i}`" class="interview-flow-arrow" :d="`M${210 + (i - 1) * 244} 172H${234 + (i - 1) * 244}`" marker-end="url(#interview-flow-arrow)" />
    <g v-for="(step, i) in steps" :key="i" class="interview-flow-step" :class="{ 'interview-flow-human': i === 2 }" :transform="`translate(${2 + i * 244}, 0)`">
      <rect x="0" y="54" width="196" height="236" rx="14" :fill="step.fill" />
      <text x="22" y="88" class="interview-flow-index">0{{ i + 1 }}</text>
      <text x="98" y="146" text-anchor="middle" class="interview-flow-title">{{ step.title }}</text>
      <text x="98" y="198" text-anchor="middle" class="interview-flow-action"><tspan v-for="(line, j) in step.lines" :key="line" x="98" :dy="j === 0 ? 0 : 29">{{ line }}</tspan></text>
    </g>
  </svg>
</template>
