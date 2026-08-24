// Every file under src/assets/images/ ships to production whether any
// component actually renders it or not — resolveImagePath.ts uses
// import.meta.glob('../assets/images/**/*', { eager: true }), which bundles
// the whole tree unconditionally. There's no dead-code elimination for
// images. This script reports which files on disk are never referenced from
// code, so unused weight (crop variants, working files, an old draft that
// got replaced) gets caught before it silently ships, not discovered later
// by reading a `vite build` size listing.
//
// Usage: node scripts/check-unused-images.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(repoRoot, 'src/assets/images')
const srcDir = path.join(repoRoot, 'src')

const imageExt = /\.(webp|jpe?g|png|gif|svg)$/i
const codeExt = /\.(tsx?|css)$/i

const walk = (dir, extFilter) => {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(full, extFilter))
    } else if (extFilter.test(entry.name)) {
      results.push(full)
    }
  }
  return results
}

// resolveImagePath() has been called with both single and double quotes in
// this codebase, sometimes split across lines — match on the raw file text
// (not line-by-line) so both styles and multi-line calls are caught.
const REFERENCE_PATTERNS = [
  /resolveImagePath\(\s*['"]([^'"]+)['"]/g,
  /url\(\s*['"]?([^'")]+\.(?:webp|jpe?g|png|gif|svg))['"]?\s*\)/gi,
]

const imageFiles = walk(imagesDir, imageExt)
const codeFiles = walk(srcDir, codeExt)

const referencedBasenames = new Set()
const referencedPaths = new Set()

// resolveImagePath() passes through external URLs and data: URIs untouched
// (see its own early-return) — they're never resolved against the local
// tree, so skip them here too rather than false-flagging them as broken.
const isExternal = (ref) => /^(https?:)?\/\//.test(ref) || ref.startsWith('data:')

for (const file of codeFiles) {
  const content = fs.readFileSync(file, 'utf8')
  for (const pattern of REFERENCE_PATTERNS) {
    for (const match of content.matchAll(pattern)) {
      const ref = match[1]
      if (isExternal(ref)) continue
      referencedPaths.add(ref)
      referencedBasenames.add(path.basename(ref))
    }
  }
}

const unused = []
let unusedBytes = 0
for (const file of imageFiles) {
  const base = path.basename(file)
  if (!referencedBasenames.has(base)) {
    const rel = path.relative(repoRoot, file)
    const size = fs.statSync(file).size
    unused.push({ rel, size })
    unusedBytes += size
  }
}

// Bonus check: a code reference whose filename doesn't match anything on
// disk at all is a broken/dead reference (e.g. a typo, or the asset was
// renamed and one call site got missed) — different problem, same sweep.
const onDiskBasenames = new Set(imageFiles.map((f) => path.basename(f)))
const broken = [...referencedPaths].filter((ref) => !onDiskBasenames.has(path.basename(ref)))

if (unused.length > 0) {
  unused.sort((a, b) => b.size - a.size)
  console.log(`Unreferenced images (${unused.length} files, ${(unusedBytes / 1024 / 1024).toFixed(2)} MB) — these ship to production but nothing renders them:\n`)
  for (const { rel, size } of unused) {
    console.log(`  ${(size / 1024).toFixed(1).padStart(8)} KB  ${rel}`)
  }
  console.log('')
} else {
  console.log('No unreferenced images found.\n')
}

if (broken.length > 0) {
  console.log(`Broken references (${broken.length}) — code points at a filename that doesn't exist on disk:\n`)
  for (const ref of broken) {
    console.log(`  ${ref}`)
  }
  console.log('')
}

if (unused.length === 0 && broken.length === 0) {
  process.exit(0)
}

process.exit(1)
