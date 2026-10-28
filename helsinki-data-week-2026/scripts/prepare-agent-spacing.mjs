// Only numeric metrics and anonymous writer numbers enter the deck.
// Usage: node scripts/prepare-agent-spacing.mjs /path/to/spacing/out/conversation.json
import { readFileSync, writeFileSync } from 'node:fs'

const source = process.argv[2]
if (!source) throw new Error('Pass the local conversation.json path. Raw transcripts are never copied.')
const input = JSON.parse(readFileSync(source, 'utf8'))
const writers = new Map(input.sessions.map((s, i) => [s.id, i + 1]))
const output = {
  source: 'Personal OpenCode session analysis, 24–25 October 2026',
  sessions: input.sessions.length,
  totalMessages: input.messages.length,
  messages: input.messages.filter(m => m.words > 15).map(m => ({
    at: m.at,
    writer: writers.get(m.from) ?? 0,
    kind: m.from === 'human' ? 'human' : m.to === 'human' ? 'reply' : m.via === 'report' ? 'report' : 'a2a',
    spaces: m.spacesPer100,
  })),
}
writeFileSync(new URL('../lib/agent-spacing.json', import.meta.url), JSON.stringify(output))
console.log(`Prepared ${output.messages.length} numeric records from ${output.totalMessages} messages. No text, IDs, paths, or titles included.`)
