<script setup lang="ts">
// The whole migration on one line. Steps 06–08 repeat per workload.
// `active` highlights where we are in the workshop; `compact` renders the slim "you are here" strip.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ active?: number; compact?: boolean; reveal?: boolean }>()
// With `reveal`, the per-workload steps 06–08 appear on the first click.
const { $clicks } = useSlideContext()
const showLoop = computed(() => !props.reveal || $clicks.value >= 1)

const steps = [
  { title: 'Decide', caption: 'What’s in scope' },
  { title: 'Inventory', caption: 'Bucket, size, complexity' },
  { title: 'Strategy', caption: 'Shift, rebuild, improve' },
  { title: 'Group', caption: 'Independent workloads' },
  { title: 'Infra', caption: 'Secrets, repos, compute' },
  { title: 'Move', caption: 'Checks → raw → models' },
  { title: 'Validate', caption: 'Against the source' },
  { title: 'Cut over', caption: 'Consumers, one by one' },
]
const state = (i: number) => props.active === undefined ? 'idle' : i + 1 === props.active ? 'active' : i + 1 < props.active ? 'done' : 'idle'
</script>

<template>
  <div class="migration-flow" :class="{ compact }">
    <ol>
      <li v-for="(s, i) in steps" :key="s.title" :class="[state(i), { loop: i >= 5, pending: i >= 5 && !showLoop }]">
        <span class="flow-index">0{{ i + 1 }}</span>
        <strong>{{ s.title }}</strong>
        <span v-if="!compact" class="flow-caption">{{ s.caption }}</span>
      </li>
    </ol>
    <div class="flow-loop" :class="{ pending: !showLoop }" aria-hidden="true">
      <span class="flow-once">ONCE</span>
      <span class="flow-repeat">↻ REPEAT PER WORKLOAD</span>
    </div>
  </div>
</template>
