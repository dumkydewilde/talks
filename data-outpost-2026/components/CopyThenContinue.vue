<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// Timeline for "copy history once, build new days incrementally, glue with one view".
// Stepped with → (frontmatter `clicks: 3`). The axis is to scale in months.
const { $clicks } = useSlideContext()
const step = computed(() => $clicks.value)

const start = 2022, end = 2028 // axis covers Jan 2022 → Jan 2028
const x0 = 40, x1 = 1140
const x = (year: number, month = 1) => x0 + ((year - start) * 12 + (month - 1)) / ((end - start) * 12) * (x1 - x0)
const years = Array.from({ length: end - start + 1 }, (_, i) => start + i)
const cutoff = x(2026, 11)
const nightsX = Array.from({ length: 14 }, (_, i) => cutoff + 6 + i * 11)
</script>

<template>
  <svg class="ctc" viewBox="0 20 1180 210" role="img" aria-label="Timeline: four years of history copied once up to the cutoff date, then built night by night in MotherDuck, combined behind one view.">
    <!-- axis -->
    <line :x1="x0" :x2="x1" y1="170" y2="170" class="ctc-axis" />
    <g v-for="y in years" :key="y">
      <line :x1="x(y)" :x2="x(y)" y1="165" y2="175" class="ctc-axis" />
      <text :x="x(y)" y="194" text-anchor="middle" class="ctc-tick">{{ y }}</text>
    </g>

    <!-- step 0: one big incremental table -->
    <rect :x="x(2022, 3)" y="100" :width="(step >= 1 ? cutoff : x(2026, 11)) - x(2022, 3)" height="56" :class="step >= 1 ? 'ctc-copied' : 'ctc-old'" />
    <text :x="x(2022, 3) + 16" y="134" class="ctc-label">
      {{ step >= 1 ? 'Copied once as Parquet · 17 GB, untouched' : 'FCT_TICKET_LINES · 144M rows · years of increments · ~50 min every night' }}
    </text>

    <!-- step 1: cutoff -->
    <g v-if="step >= 1">
      <line :x1="cutoff" :x2="cutoff" y1="84" y2="178" class="ctc-cutoff" />
      <text :x="cutoff - 8" y="214" text-anchor="end" class="ctc-tick strong">CUTOFF 2026-11-01</text>
    </g>

    <!-- step 2: nightly builds after the cutoff -->
    <g v-if="step >= 2">
      <rect v-for="(nx, i) in nightsX" :key="i" :x="nx" y="100" width="8" height="56" class="ctc-night" :style="{ opacity: 1 - i * 0.05 }" />
      <text :x="cutoff + 8" y="214" class="ctc-tick strong night">BUILT NIGHTLY IN MD →</text>
    </g>

    <!-- step 3: one view on top -->
    <g v-if="step >= 3">
      <path :d="`M ${x(2022, 3)} 70 V 54 H ${x1 - 10} V 70`" class="ctc-bracket" />
      <rect :x="(x(2022, 3) + x1) / 2 - 170" y="34" width="340" height="38" class="ctc-viewbox" />
      <text :x="(x(2022, 3) + x1) / 2" y="59" text-anchor="middle" class="ctc-label code">VIEW marts.fct_ticket_lines</text>
    </g>
  </svg>
</template>
