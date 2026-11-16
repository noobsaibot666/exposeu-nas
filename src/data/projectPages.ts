import { resolveImagePath } from '../utils/resolveImagePath'
import projectImageDims from './projectImageDims.json'
import projectSlugs from './projectSlugs.json'

// URL slug per project id (ids like `v1` aren't readable). Also read by
// scripts/prerender-social-pages.mjs, so keep it in JSON.
const SLUGS = projectSlugs as Record<string, string>

export const projectSlug = (id: string) => SLUGS[id] ?? id

/** Resolves a /projects/:param value: the current slug, or a legacy id. */
export function findProjectId(param: string, ids: string[]): { id: string; isLegacy: boolean } | null {
  const bySlug = ids.find((id) => projectSlug(id) === param)
  if (bySlug) return { id: bySlug, isLegacy: false }
  if (ids.includes(param)) return { id: param, isLegacy: projectSlug(param) !== param }
  return null
}

// Pixel size of every project image (scripts/gen-project-image-dims.mjs),
// keyed by the bundled URL so it can be looked up from resolved image paths.
const DIMS_BY_URL = new Map<string, [number, number]>(
  Object.entries(projectImageDims as Record<string, number[]>).map(([path, [w, h]]) => [resolveImagePath(path), [w, h]]),
)

export type Still = { src: string; w: number; h: number; portrait: boolean }

export function toStill(src: string): Still {
  const [w, h] = DIMS_BY_URL.get(src) ?? [1600, 1067]
  return { src, w, h, portrait: h > w * 1.05 }
}

export type GalleryBlock =
  | { kind: 'full'; a: Still }
  | { kind: 'duo'; a: Still; b: Still }
  | { kind: 'pair'; a: Still; b: Still }
  | { kind: 'single'; a: Still; side: 'left' | 'right' }

/**
 * Editorial rhythm from the images' real shapes: a landscape opens full-bleed,
 * the next two landscapes sit side by side, portraits pair up, and a lone
 * portrait is offset left/right. No crops are needed, so nothing is cut off.
 */
export function buildGallery(stills: Still[]): GalleryBlock[] {
  const blocks: GalleryBlock[] = []
  let side: 'left' | 'right' = 'right'
  for (let i = 0; i < stills.length; ) {
    const a = stills[i]
    const b = stills[i + 1]
    const previous = blocks[blocks.length - 1]
    if (!a.portrait) {
      if (b && !b.portrait && previous?.kind === 'full') {
        blocks.push({ kind: 'duo', a, b })
        i += 2
      } else {
        blocks.push({ kind: 'full', a })
        i += 1
      }
      continue
    }
    if (b?.portrait) {
      blocks.push({ kind: 'pair', a, b })
      i += 2
      continue
    }
    blocks.push({ kind: 'single', a, side })
    side = side === 'left' ? 'right' : 'left'
    i += 1
  }
  return blocks
}
