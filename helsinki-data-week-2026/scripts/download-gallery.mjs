import { mkdir, writeFile } from 'node:fs/promises'
import { diveExamples } from '../lib/dive-gallery.mjs'

// Download originals into a supplied staging directory. The deck uses optimized WebP copies.
const directory = process.argv[2]
if (!directory) throw new Error('Pass a staging directory for the public gallery screenshots.')
await mkdir(directory, { recursive: true })
await Promise.all(diveExamples.map(async example => {
  const response = await fetch(example.sourceImage)
  if (!response.ok) throw new Error(`${example.title}: HTTP ${response.status}`)
  await writeFile(`${directory}/${example.image.replace('.webp', '.png')}`, Buffer.from(await response.arrayBuffer()))
  console.log(example.title)
}))
