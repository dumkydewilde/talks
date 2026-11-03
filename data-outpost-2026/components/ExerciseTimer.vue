<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
const props = defineProps<{ minutes: number }>()
const left = ref(props.minutes * 60)
const running = ref(false)
let handle: ReturnType<typeof setInterval> | undefined

const label = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, '0')}`)
function toggle(e: MouseEvent) {
  running.value = !running.value
  if (running.value) handle = setInterval(() => { left.value = Math.max(0, left.value - 1); if (!left.value) stop() }, 1000)
  else clearInterval(handle)
  ;(e.currentTarget as HTMLButtonElement).blur()
}
function stop() { running.value = false; clearInterval(handle) }
function reset() { stop(); left.value = props.minutes * 60 }
onUnmounted(stop)
</script>

<template>
  <div class="exercise-timer" :class="{ running, over: !left }" @keydown.stop>
    <span>{{ label }}</span>
    <button type="button" @click="toggle">{{ running ? 'Pause' : 'Start' }}</button>
    <button type="button" class="text-button" @click="reset">Reset</button>
  </div>
</template>
