<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="brand-word">
    <!-- Canonical CloudOutline geometry from motherduck-design-dive/artifacts/shape-primitives.tsx. -->
    <svg viewBox="0 0 220 110" aria-hidden="true"><path d="M28 75 Q12 70 12 55 Q12 35 35 32 Q40 18 60 18 Q72 18 80 26 Q95 8 120 12 Q145 16 152 36 Q165 32 180 38 Q205 46 205 65 Q205 85 180 87 Q160 88 152 80 Q140 95 118 92 Q98 90 88 80 Q75 90 60 88 Q40 86 28 75 Z" fill="var(--sky)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round" /></svg>
    <span>{{ text }}</span>
  </span>
</template>
