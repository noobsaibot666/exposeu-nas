import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocale, useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import './AdLandingPage.css'

type Platform = {
  name: string
  use: string
}

export type AdLandingPageConfig = {
  slug: string
  serviceSlug: string
  title: string
  description: string
  canonical: string
  ogImage?: string
  heroImage: string
  supportImage: string
  h1Line1: string
  h1Line2: string
  subheadline: string
  cta: string
  ctaSecondary: string
  audienceLabel: string
  audienceHeading: string
  audienceGroups: Array<{ title: string; items: string[] }>
  includedLabel: string
  includedHeading: string
  includedLede: string
  includedCards: Array<{ title: string; body: string; slug?: string }>
  includedCta: string
  usageLabel: string
  usageHeading: string
  usageIntro: string
  platforms: Platform[]
  usageCta: string
  finalHeading: string
  finalBody: string
  finalCta: string
  metaContentName: string
  customPixelEvent: string
}

const iconLabels = ['IG', 'TT', 'SP', 'YT', 'PR', 'AD']

export default function AdLandingPage({ config }: { config: AdLandingPageConfig }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const navigate = useLocaleNavigate()
  const localizePath = useLocalePath()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const contactHref = localizePath(`/contact?service=${config.serviceSlug}`)

  useTrackViewEvent('landing_page_view', {
    page_slug: config.slug,
    service_slug: config.serviceSlug,
    offer_type: config.slug,
  })

  useScrollDepthTracking(config.slug.replace(/-/g, '_'), [50, 75], (threshold) => ({
    page_slug: config.slug,
    service_slug: config.serviceSlug,
    threshold,
  }))

  useEffect(() => {
    if (typeof window.fbq !== 'function') return
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
        { opacity: 0, y: 36, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.18 },
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

      gsap.to('.alp__hero-inner', {
        opacity: 0,
        y: -40,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
          trigger: '.alp__hero',
          start: 'center top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      gsap.utils.toArray<HTMLElement>('.alp .section').forEach((section) => {
        const items = gsap.utils.toArray<HTMLElement>(
          '.alp__label, h2, .alp__copy > *, .alp__lede, .alp__usage-intro, .alp__tag-grid span, .alp__asset-card, .alp__platform-item, .alp__section-cta, .alp__final-inner > *',
          section,
        )

        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 30, filter: 'blur(7px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              stagger: 0.07,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 92%',
                end: 'top 52%',
                scrub: 0.5,
              },
            },
          )
        }

        const media = section.querySelector<HTMLElement>('.alp__image')
        if (media) {
          gsap.fromTo(
            media,
            { opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 45%',
                scrub: 0.5,
              },
            },
          )

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
  }

  return (
    <main className="alp" id="main" ref={rootRef}>
      <SEOMeta
        title={config.title}
        description={config.description}
        ogTitle={config.title}
        ogDescription={config.description}
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

      <section className="alp__hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.88), rgba(5, 7, 11, 0.5)), url(${config.heroImage})` }}>
        <div className="content alp__hero-inner">
          <h1>{config.h1Line1}<br />{config.h1Line2}</h1>
          <p className="alp__subheadline">{config.subheadline}</p>
          <div className="alp__actions">
            <a className="alp__button alp__button--primary" href={contactHref} onClick={() => trackCta('hero_primary')}>
              {config.cta}
            </a>
            <a className="alp__button" href="#included" onClick={() => trackCta('hero_secondary')}>
              {config.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section className="section alp__audience">
        <div className="content alp__split">
          <div>
            <p className="alp__label">{config.audienceLabel}</p>
            <h2>{config.audienceHeading}</h2>
          </div>
          <div className="alp__copy">
            {config.audienceGroups.map((group) => (
              <div className="alp__tag-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="alp__tag-grid" aria-label={group.title}>
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alp__included" id="included">
        <div className="content alp__media-split">
          <div className="alp__image-wrap">
            <div className="alp__image" style={{ backgroundImage: `url(${config.supportImage})` }} />
          </div>
          <div>
            <p className="alp__label">{config.includedLabel}</p>
            <h2>{config.includedHeading}</h2>
            <p className="alp__lede">{config.includedLede}</p>
            <div className="alp__asset-grid">
              {config.includedCards.map(({ title, body, slug }) => {
                const packageSlug = slug ?? title.toLowerCase().replace(/\s+/g, '-')
                return (
                  <a
                    className="alp__asset-card"
                    href={localizePath(`/contact?service=${config.serviceSlug}&package=${encodeURIComponent(packageSlug)}`)}
                    key={title}
                    onClick={() => trackCta('offer_card', packageSlug)}
                  >
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </a>
                )
              })}
            </div>
            <a className="alp__section-cta" href={contactHref} onClick={() => trackCta('included')}>
              {config.includedCta}
            </a>
          </div>
        </div>
      </section>

      <section className="section alp__usage">
        <div className="content">
          <p className="alp__label">{config.usageLabel}</p>
          <h2>{config.usageHeading}</h2>
          <p className="alp__usage-intro">{config.usageIntro}</p>
          <div className="alp__platform-grid">
            {config.platforms.map(({ name, use }, index) => (
              <div className="alp__platform-item" key={name}>
                <div className="alp__platform-icon">{iconLabels[index] ?? 'OK'}</div>
                <h3>{name}</h3>
                <p>{use}</p>
              </div>
            ))}
          </div>
          <a className="alp__section-cta" href={contactHref} onClick={() => trackCta('usage')}>
            {config.usageCta}
          </a>
        </div>
      </section>

      <section className="section alp__final">
        <div className="content alp__final-inner">
          <h2>{config.finalHeading}</h2>
          <p>{config.finalBody}</p>
          <a className="alp__button alp__button--primary" href={contactHref} onClick={() => trackCta('final')}>
            {config.finalCta}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
