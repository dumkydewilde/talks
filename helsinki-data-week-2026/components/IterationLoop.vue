<script setup lang="ts">
const phases = [
  { name: 'Understand', caption: 'Explore the problem', x: 113 },
  { name: 'Define', caption: 'Frame the question', x: 287 },
  { name: 'Sketch', caption: 'Explore possibilities', x: 463 },
  { name: 'Decide', caption: 'Choose a small bet', x: 637 },
  { name: 'Prototype', caption: 'Make it testable', x: 813 },
  { name: 'Validate', caption: 'Check the evidence', x: 987 },
]
</script>

<template>
  <div class="design-sprint">
    <svg class="sprint-diagram" viewBox="0 0 1160 330" role="img" aria-labelledby="sprint-title sprint-description">
      <title id="sprint-title">The Design Sprint learning loop</title>
      <desc id="sprint-description">Three expanding and narrowing diamonds show the progression from a tangled problem, to competing ideas, to a tested approach. Understand, define, sketch, decide, prototype, validate, then use the evidence to ask a better question.</desc>
      <defs>
        <marker id="sprint-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="var(--ink)" stroke-width="1.5" /></marker>
      </defs>

      <g class="sprint-space-label" text-anchor="middle">
        <text x="200" y="16">FRAME THE PROBLEM</text>
        <text x="550" y="16">CHOOSE A BET</text>
        <text x="900" y="16">TEST WITH EVIDENCE</text>
      </g>

      <g stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">
        <path class="sprint-diamond" d="M25 125 200 30 375 125 200 220Z" fill="var(--sky)" fill-opacity=".18" />
        <path class="sprint-diamond" d="M375 125 550 30 725 125 550 220Z" fill="var(--sky)" fill-opacity=".18" />
        <path class="sprint-diamond" d="M725 125 900 30 1075 125 900 220Z" fill="var(--garden)" fill-opacity=".12" />
      </g>

      <path class="sprint-squiggle" d="M25 125H95 C160 125 172 75 222 75 C280 75 280 170 224 170 C160 170 148 92 193 100 C245 110 275 154 235 164 C195 174 143 143 177 111 C209 81 252 92 239 127 C223 160 206 153 208 125 C209 100 272 125 306 125H375" fill="none" stroke="var(--sky-dark)" stroke-width="3.5" stroke-linecap="round" />

      <g class="sprint-possibilities" fill="none" stroke="var(--sky-dark)" stroke-width="2.5" stroke-linecap="round">
        <path d="M375 125C440 125 470 65 550 65S660 125 725 125" />
        <path d="M375 125C440 125 480 95 550 95S660 125 725 125" />
        <path d="M375 125H725" />
        <path d="M375 125C440 125 480 155 550 155S660 125 725 125" />
        <path d="M375 125C440 125 470 185 550 185S660 125 725 125" />
      </g>

      <path class="sprint-tested-path" d="M725 125H759 C801 125 805 86 832 91 S868 157 900 143 S934 103 960 113 S994 125 1020 125H1110" fill="none" stroke="var(--garden-dark)" stroke-width="3.5" stroke-linecap="round" />
      <path d="m1101 118 10 7-10 7" fill="none" stroke="var(--garden-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <g fill="var(--sand)" stroke="var(--ink)" stroke-width="2"><circle cx="375" cy="125" r="6" /><circle cx="725" cy="125" r="6" /></g>

      <g v-for="phase in phases" :key="phase.name" :transform="`translate(${phase.x}, 0)`" class="sprint-phase" text-anchor="middle">
        <text y="254" class="phase-name">{{ phase.name }}</text>
        <text y="275" class="phase-caption">{{ phase.caption }}</text>
      </g>

      <path class="sprint-return" d="M1126 145V282Q1126 308 1100 308H60Q25 308 25 282V154" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="5 5" marker-end="url(#sprint-arrow)" />
      <rect x="349" y="296" width="465" height="24" fill="var(--sand)" />
      <text x="581" y="312" text-anchor="middle" class="sprint-return-label">CHECK THE EVIDENCE. ASK A BETTER QUESTION.</text>
    </svg>
  </div>
  <p class="sprint-credit">Phases: <a href="https://designsprintkit.withgoogle.com/methodology/overview" target="_blank" rel="noopener noreferrer">Google’s Design Sprint Kit ↗</a> · Visual inspiration: <a href="https://design-sprint.com/wp-content/uploads/2020/12/design-sprint-process.png" target="_blank" rel="noopener noreferrer">Design Sprint Ltd ↗</a></p>
</template>
