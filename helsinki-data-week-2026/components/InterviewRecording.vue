<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { onSlideEnter, onSlideLeave, useIsSlideActive, useSlideContext } from '@slidev/client'
import { asset } from '../config'

const video = ref<HTMLVideoElement>()
const active = useIsSlideActive()
const { $renderContext } = useSlideContext()
const autoplay = computed(() => active.value && ['slide', 'presenter'].includes($renderContext.value))
const pause = () => video.value?.pause()
onSlideEnter(() => {
  if (!autoplay.value || !video.value) return
  video.value.muted = true
  video.value.currentTime = 0
  // Keep native controls available if the browser still blocks playback.
  void video.value.play().catch(() => {})
})
onSlideLeave(pause)
onUnmounted(pause)
</script>

<template>
  <video ref="video" class="interview-recording" :autoplay="autoplay" muted controls playsinline preload="metadata" :poster="asset('examples/interview-insights-poster.jpg')" aria-label="Interview insights screen recording" @keydown.stop>
    <source :src="asset('examples/interview-insights.mp4')" type="video/mp4" />
    Your browser cannot play this recording.
  </video>
</template>
