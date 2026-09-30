import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import PricingSection from '../sections/PricingSection'
import TestimonialsStrip from '../components/TestimonialsStrip'
import FAQSection from '../components/FAQSection'
import Footer from '../sections/Footer'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import './WorkPage.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'

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
  heroImage: string
  heroImageAlt?: string
  galleryTitle: string
  galleryCopy: string
  gallery: WorkCard[]
  galleryImage?: string
  ctaText: string
  ctaHref: string
  serviceSlug?: string
  ctaDetail?: string
  ctaLabel?: string
  extraGalleryTitle?: string
  extraGalleryCopy?: string
  extraGallery?: WorkCard[]
  extraGalleryImage?: string
  editorialPricingTitle?: string
  editorialPricingBody?: string
  editorialPricingCta?: string
  editorialPricingCtaHref?: string
}

const renderSentenceBreaks = (text: string) =>
  text.split(/(?<=\.)\s+/).map((part, index, parts) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <br /> : null}
    </span>
  ))

function WorkPageLayout({
  title,
  heroCopy,
  detail,
  socialProof,
  heroImage,
  heroImageAlt,
  galleryTitle,
  galleryCopy,
  gallery,
  galleryImage,
  ctaText,
  ctaHref,
  serviceSlug,
  ctaDetail,
  ctaLabel,
  extraGalleryTitle,
  extraGalleryCopy,
  extraGallery,
  extraGalleryImage,
  editorialPricingTitle,
  editorialPricingBody,
  editorialPricingCta,
  editorialPricingCtaHref,
}: WorkPageLayoutProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const { t, tm } = useTranslation()
  const processSteps = tm<Array<{ title: string; body: string }>>('services.shared.process')
  const navigate = useLocaleNavigate()

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

      // Hero banner — settles in from a slight zoom once its bytes have
      // arrived (same load gate as the gallery media below).
      const banner = rootRef.current?.querySelector<HTMLImageElement>('.work-hero-banner__image')
      if (banner) {
        const revealBanner = () => {
          gsap.fromTo(
            banner,
            { opacity: 0, scale: 1.05, filter: 'blur(8px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out', force3D: true },
          )
        }
        if (banner.complete) {
          revealBanner()
        } else {
          banner.addEventListener('load', revealBanner, { once: true })
        }
      }

      // Gallery sections
      const gallerySections = gsap.utils.toArray<HTMLElement>('.work-gallery')
      gallerySections.forEach((section) => {
        const header = section.querySelector<HTMLElement>('.work-gallery__header')
        const sequenceItems = section.querySelectorAll<HTMLElement>('.work-gallery__sequence-item')
        const media = section.querySelector<HTMLImageElement>('.work-gallery__image')

        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'sine.inOut',
              scrollTrigger: { trigger: section, start: 'top 80%' },
            },
          )
        }

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

        if (media && media.offsetParent !== null) {
          const revealMedia = () => {
            gsap.fromTo(
              media,
              { opacity: 0, scale: 1.04, y: 16, filter: 'blur(10px)' },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power2.out',
                force3D: true,
                scrollTrigger: { trigger: section, start: 'top 74%' },
              },
            )
          }

          // Gate the reveal on the image actually being loaded — otherwise the
          // scroll-triggered animation can finish before the bytes arrive,
          // showing an empty frame that then pops in late once loaded.
          if (media.complete) {
            revealMedia()
          } else {
            media.addEventListener('load', revealMedia, { once: true })
          }
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
    }, rootRef)

    return () => ctx.revert()
  }, [])

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
          {image && (
            <img className="work-gallery__image" src={image} alt={heading} loading="eager" decoding="async" />
          )}
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
          onBrandClick={() => navigate('/')}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="section work-hero">
        <div className="content work-hero__grid">
          <figure className="work-hero-banner">
            <img
              className="work-hero-banner__image"
              src={heroImage}
              alt={heroImageAlt ?? title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
          <div className="work-hero__copy">
            <p className="work-hero__eyebrow">{title}</p>
            <h1>{renderSentenceBreaks(heroCopy)}</h1>
            {detail && <p className="work-hero__detail">{detail}</p>}
            {socialProof && <p className="work-hero__social-proof">{socialProof}</p>}
            <LocalizedLink
              className="work-hero__cta"
              to={finalCtaHref}
              onClick={() =>
                setTimeout(() => trackEvent('service_cta_click', {
                  service_slug: serviceSlug,
                  service_label: title,
                  cta_label: ctaLabel ?? t('services.shared.requestAvailability'),
                  cta_location: 'service_hero',
                }), 0)
              }
            >
              {ctaLabel ?? t('services.shared.requestAvailability')}
            </LocalizedLink>
          </div>
        </div>
      </section>

      {renderSection(
        t('services.shared.whatYouGet'),
        galleryTitle,
        galleryCopy,
        gallery,
        galleryImage,
        'gallery-primary',
      )}

      {extraGallery && extraGallery.length > 0 &&
        renderSection(
          t('services.shared.idealFor'),
          extraGalleryTitle ?? '',
          extraGalleryCopy ?? '',
          extraGallery,
          extraGalleryImage,
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

      {editorialPricingBody ? (
        <section className="section work-editorial-pricing">
          <div className="content">
            <div className="work-editorial-pricing__inner">
              {editorialPricingTitle && (
                <h2 className="work-editorial-pricing__title">{editorialPricingTitle}</h2>
              )}
              {editorialPricingBody.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="work-editorial-pricing__body">{para}</p>
              ))}
              {editorialPricingCta && (
                <LocalizedLink
                  to={editorialPricingCtaHref ?? finalCtaHref}
                  className="work-editorial-pricing__cta"
                  onClick={() =>
                    setTimeout(() => trackEvent('service_cta_click', {
                      service_slug: serviceSlug,
                      service_label: title,
                      cta_label: editorialPricingCta,
                      cta_location: 'pricing_section',
                    }), 0)
                  }
                >
                  {editorialPricingCta} →
                </LocalizedLink>
              )}
            </div>
          </div>
        </section>
      ) : (
        <PricingSection
          headline={t('services.shared.pricingFor', { service: title.toLowerCase() })}
          serviceSlug={serviceSlug}
        />
      )}

      {serviceSlug && <TestimonialsStrip service={serviceSlug} />}

      {serviceSlug && <FAQSection service={serviceSlug} />}

      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">{t('services.shared.readyToCollaborate')}</p>
            <h2>{ctaText}</h2>
            {ctaDetail ? <p>{ctaDetail}</p> : null}
          </div>
          <LocalizedLink
            className="work-cta__link"
            to={finalCtaHref}
            onClick={() =>
              setTimeout(() => trackEvent('service_cta_click', {
                service_slug: serviceSlug,
                service_label: title,
                cta_label: ctaLabel ?? t('services.shared.requestAvailability'),
                cta_location: 'service_footer',
              }), 0)}
          >
            {ctaLabel ?? t('services.shared.requestAvailability')}
          </LocalizedLink>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default WorkPageLayout
