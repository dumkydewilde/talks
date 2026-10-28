<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const active = ref(false)
const supported = ref(false)
const failed = ref(false)
const sync = () => { active.value = Boolean(document.fullscreenElement) }

onMounted(() => {
  supported.value = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen)
  sync()
  document.addEventListener('fullscreenchange', sync)
})
onUnmounted(() => document.removeEventListener('fullscreenchange', sync))

async function toggle(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  failed.value = false
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
    sync()
    // Slidev pauses navigation while a button has focus.
    button.blur()
  } catch {
    failed.value = true
  }
}
</script>

<template>
  <button class="fullscreen-toggle" type="button" :disabled="!supported" :aria-label="active ? 'Exit fullscreen' : 'Enter fullscreen'" :aria-pressed="active" :title="!supported ? 'Fullscreen is not supported in this browser' : failed ? 'Fullscreen was blocked by your browser. Try again.' : active ? 'Exit fullscreen (Esc)' : 'Present fullscreen'" @click.stop="toggle" @keydown.space.stop @keydown.enter.stop>
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path v-if="!active" d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4" /><path v-else d="M3 7h4V3m6 0v4h4M7 17v-4H3m14 0h-4v4" /></svg>
    {{ active ? 'Exit fullscreen' : 'Fullscreen' }}
    <span v-if="failed" class="fullscreen-error" role="status">Browser blocked fullscreen. Try again.</span>
  </button>
</template>
