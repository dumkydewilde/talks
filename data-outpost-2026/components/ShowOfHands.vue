<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ options: { title: string; detail: string }[] }>()
const selected = ref<number | null>(null)
</script>

<template>
  <div class="audience-options" :style="{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }" @keydown.stop>
    <button v-for="(option, i) in options" :key="option.title" type="button" :aria-pressed="selected === i" :class="{ selected: selected === i }" @click="selected = selected === i ? null : i">
      <span class="option-number">0{{ i + 1 }}</span>
      <strong>{{ option.title }}</strong>
      <span>{{ option.detail }}</span>
    </button>
  </div>
  <p class="interaction-hint">A show of hands, not a live poll. Click to mark the room’s answer.</p>
</template>
