import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distArg = process.argv.indexOf('--dist-dir')
const distDir = distArg >= 0 ? path.resolve(process.argv[distArg + 1]) : path.join(repoRoot, 'dist')

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'))
const [baseHtml, commonEn, commonDe, portfolioEn, portfolioDe, projectImages, serviceImages, projectSlugs] = await Promise.all([
  readFile(path.join(distDir, 'index.html'), 'utf8'),
  readJson('src/locales/en/common.json'),
  readJson('src/locales/de/common.json'),
  readJson('src/locales/en/portfolio.json'),
  readJson('src/locales/de/portfolio.json'),
  readJson('src/data/projectPreviewImages.json'),
  readJson('src/data/servicePreviewImages.json'),
  readJson('src/data/projectSlugs.json'),
])

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

function updateMeta(html, attribute, identity, content) {
  const escapedIdentity = identity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const selector = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escapedIdentity}["'])[^>]*>`, 'i')
  const escapedContent = escapeHtml(content)
  if (selector.test(html)) {
    return html.replace(selector, (tag) => /\bcontent=["'][^"']*["']/i.test(tag)
      ? tag.replace(/\bcontent=["'][^"']*["']/i, `content="${escapedContent}"`)
      : tag.replace(/\s*\/?>$/, ` content="${escapedContent}">`))
  }
  return html.replace('</head>', `    <meta ${attribute}="${escapeHtml(identity)}" content="${escapedContent}" />\n  </head>`)
}

function updateLink(html, rel, hrefLang, href) {
  const langSelector = hrefLang ? `(?=[^>]*\\bhreflang=["']${hrefLang}["'])` : ''
  const selector = new RegExp(`<link\\b(?=[^>]*\\brel=["']${rel}["'])${langSelector}[^>]*>`, 'i')
  if (selector.test(html)) {
    return html.replace(selector, (tag) => tag.replace(/\bhref=["'][^"']*["']/i, `href="${escapeHtml(href)}"`))
  }
  const langAttr = hrefLang ? ` hreflang="${hrefLang}"` : ''
  return html.replace('</head>', `    <link rel="${rel}"${langAttr} href="${escapeHtml(href)}" />\n  </head>`)
}

function renderPage({ pathname, locale, title, description, image }) {
  const canonical = `https://expose-u.com${pathname}`
  let html = baseHtml.replace(/<html\b([^>]*)\blang=["'][^"']*["']([^>]*)>/i, `<html$1lang="${locale}"$2>`)
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = updateMeta(html, 'name', 'description', description)
  html = updateMeta(html, 'property', 'og:title', title)
  html = updateMeta(html, 'property', 'og:description', description)
  html = updateMeta(html, 'property', 'og:image', image)
  html = updateMeta(html, 'property', 'og:url', canonical)
  html = updateMeta(html, 'property', 'og:locale', locale === 'de' ? 'de_DE' : 'en_US')
  html = updateMeta(html, 'name', 'twitter:title', title)
  html = updateMeta(html, 'name', 'twitter:description', description)
  html = updateMeta(html, 'name', 'twitter:image', image)
  html = html.replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/gi, '')
  html = updateLink(html, 'canonical', '', canonical)
  html = updateLink(html, 'alternate', 'en', `https://expose-u.com${pathname.replace(/^\/de(?=\/|$)/, '') || '/'}`)
  const dePath = pathname.startsWith('/de') ? pathname : `/de${pathname === '/' ? '' : pathname}`
  html = updateLink(html, 'alternate', 'de', `https://expose-u.com${dePath}`)
  return html
}

async function writePage(pathname, locale, meta) {
  const imageName = pathname === '/' || pathname === '/de'
    ? 'og-default.png'
    : `og/previews/${meta.imageKey}.webp`
  const publicImage = pathname === '/' || pathname === '/de'
    ? path.join(repoRoot, 'public', imageName)
    : path.join(repoRoot, meta.imageSource.replace(/^\//, ''))
  const outputImage = path.join(distDir, imageName)
  const imageUrl = `https://expose-u.com/${imageName}`
  if (meta.imageKey) {
    await mkdir(path.dirname(outputImage), { recursive: true })
    await copyFile(publicImage, outputImage)
  }
  const outputDir = pathname === '/'
    ? distDir
    : path.join(distDir, pathname.replace(/^\//, ''))
  await mkdir(outputDir, { recursive: true })
  await writeFile(path.join(outputDir, 'index.html'), renderPage({ ...meta, pathname, locale, image: imageUrl }), 'utf8')
}

const localeData = [
  { locale: 'en', common: commonEn, portfolio: portfolioEn },
  { locale: 'de', common: commonDe, portfolio: portfolioDe },
]

for (const { locale, common, portfolio } of localeData) {
  const homeMeta = common.meta.home
  const homePath = locale === 'de' ? '/de' : '/'
  await writePage(homePath, locale, {
    title: homeMeta.ogTitle || homeMeta.title,
    description: homeMeta.description,
  })

  const portfolioMeta = common.meta.portfolio
  const portfolioPath = locale === 'de' ? '/de/portfolio' : '/portfolio'
  await writePage(portfolioPath, locale, {
    title: portfolioMeta.title,
    description: portfolioMeta.description,
    imageKey: 'portfolio',
    imageSource: projectImages['leonis-voo-store'],
  })

  for (const [slug, metaKey] of [
    ['concerts-events', 'concerts'],
    ['exhibition-gallery', 'exhibition'],
    ['artist-sessions', 'artist'],
    ['brand-agency', 'brand'],
  ]) {
    const pagePath = `${locale === 'de' ? '/de' : ''}/services/${slug}`
    const pageMeta = common.meta.services[metaKey]
    await writePage(pagePath, locale, {
      title: pageMeta.title,
      description: pageMeta.description,
      imageKey: `service-${slug}`,
      imageSource: serviceImages[slug],
    })
  }

  for (const project of portfolio.videos) {
    const imageSource = projectImages[project.id]
    if (!imageSource) throw new Error(`Missing social preview image for project ${project.id}`)
    // Readable URL (src/data/projectSlugs.json); legacy /projects/<id> links
    // fall back to the SPA, which redirects them to the slug.
    const slug = projectSlugs[project.id] ?? project.id
    await writePage(`${locale === 'de' ? '/de' : ''}/projects/${slug}`, locale, {
      title: `${project.title} | expose.u`,
      description: project.description,
      imageKey: `project-${project.id}`,
      imageSource,
    })
  }
}

console.log('Pre-rendered social metadata for homepage, portfolio, 4 service pages, and all project pages (EN/DE).')
