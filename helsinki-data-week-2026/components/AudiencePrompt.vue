<script setup lang="ts">
import { ref } from 'vue'
const selected = ref<number | null>(null)
const options = [
  { title: 'Getting the data', detail: 'Access, ingestion, freshness.' },
  { title: 'Getting an answer', detail: 'Queries, models, dashboards.' },
  { title: 'Trusting the answer', detail: 'Definitions, evidence, ownership.' },
]
</script>

<template>
  <div class="audience-options" @keydown.stop>
    <button v-for="(option, i) in options" :key="option.title" :aria-pressed="selected === i" :class="{ selected: selected === i }" @click="selected = selected === i ? null : i">
      <span class="option-number">0{{ i + 1 }}</span>
      <strong>{{ option.title }}</strong>
      <span>{{ option.detail }}</span>
    </button>
  </div>
  <p class="interaction-hint">A show of hands—not a live poll. Click to highlight the room’s answer.</p>
</template>
