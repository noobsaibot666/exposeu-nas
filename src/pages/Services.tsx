import { useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './Home.css'
import './HomeV2.css'
import styles from './HomeRedesign.module.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { serviceMeta } from '../data/serviceMeta'
import { resolveImagePath } from '../utils/resolveImagePath'
import { trackEvent } from '../utils/analytics'

const documentationTypeVisuals = [
  {
    slug: serviceMeta['exhibition-gallery'].slug,
    image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.webp'),
    link: serviceMeta['exhibition-gallery'].href,
  },
  {
    slug: serviceMeta['brand-agency'].slug,
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/hero-thumbs/brand-agency/033.webp'),
    link: serviceMeta['brand-agency'].href,
  },
  {
    slug: serviceMeta['concerts-events'].slug,
    image: resolveImagePath('/src/assets/images/website/artists/002.webp'),
    link: serviceMeta['concerts-events'].href,
  },
  {
    slug: serviceMeta['artist-sessions'].slug,
    image: resolveImagePath('/src/assets/images/website/_incoming/homepage/services/artist-sessions/0015.webp'),
    link: serviceMeta['artist-sessions'].href,
  },
]

function Services() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const cardMotion = [
        { y: 52, x: -16, rotate: -2.5 },
        { y: 52, x: 16, rotate: 2.5 },
        { y: 64, x: -10, rotate: -1.8 },
        { y: 64, x: 10, rotate: 1.8 },
      ]

      const headerItems = gsap.utils.toArray<HTMLElement>('.home__section-header > *')
      const sectionCards = gsap.utils.toArray<HTMLElement>('.home__case-card')

      gsap.fromTo(
        headerItems,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'sine.out' },
      )

      const tl = gsap.timeline({ delay: 0.1 })
      sectionCards.forEach((card, i) => {
        const { y, x, rotate } = cardMotion[i % cardMotion.length]
        tl.fromTo(
          card,
          { opacity: 0, y, x, scale: 0.94, rotate, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'sine.out',
          },
          i * 0.08,
        )
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
        { id: 'services', label: t('nav.services'), onClick: () => navigate('/services') },
        { id: 'portfolio', label: t('nav.lastProjects'), onClick: () => navigate('/portfolio') },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  const documentationTypes = useMemo(
    () =>
      documentationTypeVisuals.map((project) => ({
        ...project,
        title: t(`home.services.cards.${project.slug}.title`),
        subtext: t(`home.services.cards.${project.slug}.subtext`),
        cta: t(`home.services.cards.${project.slug}.cta`),
      })),
    [t],
  )

  return (
    <main className="home" id="main" ref={rootRef}>
      <SEOMeta
        title={t('common.meta.servicesIndex.title')}
        description={t('common.meta.servicesIndex.description')}
        ogTitle={t('common.meta.servicesIndex.title')}
        ogDescription={t('common.meta.servicesIndex.description')}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services' : 'https://expose-u.com/services'}
        lang={locale}
      />
      <div className="home__background" aria-hidden="true" />
      <div className="home__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="home__section home__cases" id="cases">
        <div className="home__section-header">
          <p>{t('home.services.label')}</p>
          <h1>{t('home.services.headline')}</h1>
        </div>
        <div className="home__cases-grid">
          <div className="home__cases-row">
            {documentationTypes.map((project, index) => (
              <LocalizedLink
                key={project.title}
                to={project.link}
                className="home__case-card"
                onClick={() => {
                  trackEvent('services_page_card_click', {
                    service_slug: project.slug,
                    card_position: index + 1,
                  })
                }}
              >
                <div className={`home__case-media${project.slug === serviceMeta['artist-sessions'].slug ? ' home__case-media--portrait' : ''}`}>
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="home__case-meta">
                  <h3>{project.title}</h3>
                  <p className={`home__case-copy ${styles.homeRedesign__cardCopy}`}>{project.subtext}</p>
                  <span className="home__case-cta">{project.cta}</span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Services
