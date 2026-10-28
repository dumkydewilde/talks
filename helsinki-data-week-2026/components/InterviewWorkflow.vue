<script setup lang="ts">
import { ref } from 'vue'
import { asset, demoLinks } from '../config'
const step = ref(0)
const stages = [
  { title: 'Load', label: 'Flight / Python', headline: '1,250 interviews.\nOne question.', description: 'Load the public Anthropic Interviewer dataset and split transcripts into participant answers. Keep the source and cohort attached.', image: 'interview-overview.png', cue: 'The input: workforce, creatives, scientists.' },
  { title: 'Discover & classify', label: 'MotherDuck / AI SQL', headline: 'Make the text\nqueryable.', description: 'Draft a codebook from a stratified sample with prompt(). Apply the themes with prompt_jev(). Inspect ambiguous matches before scaling up.', image: 'interview-themes.png', cue: 'The human edits the definitions. The model proposes labels.' },
  { title: 'Explore & revise', label: 'Dive / interactive exploration', headline: 'Change the question.\nKeep the evidence.', description: 'Browse themes and source quotes. Merge overlapping categories, test on 500 answers, then reclassify. A Dive can trigger a Flight for the writeback.', image: 'interview-codebook.png', cue: 'A reusable research workflow—not a one-off summary.' },
]
</script>

<template>
  <div class="interview-widget" @keydown.stop>
    <div class="workflow-toolbar"><div class="step-tabs" role="tablist" aria-label="Interview demo stages"><button v-for="(stage, i) in stages" :id="`interview-stage-${i}`" :key="stage.title" role="tab" aria-controls="interview-panel" :aria-selected="step === i" :class="{ active: step === i }" @click="step = i">0{{ i + 1 }} / {{ stage.title }}</button></div><span class="fixture-label">LOCAL SCREENSHOTS</span></div>
    <div id="interview-panel" class="interview-body" role="tabpanel" :aria-labelledby="`interview-stage-${step}`">
      <div class="interview-copy"><span class="eyebrow">{{ stages[step].label }}</span><h3>{{ stages[step].headline }}</h3><p>{{ stages[step].description }}</p><div class="small-callout">{{ stages[step].cue }}</div></div>
      <a :href="demoLinks.dive" class="interview-screenshot" target="_blank" rel="noopener noreferrer" aria-label="Open Interview insights Dive in MotherDuck"><img :src="asset(`examples/${stages[step].image}`)" :alt="`${stages[step].title} in the Interview insights Dive`" /><span>OPEN LIVE DIVE ↗ <small>Requires your MotherDuck access</small></span></a>
    </div>
    <div class="workflow-bottom"><span>Screenshot walkthrough. No jobs or AI calls run from these slides.</span><button class="text-button" @click="step = (step + 1) % 3">{{ step === 2 ? 'Start again ↺' : 'Next stage →' }}</button></div>
  </div>
</template>
