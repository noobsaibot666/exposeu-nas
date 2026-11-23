import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distArg = process.argv.indexOf('--dist-dir')
const distDir = distArg >= 0 ? path.resolve(process.argv[distArg + 1]) : path.join(repoRoot, 'dist')

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'))

const loadLocaleBundle = async (locale) => {
  const [
    common,
    nav,
    footer,
    home,
    about,
    contact,
    forms,
    services,
    portfolio,
    faq,
    testimonials,
    pricing,
    callSession,
  ] = await Promise.all([
    readJson(`src/locales/${locale}/common.json`),
    readJson(`src/locales/${locale}/nav.json`),
    readJson(`src/locales/${locale}/footer.json`),
    readJson(`src/locales/${locale}/home.json`),
    readJson(`src/locales/${locale}/about.json`),
    readJson(`src/locales/${locale}/contact.json`),
    readJson(`src/locales/${locale}/forms.json`),
    readJson(`src/locales/${locale}/services.json`),
    readJson(`src/locales/${locale}/portfolio.json`),
    readJson(`src/locales/${locale}/faq.json`),
    readJson(`src/locales/${locale}/testimonials.json`),
    readJson(`src/locales/${locale}/pricing.json`),
    readJson(`src/locales/${locale}/callSession.json`),
  ])
  return {
    locale,
    common,
    nav,
    footer,
    home,
    about,
    contact,
    forms,
    services,
    portfolio,
    faq,
    testimonials,
    pricing,
    callSession,
  }
}

const [baseHtml, enBundle, deBundle, projectImages, serviceImages, projectSlugs] = await Promise.all([
  readFile(path.join(distDir, 'index.html'), 'utf8'),
  loadLocaleBundle('en'),
  loadLocaleBundle('de'),
  readJson('src/data/projectPreviewImages.json'),
  readJson('src/data/servicePreviewImages.json'),
  readJson('src/data/projectSlugs.json'),
])

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const locPath = (locale, p) => {
  if (locale === 'de') return p === '/' ? '/de' : `/de${p}`
  return p
}

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

function renderShell(bundle, bodyHtml) {
  const { locale, nav, footer, services } = bundle
  const p = (pathStr) => escapeHtml(locPath(locale, pathStr))
  const serviceSlugs = ['concerts-events', 'exhibition-gallery', 'artist-sessions', 'brand-agency']
  return [
    '<header>',
    '  <nav aria-label="' + escapeHtml(nav.mobileMenu) + '">',
    `    <a href="${p('/')}">${escapeHtml(nav.brand)}</a>`,
    `    <a href="${p('/')}">${escapeHtml(nav.home)}</a>`,
    `    <a href="${p('/services')}">${escapeHtml(nav.services)}</a>`,
    `    <a href="${p('/portfolio')}">${escapeHtml(nav.lastProjects)}</a>`,
    `    <a href="${p('/about')}">${escapeHtml(nav.about)}</a>`,
    `    <a href="${p('/contact')}">${escapeHtml(nav.contact)}</a>`,
    '  </nav>',
    '</header>',
    `<main id="main">\n${bodyHtml}\n</main>`,
    '<footer>',
    `  <p>${escapeHtml(footer.brand)}</p>`,
    `  <p>${escapeHtml(footer.tagline)}</p>`,
    `  <p>${escapeHtml(footer.trust)}</p>`,
    `  <p>${escapeHtml(footer.ctaPrefix)} <a href="${p('/contact')}">${escapeHtml(footer.ctaLink)}</a>.</p>`,
    '  <nav>',
    ...serviceSlugs.map((slug) => `    <a href="${p(`/services/${slug}`)}">${escapeHtml(services.labels[`${slug}-short`] || services.labels[slug])}</a>`),
    `    <a href="${p('/portfolio')}">${escapeHtml(footer.viewPortfolio)}</a>`,
    `    <a href="${p('/impressum')}">Impressum</a>`,
    '    <a href="https://instagram.com/xposeu_official">Instagram</a>',
    '    <a href="https://wa.me/48786696765">WhatsApp</a>',
    '  </nav>',
    '</footer>',
  ].join('\n')
}

function renderFaqHtml(faq, category) {
  const items = [...(faq.general || []), ...(category && faq[category] ? faq[category] : [])]
  return [
    '<section>',
    `  <h2>${escapeHtml(faq.label)}</h2>`,
    ...items.map((item) => `  <div><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></div>`),
    '</section>',
  ].join('\n')
}

function renderTestimonialsHtml(_testimonials, _service) {
  return ''
}

function _renderTestimonialsHtmlDisabled(testimonials, service) {
  const items = (testimonials.items || []).filter((item) => !service || item.service === service)
  if (!items.length) return ''
  return [
    '<section>',
    `  <h2>${escapeHtml(testimonials.heading)}</h2>`,
    ...items.map((item) => `  <blockquote><p>${escapeHtml(item.quote)}</p><footer>${escapeHtml(item.author)}, ${escapeHtml(item.role)}, ${escapeHtml(item.company)}</footer></blockquote>`),
    '</section>',
  ].join('\n')
}

function renderHomeBody(bundle) {
  const { locale, home, faq, testimonials } = bundle
  const p = (pathStr) => escapeHtml(locPath(locale, pathStr))
  const offerKeys = ['exhibition-gallery', 'designed-experiences', 'live-work-artists']
  const serviceKeys = ['exhibition-gallery', 'brand-agency', 'concerts-events', 'artist-sessions']
  return [
    '<section>',
    `  <h1>${escapeHtml(home.hero.headline)}</h1>`,
    `  <p>${escapeHtml(home.hero.subhead)}</p>`,
    `  <a href="${p('/contact')}">${escapeHtml(home.hero.primaryCta)}</a>`,
    `  <a href="${p('/portfolio')}">${escapeHtml(home.hero.secondaryCta)}</a>`,
    '</section>',
    '<section>',
    `  <p>${escapeHtml(home.offerSection.label)}</p>`,
    `  <h2>${escapeHtml(home.offerSection.headline)}</h2>`,
    `  <p>${escapeHtml(home.offerSection.intro)}</p>`,
    ...offerKeys.map((k) => {
      const c = home.offerSection.cards[k]
      return `  <div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.subtext)}</p></div>`
    }),
    '</section>',
    '<section>',
    `  <p>${escapeHtml(home.proof.badge)}</p>`,
    `  <h2>${escapeHtml(home.proof.headline)}</h2>`,
    `  <p>${escapeHtml(home.proof.copy)}</p>`,
    '</section>',
    '<section>',
    `  <p>${escapeHtml(home.services.label)}</p>`,
    `  <h2>${escapeHtml(home.services.headline)}</h2>`,
    ...serviceKeys.map((k) => {
      const c = home.services.cards[k]
      return `  <a href="${p(`/services/${k}`)}"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.subtext)}</p><span>${escapeHtml(c.cta)}</span></a>`
    }),
    '</section>',
    '<section>',
    `  <p>${escapeHtml(home.lastProjects.label)}</p>`,
    `  <h2>${escapeHtml(home.lastProjects.headline)}</h2>`,
    ...Object.values(home.lastProjects.items).map((item) => `  <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.subtext)}</p></div>`),
    '</section>',
    '<section>',
    `  <h2>${escapeHtml(home.process.headline)}</h2>`,
    `  <p>${escapeHtml(home.process.intro)}</p>`,
    ...(home.process.steps || []).map((s) => `  <div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p></div>`),
    '</section>',
    renderTestimonialsHtml(testimonials),
    renderFaqHtml(faq),
    '<section>',
    `  <h2>${escapeHtml(home.project.headline)}</h2>`,
    `  <p>${escapeHtml(home.project.copy)}</p>`,
    `  <a href="${p('/contact')}">${escapeHtml(home.project.requestAvailability)}</a>`,
    `  <a href="${p('/portfolio')}">${escapeHtml(home.project.seeLatestWork)}</a>`,
    '</section>',
  ].join('\n')
}

function renderServicesIndexBody(bundle) {
  const { locale, home } = bundle
  const p = (pathStr) => escapeHtml(locPath(locale, pathStr))
  const serviceKeys = ['exhibition-gallery', 'brand-agency', 'concerts-events', 'artist-sessions']
  return [
    '<section>',
    `  <p>${escapeHtml(home.services.label)}</p>`,
    `  <h1>${escapeHtml(home.services.headline)}</h1>`,
    ...serviceKeys.map((k) => {
      const c = home.services.cards[k]
      return `  <a href="${p(`/services/${k}`)}"><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.subtext)}</p><span>${escapeHtml(c.cta)}</span></a>`
    }),
    '</section>',
  ].join('\n')
}

function renderServicePageBody(bundle, slug) {
  const { locale, services, faq, testimonials, pricing } = bundle
  const p = (pathStr) => escapeHtml(locPath(locale, pathStr))
  const page = services.pages[slug]
  const shared = services.shared
  const pricingSection = page.pricing
    ? `<section><p>${escapeHtml(page.pricing.body)}</p><a href="${p(`/contact?service=${slug}`)}">${escapeHtml(page.pricing.cta)}</a></section>`
    : `<section><h2>${escapeHtml(shared.pricingFor.replace('{{service}}', page.title.toLowerCase()))}</h2>${(pricing.tiers || []).map((t) => `<div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.description)}</p></div>`).join('')}</section>`
  return [
    '<section>',
    `  <p>${escapeHtml(page.title)}</p>`,
    `  <h1>${escapeHtml(page.heroCopy)}</h1>`,
    page.detail ? `  <p>${escapeHtml(page.detail)}</p>` : '',
    page.socialProof ? `  <p>${escapeHtml(page.socialProof)}</p>` : '',
    `  <a href="${p(`/contact?service=${slug}`)}">${escapeHtml(page.footerCtaLabel || shared.requestAvailability)}</a>`,
    '</section>',
    '<section>',
    `  <p>${escapeHtml(shared.whatYouGet)}</p>`,
    `  <h2>${escapeHtml(page.galleryTitle)}</h2>`,
    `  <p>${escapeHtml(page.galleryCopy)}</p>`,
    ...(page.gallery || []).map((item) => `  <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.subtitle)}</p></div>`),
    '</section>',
    '<section>',
    `  <p>${escapeHtml(shared.idealFor)}</p>`,
    `  <p>${escapeHtml(page.extraGalleryCopy)}</p>`,
    ...(page.extraGallery || []).map((item) => `  <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.subtitle)}</p></div>`),
    '</section>',
    '<section>',
    `  <p>${escapeHtml(shared.howItWorks)}</p>`,
    `  <h2>${escapeHtml(shared.howItWorksHeading)}</h2>`,
    ...(shared.process || []).map((step) => `  <div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.body)}</p></div>`),
    '</section>',
    pricingSection,
    renderTestimonialsHtml(testimonials, slug),
    renderFaqHtml(faq, slug),
    '<section>',
    `  <p>${escapeHtml(shared.readyToCollaborate)}</p>`,
    `  <h2>${escapeHtml(page.ctaText)}</h2>`,
    `  <p>${escapeHtml(shared.responseTime)}</p>`,
    `  <a href="${p(`/contact?service=${slug}`)}">${escapeHtml(page.footerCtaLabel || shared.requestAvailability)}</a>`,
    '  <a href="https://wa.me/48786696765">WhatsApp</a>',
    '</section>',
  ].filter(Boolean).join('\n')
}

function renderAboutBody(bundle) {
  const { page } = bundle.about
  return [
    '<section>',
    `  <p>${escapeHtml(page.title)}</p>`,
    `  <h1>${escapeHtml(page.tagline)}</h1>`,
    ...(page.paragraphs || []).map((para) => `  <p>${escapeHtml(para)}</p>`),
    `  <p>${escapeHtml(page.location)}</p>`,
    '</section>',
    '<section>',
    `  <h2>${escapeHtml(page.teamTitle)}</h2>`,
    ...(page.members || []).map((m) => `  <div><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.role)}</p><p>${escapeHtml(m.bio)}</p></div>`),
    '</section>',
  ].join('\n')
}

function renderContactBody(bundle) {
  const { contact, forms } = bundle
  const f = forms.contact.fields
  return [
    '<section>',
    `  <p>${escapeHtml(contact.eyebrow)}</p>`,
    `  <h1>${escapeHtml(contact.headline)}</h1>`,
    `  <p>${escapeHtml(contact.ledePrimary)}</p>`,
    '  <div>',
    `    <p>${escapeHtml(contact.labels.email)}: <a href="mailto:hello@expose-u.com">hello@expose-u.com</a></p>`,
    `    <p>${escapeHtml(contact.labels.phone)}: <a href="tel:+4917622132950">+49 176 2213 2950</a></p>`,
    `    <p>${escapeHtml(contact.labels.instagram)}: xposeu_official</p>`,
    `    <p>${escapeHtml(contact.labels.threads)}: xposeu_official</p>`,
    `    <p>${escapeHtml(contact.labels.studio)}: ${escapeHtml(contact.studioAddress)}</p>`,
    '  </div>',
    '  <form>',
    `    <label>${escapeHtml(f.name)}</label>`,
    `    <label>${escapeHtml(f.email)}</label>`,
    `    <label>${escapeHtml(f.role)}</label>`,
    `    <label>${escapeHtml(f.projectDate)}</label>`,
    `    <label>${escapeHtml(f.website)}</label>`,
    `    <label>${escapeHtml(f.projectType)}</label>`,
    `    <label>${escapeHtml(f.message)}</label>`,
    `    <button type="submit">${escapeHtml(forms.contact.submit.idle)}</button>`,
    '  </form>',
    `  <p>${escapeHtml(contact.bookCallPrefix)} <a href="https://calendly.com/alan-creative/15min">${escapeHtml(contact.bookCallLink)}</a></p>`,
    `  <p><a href="https://wa.me/48786696765">${escapeHtml(contact.whatsapp)}</a></p>`,
    '</section>',
  ].join('\n')
}

function renderPortfolioBody(bundle) {
  const { locale, portfolio } = bundle
  const p = (pathStr) => escapeHtml(locPath(locale, pathStr))
  return [
    '<section>',
    `  <p>${escapeHtml(portfolio.hero.eyebrow)}</p>`,
    `  <h1>${escapeHtml(portfolio.hero.headline)}</h1>`,
    `  <p>${escapeHtml(portfolio.hero.copy)}</p>`,
    `  <p>${(portfolio.proofStrip || []).map(escapeHtml).join(' · ')}</p>`,
    ...(portfolio.videos || []).map((v) => {
      const slug = projectSlugs[v.id] ?? v.id
      return `  <article><a href="${p(`/projects/${slug}`)}"><h2>${escapeHtml(v.title)}</h2><p>${escapeHtml(v.description)}</p><p>${escapeHtml(v.context)}</p><p>${escapeHtml(v.outcome)}</p></a></article>`
    }),
    '</section>',
  ].join('\n')
}

function renderProjectDetailBody(bundle, project) {
  const { portfolio } = bundle
  return [
    '<section>',
    `  <p>${escapeHtml(project.tag)}</p>`,
    `  <h1>${escapeHtml(project.title)}</h1>`,
    `  <p>${escapeHtml(project.description)}</p>`,
    `  <p>${escapeHtml(portfolio.labels.context)}: ${escapeHtml(project.context)}</p>`,
    `  <p>${escapeHtml(portfolio.labels.outcome)}: ${escapeHtml(project.outcome)}</p>`,
    ...(project.story || []).map((s) => `  <p>${escapeHtml(s)}</p>`),
    project.highlight ? `  <blockquote>${escapeHtml(project.highlight)}</blockquote>` : '',
    '</section>',
  ].filter(Boolean).join('\n')
}

function renderCallSessionBody(bundle) {
  const { callSession } = bundle
  return [
    '<section>',
    `  <p>${escapeHtml(callSession.eyebrow)}</p>`,
    `  <h1>${escapeHtml(callSession.headline)}</h1>`,
    `  <p>${escapeHtml(callSession.copy)}</p>`,
    '  <a href="https://calendly.com/alan-creative/15min">Calendly</a>',
    '</section>',
  ].join('\n')
}

function renderReleaseKitBody(bundle) {
  const rk = bundle.services.pages['release-content-kit']
  return [
    '<section>',
    `  <h1>${escapeHtml(rk.hero.h1Line1)} ${escapeHtml(rk.hero.h1Line2)}</h1>`,
    `  <p>${escapeHtml(rk.hero.subheadline)}</p>`,
    '</section>',
    '<section>',
    `  <h2>${escapeHtml(rk.audience.h2)}</h2>`,
    `  <p>${(rk.audience.artistTypes || []).map(escapeHtml).join(', ')}</p>`,
    `  <p>${(rk.audience.releaseTypes || []).map(escapeHtml).join(', ')}</p>`,
    '</section>',
  ].join('\n')
}

function renderPage({ pathname, locale, title, description, image, bodyHtml, noAlternates }) {
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
  if (!noAlternates) {
    const enPath = pathname.replace(/^\/de(?=\/|$)/, '') || '/'
    const dePath = pathname.startsWith('/de') ? pathname : `/de${pathname === '/' ? '' : pathname}`
    html = updateLink(html, 'alternate', 'en', `https://expose-u.com${enPath}`)
    html = updateLink(html, 'alternate', 'de', `https://expose-u.com${dePath}`)
  }
  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">\n${bodyHtml}\n</div>`)
  }
  return html
}

async function writePage(pathname, bundle, meta) {
  const { locale } = bundle
  const imageName = meta.imageKey ? `og/previews/${meta.imageKey}.webp` : 'og-default.png'
  const imageUrl = `https://expose-u.com/${imageName}`
  if (meta.imageKey && meta.imageSource) {
    const publicImage = path.join(repoRoot, meta.imageSource.replace(/^\//, ''))
    const outputImage = path.join(distDir, imageName)
    await mkdir(path.dirname(outputImage), { recursive: true })
    await copyFile(publicImage, outputImage)
  }
  const outputDir = pathname === '/'
    ? distDir
    : path.join(distDir, pathname.replace(/^\//, ''))
  await mkdir(outputDir, { recursive: true })
  const bodyHtml = renderShell(bundle, meta.bodyHtml)
  await writeFile(
    path.join(outputDir, 'index.html'),
    renderPage({ ...meta, pathname, locale, image: imageUrl, bodyHtml }),
    'utf8',
  )
}

for (const bundle of [enBundle, deBundle]) {
  const { locale, common, portfolio } = bundle
  const prefix = locale === 'de' ? '/de' : ''

  // Home
  await writePage(locale === 'de' ? '/de' : '/', bundle, {
    title: common.meta.home.title,
    description: common.meta.home.description,
    bodyHtml: renderHomeBody(bundle),
  })

  // Services index
  await writePage(`${prefix}/services`, bundle, {
    title: common.meta.servicesIndex.title,
    description: common.meta.servicesIndex.description,
    bodyHtml: renderServicesIndexBody(bundle),
  })

  // About
  await writePage(`${prefix}/about`, bundle, {
    title: common.meta.about.title,
    description: common.meta.about.description,
    bodyHtml: renderAboutBody(bundle),
  })

  // Contact
  await writePage(`${prefix}/contact`, bundle, {
    title: common.meta.contact.title,
    description: common.meta.contact.description,
    bodyHtml: renderContactBody(bundle),
  })

  // Portfolio
  await writePage(`${prefix}/portfolio`, bundle, {
    title: common.meta.portfolio.title,
    description: common.meta.portfolio.description,
    imageKey: 'portfolio',
    imageSource: projectImages['leonis-voo-store'],
    bodyHtml: renderPortfolioBody(bundle),
  })

  // Call session & Release Content Kit
  await writePage(`${prefix}/call-session`, bundle, {
    title: common.meta.callSession.title,
    description: common.meta.callSession.description,
    bodyHtml: renderCallSessionBody(bundle),
  })
  await writePage(`${prefix}/release-content-kit`, bundle, {
    title: common.meta.releaseContentKit.title,
    description: common.meta.releaseContentKit.description,
    bodyHtml: renderReleaseKitBody(bundle),
  })

  // 4 Service pages
  for (const [slug, metaKey] of [
    ['concerts-events', 'concerts'],
    ['exhibition-gallery', 'exhibition'],
    ['artist-sessions', 'artist'],
    ['brand-agency', 'brand'],
  ]) {
    const pageMeta = common.meta.services[metaKey]
    await writePage(`${prefix}/services/${slug}`, bundle, {
      title: pageMeta.title,
      description: pageMeta.description,
      imageKey: `service-${slug}`,
      imageSource: serviceImages[slug],
      bodyHtml: renderServicePageBody(bundle, slug),
    })
  }

  // Project detail pages
  for (const project of portfolio.videos) {
    const imageSource = projectImages[project.id]
    if (!imageSource) throw new Error(`Missing social preview image for project ${project.id}`)
    const slug = projectSlugs[project.id] ?? project.id
    await writePage(`${prefix}/projects/${slug}`, bundle, {
      title: `${project.title} | expose.u`,
      description: project.description,
      imageKey: `project-${project.id}`,
      imageSource,
      bodyHtml: renderProjectDetailBody(bundle, project),
    })
  }
}

// English-only legal routes
for (const [routePath, metaKey] of [
  ['/terms', 'terms'],
  ['/data-deletion', 'dataDeletion'],
]) {
  await writePage(routePath, enBundle, {
    title: enBundle.common.meta[metaKey].title,
    description: enBundle.common.meta[metaKey].description,
    noAlternates: true,
    bodyHtml: `<section><h1>${escapeHtml(enBundle.common.meta[metaKey].title)}</h1><p>${escapeHtml(enBundle.common.meta[metaKey].description)}</p></section>`,
  })
}

// Impressum & Privacy (EN & DE)
for (const bundle of [enBundle, deBundle]) {
  const prefix = bundle.locale === 'de' ? '/de' : ''
  await writePage(`${prefix}/impressum`, bundle, {
    title: bundle.common.meta.impressum.title,
    description: bundle.common.meta.impressum.description,
    bodyHtml: `<section><h1>${escapeHtml(bundle.common.meta.impressum.title)}</h1><p>${escapeHtml(bundle.common.meta.impressum.description)}</p></section>`,
  })
  await writePage(`${prefix}/privacy`, bundle, {
    title: bundle.common.meta.privacy.title,
    description: bundle.common.meta.privacy.description,
    bodyHtml: `<section><h1>${escapeHtml(bundle.common.meta.privacy.title)}</h1><p>${escapeHtml(bundle.common.meta.privacy.description)}</p></section>`,
  })
}

console.log('Pre-rendered HTML content, metadata, canonical and hreflang tags for all routes (EN/DE).')
