const baseUrl = process.env.BASE_URL || 'http://localhost'

const canonical = [
  '/',
  '/de',
  '/about',
  '/de/about',
  '/call-session',
  '/de/call-session',
  '/release-content-kit',
  '/de/release-content-kit',
  '/exhibition-gallery',
  '/de/exhibition-gallery',
  '/brand-agency',
  '/de/brand-agency',
  '/popups',
  '/de/popups',
  '/gallery-museum-documentation',
  '/de/gallery-museum-documentation',
  '/artist-musician-documentation',
  '/de/artist-musician-documentation',
  '/contact',
  '/de/contact',
  '/contact-success',
  '/de/contact-success',
  '/services',
  '/de/services',
  '/services/concerts-events',
  '/de/services/concerts-events',
  '/services/exhibition-gallery',
  '/de/services/exhibition-gallery',
  '/services/artist-sessions',
  '/de/services/artist-sessions',
  '/services/brand-agency',
  '/de/services/brand-agency',
  '/impressum',
  '/de/impressum',
  '/privacy',
  '/terms',
  '/data-deletion',
  '/consent',
  '/portfolio',
  '/de/portfolio',
  '/pricing-request/single-event',
  '/de/pricing-request/single-event',
  '/pricing-request/success',
  '/de/pricing-request/success',
  '/concerts-berlin',
  '/de/concerts-berlin',
  '/projects/metaxy',
  '/de/projects/metaxy',
  '/projects/leonis-voo-space',
  '/de/projects/leonis-voo-space',
  '/projects/mirrwal-liquidrom',
  '/de/projects/mirrwal-liquidrom',
  '/projects/leonis-liquidrom',
  '/de/projects/leonis-liquidrom',
  '/projects/lick-the-walls',
  '/de/projects/lick-the-walls',
  '/projects/abigail-toll-idol',
  '/de/projects/abigail-toll-idol',
  '/projects/sanam-silent-green',
  '/de/projects/sanam-silent-green',
  '/projects/seefeel-silent-green',
  '/de/projects/seefeel-silent-green',
  '/projects/gleo-silent-green',
  '/de/projects/gleo-silent-green',
]

const redirects = [
  ['/old-home', '/'],
  ['/v2', '/'],
  ['/projects/v1', '/projects/lick-the-walls'],
  ['/projects/v2', '/projects/abigail-toll-idol'],
  ['/de/v2', '/de'],
  ['/de/old-home', '/de'],
  ['/artist-sessions', '/services/artist-sessions'],
  ['/de/artist-sessions', '/de/services/artist-sessions'],
  ['/services/performance', '/services/concerts-events'],
  ['/services/gallery-stories', '/services/exhibition-gallery'],
  ['/services/fashion-show', '/services/brand-agency'],
  ['/services/atmospheric-films', '/services/concerts-events'],
  ['/performance', '/services/concerts-events'],
  ['/gallery-stories', '/services/exhibition-gallery'],
  ['/fashion-show', '/services/brand-agency'],
  ['/atmospheric', '/services/concerts-events'],
  ['/documentation', '/services/exhibition-gallery'],
  ['/exhibitions', '/services/exhibition-gallery'],
]

const fetchUrl = async (path, options = {}) => {
  const url = new URL(path, baseUrl)
  return fetch(url, { redirect: 'manual', ...options })
}

const checkCanonical = async () => {
  for (const path of canonical) {
    const res = await fetchUrl(path)
    if (res.status >= 400) {
      throw new Error(`Canonical ${path} returned ${res.status}`)
    }
    console.log(`OK ${path} -> ${res.status}`)
  }
}

const checkRedirects = async () => {
  for (const [from, to] of redirects) {
    const res = await fetchUrl(from)
    const location = res.headers.get('location')
    if (res.status === 200) {
      console.log(`OK ${from} -> 200 SPA fallback for client-side redirect to ${to}`)
      continue
    }
    if (res.status !== 301 && res.status !== 302) {
      throw new Error(`Redirect ${from} expected 200 SPA fallback or 30x redirect, got ${res.status}`)
    }
    if (!location || !location.endsWith(to)) {
      throw new Error(`Redirect ${from} expected Location ${to}, got ${location}`)
    }
    console.log(`OK ${from} -> ${res.status} ${location}`)
  }
}

const run = async () => {
  try {
    await checkCanonical()
    await checkRedirects()
    console.log('All route checks passed.')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

run()
