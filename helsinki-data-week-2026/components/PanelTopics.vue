<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
const topics = [
  { title: 'Flatter boundaries', tag: 'Roles & skills', question: 'If BI can ingest data and an AE can do DE work, what should still be a specialist’s job?', followup: 'Does everyone working with data or code need to become an AI engineer—or just learn to judge AI’s work?', target: 'Start with Adrian → bring in Amy and Stijn.' },
  { title: 'Uneven change', tag: 'Adoption & scale', question: 'Are BI, analytics engineering, and data engineering changing at the same speed?', followup: 'What changes between a five-person company and a regulated enterprise? Where are the real bottlenecks?', target: 'Ask for one concrete example from a small team and one from a large organization.' },
  { title: 'A team of one?', tag: 'Value & ownership', question: 'If everyone can ask a model questions, what is the data team’s contribution?', followup: 'Which responsibilities become more important: definitions, evaluation, reliability, access, or decision support?', target: 'Push past “governance”: what would the team actually do differently on Monday?' },
  { title: 'Access for everyone?', tag: 'Democratization', question: 'Should everyone have access to the data—or access to a data agent?', followup: 'What is the minimum safe toolkit: curated data, semantic context, sandbox, audit trail, escalation path?', target: 'Separate capability from permission. Who approves an agent taking action?' },
]
</script>

<template>
  <div class="panel-topics" @keydown.stop>
    <div class="topic-menu" role="tablist" aria-label="Panel discussion themes">
      <button v-for="(topic, i) in topics" :id="`topic-${i}`" :key="topic.title" role="tab" :aria-selected="active === i" aria-controls="topic-detail" :class="{ active: active === i }" @click="active = i"><span>0{{ i + 1 }}</span>{{ topic.title }}<b>↗</b></button>
    </div>
    <div id="topic-detail" class="topic-detail" role="tabpanel" :aria-labelledby="`topic-${active}`" aria-live="polite">
      <span class="eyebrow">{{ topics[active].tag }}</span>
      <h3>{{ topics[active].question }}</h3>
      <div class="followup"><span>GO ONE LEVEL DEEPER</span><p>{{ topics[active].followup }}</p></div>
      <p class="moderator-cue">{{ topics[active].target }}</p>
    </div>
  </div>
</template>
