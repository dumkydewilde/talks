<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// Advances with the presenter's clicks (frontmatter `clicks: 5`).
const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)

const weeks = 8
const consumers = [
  { name: 'Looker dashboards', at: 1 },
  { name: 'Streamlit app', at: 1.6 },
  { name: 'Hightouch → HubSpot', at: 2.4 },
  { name: 'Weekly Google Sheet', at: 3.2 },
  { name: 'Monthly board pack', at: 4.6 },
]
const x = (w: number) => 215 + (w / weeks) * 860
</script>

<template>
  <svg class="cutover" viewBox="0 0 1100 380" role="img" aria-label="Cutover timeline: repoint consumers one by one, run both in parallel for a full reporting cycle, stop source compute, record it, drop later.">
    <g class="cutover-axis">
      <line :x1="x(0)" :x2="x(weeks)" y1="330" y2="330" />
      <g v-for="w in weeks + 1" :key="w"><line :x1="x(w - 1)" :x2="x(w - 1)" y1="326" y2="334" /><text :x="x(w - 1)" y="352" text-anchor="middle">W{{ w - 1 }}</text></g>
    </g>

    <g v-for="(c, i) in consumers" :key="c.name" :transform="`translate(0, ${30 + i * 52})`">
      <text x="0" y="22" class="cutover-label">{{ c.name }}</text>
      <rect :x="x(0)" y="6" :width="x(step >= 1 ? c.at : weeks) - x(0)" height="22" class="lane-old" />
      <rect v-if="step >= 1" :x="x(c.at)" y="6" :width="x(weeks) - x(c.at)" height="22" class="lane-new" />
    </g>

    <g v-if="step >= 2">
      <rect :x="x(1)" y="16" :width="x(5.4) - x(1)" height="290" class="parallel-band" />
      <text :x="(x(1) + x(5.4)) / 2" y="12" text-anchor="middle" class="cutover-note">PARALLEL RUN: OLD STAYS READABLE FOR ONE FULL REPORTING CYCLE</text>
    </g>
    <g v-if="step >= 3"><line :x1="x(5.4)" :x2="x(5.4)" y1="16" y2="330" class="marker" /><text :x="x(5.4) + 8" y="304" class="cutover-note">STOP SOURCE COMPUTE</text></g>
    <g v-if="step >= 4"><text :x="x(5.4) + 8" y="318" class="cutover-note flag">⚑ ANNOTATE THE DATE</text></g>
    <g v-if="step >= 5"><line :x1="x(7.6)" :x2="x(7.6)" y1="16" y2="330" class="marker drop" /><text :x="x(7.6)" y="12" text-anchor="end" class="cutover-note">DROP, ONCE NOTHING READS IT</text></g>
  </svg>
  <div class="cutover-key"><span><i class="lane-old" /> old warehouse</span><span><i class="lane-new" /> MotherDuck</span><span class="interaction-hint">Use → to step through.</span></div>
</template>
