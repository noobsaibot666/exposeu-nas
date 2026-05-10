import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import PricingSection from '../sections/PricingSection'
import TestimonialsStrip from '../components/TestimonialsStrip'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import './WorkPage.css'
import { useTranslation } from '../i18n/LocaleProvider'
import { useLocalePath } from '../i18n/LocaleProvider'

export type WorkCard = {
  image?: string
  title: string
  subtitle?: string
}

type WorkPageLayoutProps = {
  title: string
  heroCopy: string
  detail?: string
  socialProof?: string
  cards: WorkCard[]
  galleryTitle: string
  galleryCopy: string
  gallery: WorkCard[]
  ctaText: string
  ctaHref: string
  serviceSlug?: string
  ctaDetail?: string
  ctaLabel?: string
  extraGalleryTitle?: string
  extraGalleryCopy?: string
  extraGallery?: WorkCard[]
}

function WorkPageLayout({
  title,
  heroCopy,
  detail,
  socialProof,
  cards,
  galleryTitle,
  galleryCopy,
  gallery,
  ctaText,
  ctaHref,
  serviceSlug,
  ctaDetail,
  ctaLabel,
  extraGalleryTitle,
  extraGalleryCopy,
  extraGallery,
}: WorkPageLayoutProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const stackRef = useRef<HTMLDivElement | null>(null)
  const { t, tm } = useTranslation()
  const processSteps = tm<Array<{ title: string; body: string }>>('services.shared.process')
  const localizePath = useLocalePath()

  useTrackViewEvent('service_view', {
    service_slug: serviceSlug,
    service_label: title,
  })

  useScrollDepthTracking('service', [50, 75], () => ({
    service_slug: serviceSlug,
    service_label: title,
  }))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Hero copy — plays immediately on mount (top of page)
      const heroItems = gsap.utils.toArray<HTMLElement>('.work-hero__copy > *')
      gsap.fromTo(
        heroItems,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.1, ease: 'sine.inOut' },
      )

      // Hero card stack — cascade up from below, one by one
      const heroCards = gsap.utils.toArray<HTMLElement>('.work-hero__card')
      gsap.fromTo(
        heroCards,
        { opacity: 0, y: 64, scale: 0.93, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.12,
          duration: 0.8,
          ease: 'sine.inOut',
          force3D: true,
          scrollTrigger: {
            trigger: stackRef.current,
            start: 'top 82%',
          },
        },
      )

      // Gallery sections
      const gallerySections = gsap.utils.toArray<HTMLElement>('.work-gallery')
      gallerySections.forEach((section) => {
        const sequenceItems = section.querySelectorAll<HTMLElement>('.work-gallery__sequence-item')
        const media = section.querySelector<HTMLElement>('.work-gallery__image')
        const split = section.querySelector<HTMLElement>('.work-gallery__split')
        const textItems = section.querySelectorAll<HTMLElement>('.work-gallery__text > *')

        gsap.fromTo(
          sequenceItems,
          { opacity: 0, y: 24, filter: 'blur(3px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.09,
            ease: 'sine.inOut',
            scrollTrigger: { trigger: section, start: 'top 78%' },
          },
        )

        if (split) {
          gsap.fromTo(
            split,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'sine.inOut',
              scrollTrigger: { trigger: section, start: 'top 82%' },
            },
          )
        }

        if (textItems.length) {
          gsap.fromTo(
            textItems,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'sine.inOut',
              scrollTrigger: { trigger: section, start: 'top 80%' },
            },
          )
        }

        if (media) {
          gsap.fromTo(
            media,
            { opacity: 0, scale: 1.03, y: 12 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.75,
              ease: 'sine.inOut',
              force3D: true,
              scrollTrigger: { trigger: section, start: 'top 78%' },
            },
          )

          gsap.to(media, {
            y: -60,
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

      // Process section
      gsap.fromTo(
        '.work-process__header > *',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: '.work-process', start: 'top 82%' },
        },
      )
      gsap.fromTo(
        '.work-process__step',
        { opacity: 0, y: 28, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.1,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: '.work-process', start: 'top 76%' },
        },
      )

      // CTA section
      gsap.fromTo(
        '.work-cta__content > *',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: '.work-cta', start: 'top 82%' },
        },
      )

      // Subtle hover lift on hero cards (desktop only)
      const listeners: Array<() => void> = []
      const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
      if (hoverMedia.matches) {
        heroCards.forEach((card) => {
          const base = Number(card.dataset.scale) || 1
          const enter = () => gsap.to(card, { y: -6, scale: base * 1.025, duration: 0.35, ease: 'sine.out' })
          const leave = () => gsap.to(card, { y: 0, scale: base, duration: 0.45, ease: 'sine.inOut' })
          card.addEventListener('mouseenter', enter)
          card.addEventListener('mouseleave', leave)
          listeners.push(() => {
            card.removeEventListener('mouseenter', enter)
            card.removeEventListener('mouseleave', leave)
          })
        })
      }

      return () => listeners.forEach((off) => off())
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const sectionImages = [
    cards[0]?.image,
    cards[1]?.image ?? cards[0]?.image,
  ]

  const finalCtaHref = serviceSlug ? `/contact?service=${serviceSlug}` : ctaHref

  const renderSection = (
    label: string,
    heading: string,
    copy: string,
    items: WorkCard[],
    image?: string,
    key?: string,
  ) => (
    <section className="section work-gallery" key={key}>
      <div className="content work-gallery__split">
        <div className="work-gallery__text">
          <div className="work-gallery__header">
            <div className="work-gallery__label">{label}</div>
            <div>
              <h2>{heading}</h2>
              <p>{copy}</p>
            </div>
          </div>
          <ol className="work-gallery__sequence">
            {items.map((item, index) => (
              <li className="work-gallery__sequence-item" key={`${item.title}-${index}`}>
                <span className="work-gallery__sequence-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="work-gallery__sequence-title">{item.title}</h3>
                  {item.subtitle && <p className="work-gallery__sequence-copy">{item.subtitle}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="work-gallery__media">
          <div className="work-gallery__image" style={image ? { backgroundImage: `url(${image})` } : undefined} />
        </div>
      </div>
    </section>
  )

  return (
    <main className="work-page" ref={rootRef} id="main">
      <div className="home__nav work-nav">
        <TopNav
          leftLinks={[
            { id: 'home', label: t('nav.home'), href: '/' },
            { id: 'services', label: t('nav.services'), href: '/#cases' },
          ]}
          rightLinks={[
            { id: 'about', label: t('nav.about'), href: '/about' },
            { id: 'contact', label: t('nav.contact'), href: '/contact' },
          ]}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="section work-hero">
        <div className="content work-hero__grid">
          <div className="work-hero__copy">
            <p className="work-hero__eyebrow">{title}</p>
            <h1>{heroCopy}</h1>
            {detail && <p className="work-hero__detail">{detail}</p>}
            {socialProof && <p className="work-hero__social-proof">{socialProof}</p>}
          </div>
          <div className="work-hero__stack-shell">
            <p className="work-hero__label">{t('services.shared.projects')}</p>
            <div className="work-hero__stack" ref={stackRef}>
              {cards.map((card, index) => {
                const scales = [0.98, 1.08, 1.2, 1.32]
                const widths = [240, 280, 320, 360]
                const translateY = [12, 6, 0, -6]
                const scale = scales[index] ?? scales[scales.length - 1]
                const width = widths[index] ?? widths[widths.length - 1]
                const ty = translateY[index] ?? translateY[translateY.length - 1]
                return (
                  <div
                    key={card.title}
                    className="work-hero__card"
                    data-scale={scale}
                    style={
                      {
                        '--card-scale': scale,
                        '--card-overlap': index === 0 ? '0px' : '-20px',
                        '--card-width': `${width}px`,
                        '--card-translate': `${ty}px`,
                        '--card-z': 10 + index,
                      } as CSSProperties
                    }
                  >
                    <div className="work-hero__card-media" style={{ backgroundImage: `url(${card.image})` }} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {renderSection(
        t('services.shared.whatYouGet'),
        galleryTitle,
        galleryCopy,
        gallery,
        sectionImages[0],
          'gallery-primary',
      )}

      {extraGallery && extraGallery.length > 0 &&
        renderSection(
          t('services.shared.idealFor'),
          extraGalleryTitle ?? '',
          extraGalleryCopy ?? '',
          extraGallery,
          sectionImages[1],
          'gallery-secondary',
        )}

      <section className="section work-process">
        <div className="content">
          <div className="work-process__header">
            <div className="work-gallery__label">{t('services.shared.howItWorks')}</div>
            <h2 className="work-process__heading">{t('services.shared.howItWorksHeading')}</h2>
          </div>
          <ol className="work-process__steps">
            {processSteps.map((step, i) => (
              <li className="work-process__step" key={step.title}>
                <span className="work-process__step-number">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="work-process__step-title">{step.title}</h3>
                <p className="work-process__step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PricingSection
        headline={t('services.shared.pricingFor', { service: title.toLowerCase() })}
        serviceSlug={serviceSlug}
      />

      {serviceSlug && <TestimonialsStrip service={serviceSlug} />}

      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">{t('services.shared.readyToCollaborate')}</p>
            <h2>{ctaText}</h2>
            {ctaDetail ? <p>{ctaDetail}</p> : null}
          </div>
          <a
            className="work-cta__link"
            href={localizePath(finalCtaHref)}
            onClick={() =>
              trackEvent('service_cta_click', {
                service_slug: serviceSlug,
                service_label: title,
                cta_label: ctaLabel ?? t('services.shared.requestAvailability'),
                cta_location: 'service_footer',
              })}
          >
            {ctaLabel ?? t('services.shared.requestAvailability')}
          </a>
        </div>
      </section>
    </main>
  )
}

export default WorkPageLayout
