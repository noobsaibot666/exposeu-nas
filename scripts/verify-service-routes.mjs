import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const app = read('src/App.tsx')
const serviceMeta = read('src/data/serviceMeta.ts')

const expectedRoutes = [
  ['/services/concerts-events', 'ConcertsEvents'],
  ['/services/exhibition-gallery', 'ExhibitionGallery'],
  ['/services/artist-sessions', 'ArtistSessions'],
  ['/services/brand-agency', 'BrandAgency'],
]

const expectedRedirects = [
  ['/services/performance', '/services/concerts-events'],
  ['/services/gallery-stories', '/services/exhibition-gallery'],
  ['/services/fashion-show', '/services/brand-agency'],
  ['/services/atmospheric-films', '/services/concerts-events'],
]

const forbiddenImports = [
  "from './pages/Atmospheric'",
  "from './pages/Exhibitions'",
  "from './pages/FashionShow'",
  "from './pages/GalleryStories'",
  "from './pages/Performance'",
]

for (const [path, component] of expectedRoutes) {
  if (!app.includes(`path="${path}"`)) {
    throw new Error(`Missing canonical route ${path}`)
  }
  if (!app.includes(`element={<${component} />}`)) {
    throw new Error(`Route ${path} does not render ${component}`)
  }
}

for (const [from, to] of expectedRedirects) {
  if (!app.includes(`path="${from}"`)) {
    throw new Error(`Missing redirect route ${from}`)
  }
  if (!app.includes(`to="${to}"`)) {
    throw new Error(`Redirect ${from} does not point to ${to}`)
  }
}

for (const importPath of forbiddenImports) {
  if (app.includes(importPath)) {
    throw new Error(`Old service page import still exists: ${importPath}`)
  }
}

for (const slug of ['concerts-events', 'exhibition-gallery', 'artist-sessions', 'brand-agency']) {
  if (!serviceMeta.includes(`'${slug}'`)) {
    throw new Error(`serviceMeta is missing ${slug}`)
  }
}

const serviceListMatch = serviceMeta.match(/export const serviceList:[\s\S]*?\]\s*$/m)
if (!serviceListMatch) {
  throw new Error('Missing serviceList export')
}

const serviceList = serviceListMatch[0]
const listedServices = Array.from(serviceList.matchAll(/serviceMeta(?:\.([a-zA-Z0-9_]+)|\['([^']+)'\])/g)).map(
  (match) => match[1] ?? match[2],
)

if (listedServices.length !== 4) {
  throw new Error(`Expected 4 serviceList entries, found ${listedServices.length}: ${listedServices.join(', ')}`)
}

for (const oldSlug of ['documentation', 'gallery-stories', 'performance', 'fashion-show', 'atmospheric']) {
  if (listedServices.includes(oldSlug)) {
    throw new Error(`Old service slug is still in serviceList: ${oldSlug}`)
  }
}

console.log('Service route source checks passed.')
