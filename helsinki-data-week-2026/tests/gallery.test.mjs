import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { diveExamples } from '../lib/dive-gallery.mjs'

test('gallery uses the nine requested favourites, in order, with local screenshots and original links', () => {
  assert.deepEqual(diveExamples.map(example => example.slug), [
    'duckdb-pypi-download-stats-by-mehdio-2026-03-24',
    'dive-into-pivoting',
    'database-explorer-f8b99c',
    'a-home-fit-for-you',
    'financial-reporting-briefing-book',
    'nikola-joki-career-arc',
    'nba-game-quality-explorer-2025-26-by-matson',
    'the-vibe-coded-web-measured-common-crawl',
    'jev-jobs',
  ])
  for (const example of diveExamples) {
    assert.ok(existsSync(new URL(`../public/gallery/${example.image}`, import.meta.url)), example.title)
    assert.equal(example.url, `https://motherduck.com/dive-gallery/dives/${example.slug}/`)
    assert.ok(example.capability && example.description)
  }
})
