<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { asset } from '../config'
// Slidev passes slide frontmatter to layouts as props.
const props = defineProps<{ section?: string; step?: number }>()
// The 8 migration steps, shown as a slim "you are here" strip when a slide sets `step:`.
const steps = ['Decide', 'Inventory', 'Strategy', 'Group', 'Infra', 'Move', 'Validate', 'Cut over']
const { $page: currentPage } = useSlideContext()
</script>

<template>
  <div class="slidev-layout md-slide">
    <header class="deck-header">
      <img :src="asset('brand/motherduck-wordmark.png')" alt="MotherDuck" />
      <ol v-if="props.step" class="step-strip" aria-label="Migration steps">
        <li v-for="(s, i) in steps" :key="s" :class="{ done: i + 1 < props.step, active: i + 1 === props.step }">{{ s }}</li>
      </ol>
      <div class="header-actions"><span>MIGRATION WORKSHOP <span class="header-dot">/</span> DATA OUTPOST</span><FullscreenButton /></div>
    </header>
    <main class="slide-content"><slot /></main>
    <footer class="deck-footer">
      <span>DUMKY DE WILDE <span class="footer-slash">/</span> MOTHERDUCK</span>
      <span>{{ String(currentPage).padStart(2, '0') }} <span class="footer-slash">/</span> {{ props.section ?? 'MIGRATING TO MOTHERDUCK' }}</span>
    </footer>
  </div>
</template>
