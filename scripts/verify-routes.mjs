const baseUrl = process.env.BASE_URL || 'http://localhost'

const canonical = [
  '/performance',
  '/fashion-show',
  '/documentation',
  '/atmospheric',
]

const redirects = [
  ['/performances', '/performance'],
  ['/fashion-shows', '/fashion-show'],
  ['/documentations', '/documentation'],
  ['/atmospheric-films', '/atmospheric'],
  ['/exhibitions', '/documentation'],
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
    if (res.status !== 301) {
      throw new Error(`Redirect ${from} expected 301, got ${res.status}`)
    }
    if (!location || !location.endsWith(to)) {
      throw new Error(`Redirect ${from} expected Location ${to}, got ${location}`)
    }
    console.log(`OK ${from} -> 301 ${location}`)
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
