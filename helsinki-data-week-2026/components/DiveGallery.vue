<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { asset } from '../config'
import { diveExamples as examples } from '../lib/dive-gallery.mjs'
const selected = ref<number | null>(null)
const detail = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
let opener: HTMLButtonElement | null = null
async function open(index: number, event: MouseEvent) {
  opener = event.currentTarget as HTMLButtonElement
  selected.value = index
  await nextTick()
  closeButton.value?.focus()
}
function close() {
  selected.value = null
  opener?.focus()
}
function onDialogKey(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  if (event.key !== 'Tab') return
  const controls = [...(detail.value?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])]
  if (!controls.length) return
  const first = controls[0], last = controls.at(-1)
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
</script>

<template>
  <div class="gallery-wrapper">
  <div class="nine-dives" aria-label="Nine favourite MotherDuck Dives" @keydown.stop>
    <button v-for="(example, i) in examples" :key="example.title" class="dive-tile" @click="open(i, $event)">
      <span class="tile-chrome" aria-hidden="true"><i /><i /><i /></span>
      <img :src="asset(`gallery/${example.image}`)" :alt="`${example.title} Dive example`" />
      <span class="tile-caption">{{ example.title }}<i aria-hidden="true">↗</i></span>
    </button>
    <div v-if="selected !== null" ref="detail" class="gallery-detail" role="dialog" aria-modal="true" :aria-label="examples[selected].title" @keydown.stop="onDialogKey">
      <button ref="closeButton" class="gallery-close" @click="close" aria-label="Close enlarged Dive">×</button>
      <img :src="asset(`gallery/${examples[selected].image}`)" :alt="examples[selected].title" />
      <div><span class="eyebrow">{{ examples[selected].capability }}</span><strong>{{ examples[selected].title }}</strong><p>{{ examples[selected].description }}</p><a :href="examples[selected].url" target="_blank" rel="noopener noreferrer">Open in the Dive Gallery ↗</a></div>
    </div>
  </div>
  <p class="gallery-hint">Click to explore · Esc to return <span>motherduck.com/dive-gallery</span></p>
  </div>
</template>
