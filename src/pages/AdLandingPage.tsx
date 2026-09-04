import { type CSSProperties, type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { hasAnalyticsConsent, trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import AdLeadForm, { type AdLeadFormCopy } from '../components/AdLeadForm'
import './AdLandingPage.css'

type Platform = {
  name: string
  use: string
}

// Middle sections between the hero and the final CTA. Order is configurable
// per-page via `sectionOrder`; when unset the historical order is used so
// the other landing pages built on this component are unaffected.
export type SectionKey = 'audience' | 'whatItDoes' | 'included' | 'proof' | 'usage'

const DEFAULT_SECTION_ORDER: SectionKey[] = ['audience', 'whatItDoes', 'included', 'proof', 'usage']

export type AdLandingPageConfig = {
  slug: string
  serviceSlug: string
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  heroImage: string
  supportImage: string
  /** Optional CSS gradient placed over the hero image. Defaults to the shared dark wash. */
  heroOverlay?: string
  /** Vimeo background video for the hero. When set it replaces the still image
   *  (which stays as the instant poster). `mobileId` is a portrait-framed cut.
   *  `startAt` (seconds) skips into the source before playing — useful when the
   *  file opens on a slow/dark frame. Applies to the first play only; looping
   *  restarts from the true beginning (a Vimeo player behaviour, not ours). */
  heroVideo?: { id: string; mobileId?: string; hash?: string; startAt?: number }
  h1Line1: string
  h1Line2: string
  h1?: string
  /** Small uppercase line above the H1 — used for campaign / urgency framing. */
  heroKicker?: string
  subheadline: string
  cta: string
  ctaSecondary?: string
  /** When set, renders a fixed mobile-only CTA bar once the hero scrolls away. */
  stickyCta?: string
  /** Short reminder text shown beside the sticky CTA button. */
  stickyCtaNote?: string
  /** When set, renders an inline lead form (id="quick-book") right after the
   *  hero and points the hero / sticky / final / included CTAs at it instead of
   *  routing to the /contact page. Other landing pages omit it and are unchanged. */
  leadForm?: AdLeadFormCopy
  /** Explicit order (and inclusion) of the middle sections. Defaults to DEFAULT_SECTION_ORDER. */
  sectionOrder?: SectionKey[]
  audienceLabel: string
  audienceHeading: string
  audienceBody?: string[]
  audienceGroups: Array<{ title: string; items: string[] }>
  audienceItems?: Array<{ title: string; body: string }>
  includedLabel: string
  includedHeading: string
  includedLede?: string
  includedCards: Array<{ title: string; body: string; slug?: string }>
  includedCta?: string
  proofLabel?: string
  proofItems?: Array<{ title: string; body: string }>
  proofProse?: string[]
  whatItDoesLabel?: string
  whatItDoesHeading?: string
  whatItDoesItems?: Array<{ title: string; body: string }>
  usageLabel?: string
  usageHeading?: string
  usageIntro?: string
  platforms?: Platform[]
  usageCta?: string
  finalHeading: string
  finalBody: string
  pricingNote?: string
  finalCta: string
  metaContentName: string
  customPixelEvent: string
  ctaPackage?: string
}

const iconLabels = ['IG', 'TT', 'SP', 'YT', 'PR', 'AD']

// Vimeo "background" embed: muted, looping, autoplaying, no chrome. Kept in
// sync with the homepage hero (HomeV2.tsx). Preconnects to player.vimeo.com /
// *.vimeocdn.com already live in index.html, so this loads as fast as a Vimeo
// embed can.
const buildHeroVideoSrc = ({ id, hash, startAt }: { id: string; hash?: string; startAt?: number }): string => {
  const h = hash ? `h=${hash}&` : ''
  // dnt=1 skips Vimeo's own tracking/cookie setup on init — one less thing
  // blocking first frame, and it's a no-consent visitor anyway. #t=Ns (a URL
  // fragment, must stay last) starts the first play N seconds into the
  // source instead of at 0 — skips a slow/dark opening frame if the file has
  // one; looping afterwards restarts from the true beginning regardless.
  const t = startAt && startAt > 0 ? `#t=${startAt}s` : ''
  return `https://player.vimeo.com/video/${id}?${h}background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&api=1&dnt=1${t}`
}

const MOBILE_VIDEO_QUERY = '(max-width: 600px)'

export default function AdLandingPage({ config }: { config: AdLandingPageConfig }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const heroRef = useRef<HTMLElement | null>(null)
  const [stickyVisible, setStickyVisible] = useState(false)
  const contactPath = `/contact?service=${config.serviceSlug}${config.ctaPackage ? `&package=${encodeURIComponent(config.ctaPackage)}` : ''}`
  const heroOverlay = config.heroOverlay ?? 'linear-gradient(90deg, rgba(5, 7, 11, 0.88), rgba(5, 7, 11, 0.5))'
  // Image and overlay are passed as custom properties so the stylesheet can
  // recompose them per breakpoint (mobile drops the wash and uses a vertical
  // scrim instead, so the photo reads at the top of the screen). The still
  // heroImage stays the background even when a video is set — it's the same
  // shoot, so it's a real frame, not a mismatch — so there's a meaningful
  // paint from the first frame instead of a dark screen while Vimeo loads;
  // the video then cross-fades in on top of it once it's actually playing.
  const heroStyle = {
    '--alp-hero-image': `url(${config.heroImage})`,
    '--alp-hero-overlay': heroOverlay,
  } as CSSProperties
  const sectionOrder = config.sectionOrder ?? DEFAULT_SECTION_ORDER

  // Pick the portrait cut on phones. Resolved before first paint so the iframe
  // renders immediately (no lazy/viewport gating) — fastest possible start.
  const { heroVideo } = config
  const [heroVideoId, setHeroVideoId] = useState<string | null>(() => {
    if (!heroVideo) return null
    if (heroVideo.mobileId && typeof window !== 'undefined' && window.matchMedia(MOBILE_VIDEO_QUERY).matches) {
      return heroVideo.mobileId
    }
    return heroVideo.id
  })
  useEffect(() => {
    const mobileId = heroVideo?.mobileId
    const desktopId = heroVideo?.id
    if (!mobileId || !desktopId) return
    const mq = window.matchMedia(MOBILE_VIDEO_QUERY)
    const apply = () => setHeroVideoId(mq.matches ? mobileId : desktopId)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [heroVideo])

  // Cross-fade the video in once it's actually rendering frames — iframe onLoad
  // plus a short buffer, with a hard fallback so it never stays hidden. Both
  // are short: the still photo is already the visible background (see
  // heroStyle above), so there's nothing dark to sit through either way —
  // this is just picking the moment the video looks ready, not gating the
  // first paint.
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  useEffect(() => {
    if (!heroVideoId) return
    const fallback = window.setTimeout(() => setHeroVideoReady(true), 1800)
    return () => window.clearTimeout(fallback)
  }, [heroVideoId])
  const handleHeroVideoLoad = () => {
    window.setTimeout(() => setHeroVideoReady(true), 120)
  }

  useTrackViewEvent('landing_page_view', {
    page_slug: config.slug,
    service_slug: config.serviceSlug,
    offer_type: config.slug,
  })

  useScrollDepthTracking(config.slug.replace(/-/g, '_'), [25, 50, 75], (threshold) => ({
    page_slug: config.slug,
    service_slug: config.serviceSlug,
    threshold,
  }))

  useEffect(() => {
    if (typeof window.fbq !== 'function' || !hasAnalyticsConsent()) return
    window.fbq('track', 'ViewContent', {
      content_name: config.metaContentName,
      content_category: 'photography_service',
      content_type: 'service',
    })
    window.fbq('trackCustom', config.customPixelEvent, {
      content_name: config.metaContentName,
      content_category: config.serviceSlug,
    })
  }, [config.customPixelEvent, config.metaContentName, config.serviceSlug])

  // Sticky mobile CTA: show it only once the hero has scrolled out of view,
  // so a visitor who never scrolls past the hero isn't shown a redundant bar.
  useEffect(() => {
    if (!config.stickyCta) return
    const hero = heroRef.current
    if (!hero || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { rootMargin: '-40px 0px 0px 0px' },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [config.stickyCta])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.alp__nav', '.locale-switcher'],
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 },
      )

      gsap.fromTo(
        '.alp__hero-inner > *',
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.12 },
      )

      gsap.to('.alp__hero', {
        backgroundPosition: 'center 62%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.alp__hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      // NB: the hero content is intentionally NOT faded out on scroll — the
      // primary CTA lives here and must stay reachable as the user scrolls.

      gsap.utils.toArray<HTMLElement>('.alp .section').forEach((section) => {
        const items = gsap.utils.toArray<HTMLElement>(
          '.alp__label, h2, .alp__copy > *, .alp__lede, .alp__usage-intro, .alp__tag-grid span, .alp__asset-card, .alp__proof-item, .alp__proof-prose p, .alp__audience-item, .alp__what-item, .alp__platform-item, .alp__section-cta, .alp__final-inner > *',
          section,
        )

        // One-shot reveal (no scrub): content animates in once when the section
        // is reached and then stays put. `immediateRender: false` leaves the
        // natural (visible) state in place if ScrollTrigger never fires — e.g.
        // an in-app WebView that stalls JS — so nothing can get stuck hidden.
        if (items.length) {
          gsap.from(items, {
            opacity: 0,
            y: 28,
            filter: 'blur(6px)',
            stagger: 0.06,
            ease: 'power2.out',
            duration: 0.7,
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          })
        }

        const media = section.querySelector<HTMLElement>('.alp__image')
        if (media) {
          gsap.from(media, {
            opacity: 0,
            y: 28,
            scale: 0.97,
            filter: 'blur(7px)',
            ease: 'power2.out',
            duration: 0.8,
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          })

          gsap.to(media, {
            y: -52,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
        { id: 'services', label: t('nav.services'), href: '/#cases' },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  const trackCta = (location: string, packageSlug?: string) => {
    setTimeout(() => trackEvent('landing_page_cta_click', {
      page_slug: config.slug,
      service_slug: config.serviceSlug,
      cta_location: location,
      package_slug: packageSlug,
    }), 0)

    if (hasAnalyticsConsent()) {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'LandingPageCtaClick', {
          content_name: config.metaContentName,
          content_category: config.serviceSlug,
          page_slug: config.slug,
          cta_location: location,
          package_slug: packageSlug,
        })
      }

      if (typeof window.clarity === 'function') {
        window.clarity('event', `landing_page_cta_click_${config.slug}_${location}`)
      }
    }
  }

  // Primary CTAs: when the page has an inline lead form they scroll to it and
  // keep the visitor on-page; otherwise they navigate to /contact as before.
  const scrollToLeadForm = (event: React.MouseEvent, location: string) => {
    trackCta(location)
    if (!config.leadForm) return
    event.preventDefault()
    const target = document.getElementById('quick-book')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => document.getElementById('quick-book-name')?.focus({ preventScroll: true }), 500)
  }

  const renderPrimaryCta = (
    className: string,
    location: string,
    label: string,
    opts?: { tabIndex?: number },
  ) =>
    config.leadForm ? (
      <a className={className} href="#quick-book" onClick={(e) => scrollToLeadForm(e, location)} tabIndex={opts?.tabIndex}>
        {label}
      </a>
    ) : (
      <LocalizedLink className={className} to={contactPath} onClick={() => trackCta(location)} tabIndex={opts?.tabIndex}>
        {label}
      </LocalizedLink>
    )

  const middleSections: Record<SectionKey, ReactNode> = {
    audience: (
      <section className="section alp__audience" key="audience">
        <div className="content alp__split">
          <div>
            <p className="alp__label">{config.audienceLabel}</p>
            <h2>{config.audienceHeading}</h2>
            {config.audienceBody?.length ? (
              <div className="alp__audience-body">
                {config.audienceBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            ) : null}
          </div>
          <div className="alp__copy">
            {config.audienceItems ? (
              <div className="alp__audience-items">
                {config.audienceItems.map(({ title, body }) => (
                  <div className="alp__audience-item" key={title}>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            ) : (
              config.audienceGroups.map((group) => (
                <div className="alp__tag-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="alp__tag-grid" aria-label={group.title}>
                    {group.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    ),
    whatItDoes: config.whatItDoesHeading && config.whatItDoesItems ? (
      <section className="section alp__what" key="whatItDoes">
        <div className="content">
          {config.whatItDoesLabel && <p className="alp__label">{config.whatItDoesLabel}</p>}
          <h2>{config.whatItDoesHeading}</h2>
          <div className="alp__what-grid">
            {config.whatItDoesItems.map(({ title, body }) => (
              <div className="alp__what-item" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    included: (
      <section className="section alp__included" id="included" key="included">
        <div className="content alp__media-split">
          <div className="alp__image-wrap">
            <div className="alp__image" style={{ backgroundImage: `url(${config.supportImage})` }} />
          </div>
          <div>
            <p className="alp__label">{config.includedLabel}</p>
            <h2>{config.includedHeading}</h2>
            {config.includedLede && <p className="alp__lede">{config.includedLede}</p>}
            <div className="alp__asset-grid">
              {config.includedCards.map(({ title, body, slug }) => {
                const packageSlug = slug ?? title.toLowerCase().replace(/\s+/g, '-')
                return (
                  <LocalizedLink
                    className="alp__asset-card"
                    to={`/contact?service=${config.serviceSlug}&package=${encodeURIComponent(packageSlug)}`}
                    key={title}
                    onClick={() => trackCta('offer_card', packageSlug)}
                  >
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </LocalizedLink>
                )
              })}
            </div>
            {config.includedCta && renderPrimaryCta('alp__section-cta', 'included', config.includedCta)}
          </div>
        </div>
      </section>
    ),
    proof: (config.proofProse?.length || config.proofItems?.length) ? (
      <section className="section alp__proof" key="proof">
        <div className="content">
          {config.proofLabel && <p className="alp__label">{config.proofLabel}</p>}
          {config.proofProse ? (
            <div className="alp__proof-prose">
              {config.proofProse.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          ) : (
            <div className="alp__proof-grid">
              {config.proofItems?.map(({ title, body }) => (
                <div className="alp__proof-item" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    ) : null,
    usage: config.usageHeading && config.platforms ? (
      <section className="section alp__usage" key="usage">
        <div className="content">
          {config.usageLabel && <p className="alp__label">{config.usageLabel}</p>}
          <h2>{config.usageHeading}</h2>
          {config.usageIntro && <p className="alp__usage-intro">{config.usageIntro}</p>}
          <div className="alp__platform-grid">
            {config.platforms.map(({ name, use }, index) => (
              <div className="alp__platform-item" key={name}>
                <div className="alp__platform-icon">{iconLabels[index] ?? 'OK'}</div>
                <h3>{name}</h3>
                <p>{use}</p>
              </div>
            ))}
          </div>
          {config.usageCta && renderPrimaryCta('alp__section-cta', 'usage', config.usageCta)}
        </div>
      </section>
    ) : null,
  }

  return (
    <main className={`alp alp--${config.slug}`} id="main" ref={rootRef}>
      <SEOMeta
        title={config.title}
        description={config.description}
        ogTitle={config.ogTitle ?? config.title}
        ogDescription={config.ogDescription ?? config.description}
        ogImage={config.ogImage}
        canonical={config.canonical}
        lang={locale}
      />

      <div className="home__nav alp__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="alp__hero" ref={heroRef} style={heroStyle}>
        {heroVideoId && (
          <div
            className="alp__hero-media"
            data-ready={heroVideoReady ? 'true' : undefined}
            aria-hidden="true"
          >
            <iframe
              src={buildHeroVideoSrc({ id: heroVideoId, hash: heroVideo?.hash, startAt: heroVideo?.startAt })}
              title=""
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              tabIndex={-1}
              onLoad={handleHeroVideoLoad}
            />
          </div>
        )}
        <div className="content alp__hero-inner">
          {config.heroKicker && <p className="alp__hero-kicker">{config.heroKicker}</p>}
          {config.h1 ? <h1>{config.h1}</h1> : <h1>{config.h1Line1}<br />{config.h1Line2}</h1>}
          <p className="alp__subheadline">{config.subheadline}</p>
          <div className={`alp__actions${config.ctaSecondary ? '' : ' alp__actions--single'}`}>
            {renderPrimaryCta('alp__button alp__button--primary', 'hero_primary', config.cta)}
            {config.ctaSecondary && (
              <a className="alp__button" href="#included" onClick={() => trackCta('hero_secondary')}>
                {config.ctaSecondary}
              </a>
            )}
          </div>
        </div>
      </section>

      {config.leadForm && (
        <AdLeadForm
          slug={config.slug}
          serviceSlug={config.serviceSlug}
          packageSlug={config.ctaPackage}
          copy={config.leadForm}
        />
      )}

      {sectionOrder.map((key) => middleSections[key])}

      <section className="section alp__final">
        <div className="content alp__final-inner">
          <h2>{config.finalHeading}</h2>
          {config.finalBody.split('\n\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          {config.pricingNote && <p className="alp__pricing-note">{config.pricingNote}</p>}
          {renderPrimaryCta('alp__button alp__button--primary', 'final', config.finalCta)}
        </div>
      </section>

      {config.stickyCta && (
        <div className="alp__sticky-cta" data-visible={stickyVisible ? 'true' : undefined} aria-hidden={stickyVisible ? undefined : 'true'}>
          {config.stickyCtaNote && <span className="alp__sticky-cta-note">{config.stickyCtaNote}</span>}
          {renderPrimaryCta('alp__button alp__button--primary', 'sticky', config.stickyCta, {
            tabIndex: stickyVisible ? undefined : -1,
          })}
        </div>
      )}

      <Footer />
    </main>
  )
}
