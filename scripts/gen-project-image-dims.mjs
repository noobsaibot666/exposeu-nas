#!/usr/bin/env node
// Reads the pixel size of every portfolio project image (WebP header only,
// no dependencies) into src/data/projectImageDims.json. Project pages use it
// to pick layouts (landscape full-bleed, portrait pairs) and to reserve each
// image's exact space before it loads (no layout shift).
//
//   node scripts/gen-project-image-dims.mjs
//
// Re-run after adding or replacing images under the folder below.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIR = join(ROOT, 'src/assets/images/thumbs/portfolio')
const OUT = join(ROOT, 'src/data/projectImageDims.json')

function webpSize(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null
  const chunk = buf.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
  if (chunk === 'VP8L') {
    const b = buf.readUInt32LE(21)
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]
  }
  if (chunk === 'VP8X') {
    return [1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)), 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))]
  }
  return null
}

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name)
  return statSync(p).isDirectory() ? walk(p) : [p]
})

const dims = {}
let skipped = 0
for (const file of walk(DIR).filter((f) => f.endsWith('.webp')).sort()) {
  const size = webpSize(readFileSync(file).subarray(0, 32))
  if (!size) { skipped++; continue }
  dims[`/${relative(ROOT, file)}`] = size
}
writeFileSync(OUT, `${JSON.stringify(dims, null, 2)}\n`)
console.log(`wrote ${Object.keys(dims).length} entries to ${relative(ROOT, OUT)}${skipped ? ` (${skipped} unreadable)` : ''}`)
