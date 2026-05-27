import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './ReleaseContentKit.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocale, useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import { resolveImagePath } from '../utils/resolveImagePath'

const SERVICE_SLUG = 'release-content-kit'

const heroImage = resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/021.jpeg')
const studioImage = resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/023.jpeg')

const PLATFORM_ICONS = [IconInstagram, IconTikTok, IconSpotify, IconYouTube, IconPress, IconPoster]

const testimonials = [
  {
    name: 'Sallisa Rosa',
    handle: '@sallisarosa',
    url: 'https://www.instagram.com/sallisarosa/',
    avatar: 'https://scontent-ber1-1.cdninstagram.com/v/t51.82787-15/652796295_18089769638330939_1907733073130546045_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_cat=102&ig_cache_key=Mjk1NzA5Mjk2OTA2MTk2OTA3Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=J31ZZVy2tF8Q7kNvwGa85Q5&_nc_oc=AdoMkIcXURPjFSNhfmR2g-aKuZ4sA7z6Inmov1Sh26Qf_9UXbL9CCusAlPzbAQAJbBY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=TuvwhXNO_PzB-9ASmcNU0Q&_nc_ss=7a22e&oh=00_Af6xQoYbjSHxfkgqTxr_44QmN-uDm-L1uByY2O3xHyW31Q&oe=6A1CF28A',
    quote: 'It\'s great to work with people who genuinely understand your message and what you want to express.',
  },
  {
    name: 'luarr.wav',
    handle: '@luarr.wav',
    url: 'https://www.instagram.com/luarr.wav/',
    avatar: 'https://scontent-ber1-1.cdninstagram.com/v/t51.82787-15/567976927_18534094309065172_7684482206608417902_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_cat=103&ig_cache_key=Mzc0NzcwOTkzMDE3OTI3MDYyMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTM2NS5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Lw3OoXeW7FwQ7kNvwGTIpvq&_nc_oc=Ado5ZP-FAjG2794LvLhi-S34qIDlPN2oxOVbgJv4IXFr-QmkLvJg6K1QXV5bHKPg_As&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-ber1-1.cdninstagram.com&_nc_gid=UMptYs2M7Ef2aT92Z9xvug&_nc_ss=7a22e&oh=00_Af7xyWMy0aRnLD8gNh4hDRhH-Imy4CU_wOylMToexRdCQw&oe=6A1CF5C4',
    quote: '4 shows, one weekend. Easy does it!',
  },
]

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
    </svg>
  )
}

function IconSpotify() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function IconPress() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function IconPoster() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

export default function ReleaseContentKit() {
  const rootRef = useRef<HTMLElement | null>(null)
  const navigate = useLocaleNavigate()
  const localizePath = useLocalePath()
  const { locale } = useLocale()
  const { t, tm } = useTranslation()

  const artistTypes = tm<string[]>('services.pages.release-content-kit.audience.artistTypes')
  const releaseTypes = tm<string[]>('services.pages.release-content-kit.audience.releaseTypes')
  const cards = tm<Array<{ title: string; body: string }>>('services.pages.release-content-kit.included.cards')
  const platforms = tm<Array<{ name: string; use: string }>>('services.pages.release-content-kit.usage.platforms').map((p, i) => ({ ...p, Icon: PLATFORM_ICONS[i] }))

  useTrackViewEvent('landing_page_view', {
    page_slug: SERVICE_SLUG,
    service_slug: SERVICE_SLUG,
    offer_type: 'release_content_kit',
  })

  useScrollDepthTracking('release_content_kit', [50, 75], (threshold) => ({
    page_slug: SERVICE_SLUG,
    service_slug: SERVICE_SLUG,
    threshold,
  }))

  useEffect(() => {
    if (typeof window.fbq !== 'function') return
    window.fbq('trackCustom', 'ReleaseContentKitView', {
      content_name: 'Release Content Kit',
      content_category: SERVICE_SLUG,
    })
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.rck__nav', '.locale-switcher'],
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'sine.out', delay: 0.12 },
      )

      gsap.fromTo(
        '.rck__hero-inner > *',
        { opacity: 0, y: 26, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.09, ease: 'sine.out' },
      )

      gsap.to('.rck__hero', {
        backgroundPosition: 'center 58%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.rck__hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      gsap.utils.toArray<HTMLElement>('.rck .section').forEach((section) => {
        const items = gsap.utils.toArray<HTMLElement>(
          '.rck__label, h2, .rck__copy > *, .rck__lede, .rck__usage-intro, .rck__tag-grid span, .rck__asset-card, .rck__platform-item, .rck__testimonial-card, .rck__section-cta, .rck__final-inner > *',
          section,
        )

        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 22, filter: 'blur(4px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              stagger: 0.055,
              ease: 'sine.inOut',
              scrollTrigger: {
                trigger: section,
                start: 'top 86%',
                end: 'top 58%',
                scrub: 0.65,
              },
            },
          )
        }

        const media = section.querySelector<HTMLElement>('.rck__image')
        if (media) {
          gsap.fromTo(
            media,
            { opacity: 0, y: 26, scale: 0.985, filter: 'blur(5px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.85,
              ease: 'sine.out',
              scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' },
            },
          )

          gsap.to(media, {
            y: -42,
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

  const contactHref = localizePath(`/contact?service=${SERVICE_SLUG}`)

  const trackCta = (location: string, packageSlug?: string) => {
    setTimeout(() => trackEvent('landing_page_cta_click', {
      page_slug: SERVICE_SLUG,
      service_slug: SERVICE_SLUG,
      cta_location: location,
      package_slug: packageSlug,
    }), 0)
  }

  return (
    <main className="rck" id="main" ref={rootRef}>
      <SEOMeta
        title={t('common.meta.releaseContentKit.title')}
        description={t('common.meta.releaseContentKit.description')}
        ogTitle={t('common.meta.releaseContentKit.title')}
        ogDescription={t('common.meta.releaseContentKit.description')}
        canonical="https://expose-u.com/release-content-kit"
        lang={locale}
      />

      <div className="home__nav rck__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="rck__hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.88), rgba(5, 7, 11, 0.5)), url(${heroImage})` }}>
        <div className="content rck__hero-inner">
          <h1>{t('services.pages.release-content-kit.hero.h1Line1')}<br />{t('services.pages.release-content-kit.hero.h1Line2')}</h1>
          <p className="rck__subheadline">
            {t('services.pages.release-content-kit.hero.subheadline')}
          </p>
          <div className="rck__actions">
            <a className="rck__button rck__button--primary" href={contactHref} onClick={() => trackCta('hero_primary')}>
              {t('services.pages.release-content-kit.hero.cta')}
            </a>
            <a className="rck__button" href="#included" onClick={() => trackCta('hero_secondary')}>
              {t('services.pages.release-content-kit.hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      <section className="section rck__audience">
        <div className="content rck__split">
          <div>
            <p className="rck__label">{t('services.pages.release-content-kit.audience.label')}</p>
            <h2>{t('services.pages.release-content-kit.audience.h2')}</h2>
          </div>
          <div className="rck__copy">
            <div className="rck__tag-group">
              <h3>{t('services.pages.release-content-kit.audience.h3Artists')}</h3>
              <div className="rck__tag-grid" aria-label={t('services.pages.release-content-kit.audience.h3Artists')}>
                {artistTypes.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
            <div className="rck__tag-group">
              <h3>{t('services.pages.release-content-kit.audience.h3Releases')}</h3>
              <div className="rck__tag-grid" aria-label={t('services.pages.release-content-kit.audience.h3Releases')}>
                {releaseTypes.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section rck__included" id="included">
        <div className="content rck__media-split">
          <div className="rck__image-wrap">
            <div className="rck__image" style={{ backgroundImage: `url(${studioImage})` }} />
          </div>
          <div>
            <p className="rck__label">{t('services.pages.release-content-kit.included.label')}</p>
            <h2>{t('services.pages.release-content-kit.included.h2')}</h2>
            <p className="rck__lede">{t('services.pages.release-content-kit.included.lede')}</p>
            <div className="rck__asset-grid">
              {cards.map(({ title, body }) => (
                <a
                  className="rck__asset-card"
                  href={localizePath(`/contact?service=${SERVICE_SLUG}&package=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`)}
                  key={title}
                  onClick={() => trackCta('offer_card', title.toLowerCase().replace(/\s+/g, '-'))}
                >
                  <h3>{title}</h3>
                  <p>{body}</p>
                </a>
              ))}
            </div>
            <a className="rck__section-cta" href={contactHref} onClick={() => trackCta('included')}>
              {t('services.pages.release-content-kit.included.cta')}
            </a>
          </div>
        </div>
      </section>

      <section className="section rck__usage">
        <div className="content">
          <p className="rck__label">{t('services.pages.release-content-kit.usage.label')}</p>
          <h2>{t('services.pages.release-content-kit.usage.h2')}</h2>
          <p className="rck__usage-intro">{t('services.pages.release-content-kit.usage.intro')}</p>
          <div className="rck__platform-grid">
            {platforms.map(({ name, use, Icon }) => (
              <div className="rck__platform-item" key={name}>
                <div className="rck__platform-icon"><Icon /></div>
                <h3>{name}</h3>
                <p>{use}</p>
              </div>
            ))}
          </div>
          <a className="rck__section-cta" href={contactHref} onClick={() => trackCta('usage')}>
            {t('services.pages.release-content-kit.usage.cta')}
          </a>
        </div>
      </section>

      <section className="section rck__testimonials">
        <div className="content">
          <p className="rck__label">{t('services.pages.release-content-kit.testimonials.label')}</p>
          <div className="rck__testimonial-grid">
            {testimonials.map((item, i) => (
              <div className="rck__testimonial-card" key={i}>
                {item.avatar
                  ? <img className="rck__testimonial-avatar" src={item.avatar} alt={item.name} width={52} height={52} loading="lazy" referrerPolicy="no-referrer" />
                  : <div className="rck__testimonial-avatar" aria-hidden="true" />
                }
                <blockquote className="rck__testimonial-quote">"{item.quote}"</blockquote>
                <div className="rck__testimonial-meta">
                  <span className="rck__testimonial-name">{item.name}</span>
                  {item.url
                    ? <a className="rck__testimonial-handle" href={item.url} target="_blank" rel="noopener noreferrer">{item.handle}</a>
                    : <span className="rck__testimonial-handle">{item.handle}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section rck__final">
        <div className="content rck__final-inner">
          <h2>{t('services.pages.release-content-kit.final.h2')}</h2>
          <p>{t('services.pages.release-content-kit.final.body')}</p>
          <a className="rck__button rck__button--primary" href={contactHref} onClick={() => trackCta('final')}>
            {t('services.pages.release-content-kit.final.cta')}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
