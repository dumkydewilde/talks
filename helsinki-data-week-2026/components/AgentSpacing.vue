<script setup lang="ts">
import { computed, ref } from 'vue'
import data from '../lib/agent-spacing.json'
import { rollingSeries, median } from '../lib/spacing-metrics.mjs'
import { demoLinks } from '../config'

const selected = ref(0)
const agentMessages = data.messages.filter(m => m.kind === 'a2a')
const writerIds = [...new Set(agentMessages.map(m => m.writer))]
const mostChanged = [...writerIds].sort((a, b) => {
  const change = (id: number) => {
    const values = agentMessages.filter(m => m.writer === id)
    return values.length > 10 ? values[0].spaces - values.at(-1)!.spaces : -Infinity
  }
  return change(b) - change(a)
})
const first = Math.min(...data.messages.map(m => m.at))
const last = Math.max(...data.messages.map(m => m.at))
const x = (at: number) => 42 + (at - first) / (last - first) * 540
const y = (spaces: number) => 206 - Math.min(26, spaces) / 26 * 186
const path = (points: ({ at: number; spaces: number } | null)[]) => {
  let move = true
  return points.map(p => {
    if (!p) { move = true; return '' }
    const command = `${move ? 'M' : 'L'}${x(p.at).toFixed(1)},${y(p.spaces).toFixed(1)}`
    move = false
    return command
  }).join(' ')
}
const lines = writerIds.map(writer => ({ writer, path: path(rollingSeries(agentMessages.filter(m => m.writer === writer))) }))
const humanLine = path(rollingSeries(data.messages.filter(m => m.kind === 'reply')))
const earlyMedian = median(agentMessages.filter(m => m.at < agentMessages[0].at + 6 * 3600_000).map(m => m.spaces))
const lateMedian = median(agentMessages.filter(m => m.at > agentMessages.at(-1)!.at - 3 * 3600_000).map(m => m.spaces))
const highlighted = computed(() => selected.value ? `Agent ${selected.value}` : 'All writers')
const humanMedian = median(data.messages.filter(m => m.kind === 'reply' || m.kind === 'report').map(m => m.spaces))
const tickLabel = (at: number) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Helsinki', hour: '2-digit', minute: '2-digit' }).format(at)
</script>

<template>
  <div class="spacing-widget" @keydown.stop>
    <div class="spacing-chart">
      <div class="mini-heading">Spaces / 100 non-space characters <span>{{ highlighted }}</span></div>
      <svg viewBox="0 0 600 244" role="img" aria-label="Spacing in agent-to-agent messages declines over time, while replies to the human remain comparatively steady.">
        <g v-for="value in [0, 5, 10, 15, 20, 25]" :key="value"><line x1="42" x2="582" :y1="y(value)" :y2="y(value)" stroke="var(--rule)" /><text x="31" :y="y(value) + 4" text-anchor="end">{{ value }}</text></g>
        <line x1="42" x2="582" :y1="y(18)" :y2="y(18)" stroke="var(--muted)" stroke-dasharray="4 4" />
        <g v-for="(m, i) in agentMessages" :key="i"><circle :cx="x(m.at)" :cy="y(m.spaces)" r="2.2" fill="var(--sky-dark)" :opacity="!selected || selected === m.writer ? .35 : .07"><title>Agent {{ m.writer }} · {{ tickLabel(m.at) }} · {{ m.spaces.toFixed(1) }} spaces / 100</title></circle></g>
        <path :d="humanLine" fill="none" stroke="var(--garden-dark)" stroke-width="2.2" stroke-dasharray="5 3" />
        <path v-for="line in lines" :key="line.writer" :d="line.path" fill="none" stroke="var(--sky-dark)" :stroke-width="selected === line.writer ? 3.6 : 1.5" :opacity="!selected || selected === line.writer ? .95 : .16" />
        <text x="42" y="232">{{ tickLabel(first) }}</text><text x="312" y="232" text-anchor="middle">Helsinki time · 24 → 25 Oct</text><text x="582" y="232" text-anchor="end">{{ tickLabel(last) }}</text>
      </svg>
      <div class="chart-legend"><span><i class="agent-key" />Agent → agent / per writer</span><span><i class="human-key" />Agent → human</span></div>
      <div class="writer-controls"><label for="writer">Highlight</label><select id="writer" v-model.number="selected"><option :value="0">All writers</option><option v-for="writer in mostChanged" :key="writer" :value="writer">Agent {{ writer }}</option></select><button class="text-button" @click="selected = selected ? 0 : mostChanged[0]">{{ selected ? 'Show overview ↺' : 'Follow one writer →' }}</button></div>
    </div>
    <div class="spacing-findings">
      <span class="eyebrow">My agent logs / not a benchmark</span>
      <div class="spacing-bigstat">{{ earlyMedian?.toFixed(1) }} → {{ lateMedian?.toFixed(1) }}</div>
      <p>Agent → agent spacing.<br /><small>First 6h vs last 3h, pooled medians.</small></p>
      <div class="finding-rule" />
      <p>Replies to me &amp; subagent reports:<br /><strong>median {{ humanMedian?.toFixed(1) }}</strong> spaces / 100.</p>
      <p class="spacing-warning">A behavior to investigate.<br />Not proof of intent, efficiency, or correctness.</p>
      <a :href="demoLinks.agentSpacing" target="_blank" rel="noopener noreferrer">Open original Dive ↗</a>
    </div>
  </div>
  <p class="interaction-hint">{{ data.totalMessages }} messages · {{ data.sessions }} sessions · dots: messages &gt;15 words · lines: ±45-minute medians · code, URLs, paths &amp; IDs stripped before scoring. Metrics only; private text omitted.</p>
</template>
