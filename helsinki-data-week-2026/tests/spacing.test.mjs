import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { median, rollingSeries } from '../lib/spacing-metrics.mjs'

test('medians do not mutate the input', () => {
  const values = [5, 1, 3, 9]
  assert.equal(median(values), 4)
  assert.deepEqual(values, [5, 1, 3, 9])
  assert.equal(median([]), null)
})

test('rolling lines do not bridge 90-minute gaps', () => {
  const result = rollingSeries([{ at: 0, spaces: 16 }, { at: 60_000, spaces: 14 }, { at: 200 * 60_000, spaces: 3 }])
  assert.deepEqual(result, [{ at: 0, spaces: 15 }, { at: 60_000, spaces: 15 }, null, { at: 200 * 60_000, spaces: 3 }])
})

test('bundled agent metrics contain no private transcript fields', () => {
  const data = JSON.parse(readFileSync(new URL('../lib/agent-spacing.json', import.meta.url)))
  assert.equal(data.sessions, 19)
  assert.equal(data.totalMessages, 599)
  assert.ok(data.messages.length > 100)
  for (const message of data.messages) {
    assert.deepEqual(Object.keys(message).sort(), ['at', 'kind', 'spaces', 'writer'])
    assert.ok(Number.isFinite(message.spaces))
    assert.ok(['a2a', 'human', 'report', 'reply'].includes(message.kind))
  }
})
