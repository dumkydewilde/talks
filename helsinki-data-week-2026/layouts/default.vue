<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { asset } from '../config'
const { $page: currentPage } = useSlideContext()
</script>

<template>
  <div class="slidev-layout md-slide">
    <header class="deck-header">
      <img :src="asset('brand/motherduck-wordmark.png')" alt="MotherDuck" />
      <div class="header-actions"><span>THE DATA TEAM’S NEW TOOLS <span class="header-dot">/</span> HELSINKI DATA WEEK</span><FullscreenButton /></div>
    </header>
    <main class="slide-content"><slot /></main>
    <footer class="deck-footer">
      <span>DUMKY DE WILDE <span class="footer-slash">/</span> MOTHERDUCK</span>
      <span>{{ String(currentPage).padStart(2, '0') }} <span class="footer-slash">/</span> {{ currentPage > 15 ? 'PANEL' : 'THE FUTURE OF DATA TEAMS' }}</span>
    </footer>
  </div>
</template>
