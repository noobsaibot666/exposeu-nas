import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import './WorkPage.css'

export type WorkCard = {
  image?: string
  title: string
  subtitle?: string
}

type WorkPageLayoutProps = {
  title: string
  heroCopy: string
  detail?: string
  cards: WorkCard[]
  galleryTitle: string
  galleryCopy: string
  gallery: WorkCard[]
  ctaText: string
  ctaHref: string
  extraGalleryTitle?: string
  extraGalleryCopy?: string
  extraGallery?: WorkCard[]
  extraGallerySecondaryTitle?: string
  extraGallerySecondaryCopy?: string
  extraGallerySecondary?: WorkCard[]
}

function WorkPageLayout({
  title,
  heroCopy,
  detail,
  cards,
  galleryTitle,
  galleryCopy,
  gallery,
  ctaText,
  ctaHref,
  extraGalleryTitle,
  extraGalleryCopy,
  extraGallery,
  extraGallerySecondaryTitle,
  extraGallerySecondaryCopy,
  extraGallerySecondary,
}: WorkPageLayoutProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const stackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    window.scrollTo({ top: 0, behavior: 'auto' })

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>('.work-hero__copy > *')
      gsap.from(heroItems, {
        opacity: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
      })

      const cards = gsap.utils.toArray<HTMLElement>('.work-hero__card')

      gsap.from(cards, {
        opacity: 0,
        x: -80,
        scale: 0.94,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: stackRef.current,
          start: 'top 80%',
        },
      })

      const galleryItems = gsap.utils.toArray<HTMLElement>('.work-gallery__item')
      galleryItems.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          delay: index * 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        })
      })

      const listeners: Array<() => void> = []

      cards.forEach((card) => {
        const baseScale = Number(card.dataset.scale) || 1
        const enter = () => {
          gsap.to(card, { scale: baseScale * 1.03, y: '-=4', duration: 0.35, ease: 'power2.out' })
        }
        const leave = () => {
          gsap.to(card, { scale: baseScale, y: `+=4`, duration: 0.4, ease: 'power2.out' })
        }
        card.addEventListener('mouseenter', enter)
        card.addEventListener('mouseleave', leave)
        listeners.push(() => {
          card.removeEventListener('mouseenter', enter)
          card.removeEventListener('mouseleave', leave)
        })
      })

      return () => listeners.forEach((off) => off())
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="work-page" ref={rootRef}>
      <div className="content work-nav">
        <TopNav
          leftLinks={[
            { label: 'Studio', href: '/#hero' },
            { label: 'Cases', href: '/#cases' },
            { label: 'Pricing', href: '/#services' },
          ]}
          rightLinks={[
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ]}
          className="top-nav--page"
        />
      </div>

      <section className="section work-hero">
        <div className="content work-hero__grid">
          <div className="work-hero__copy">
            <p className="work-hero__eyebrow">{title}</p>
            <h1>{heroCopy}</h1>
            {detail && <p className="work-hero__detail">{detail}</p>}
          </div>
          <div className="work-hero__stack-shell">
            <p className="work-hero__label">Projects</p>
            <div className="work-hero__stack" ref={stackRef}>
              {cards.map((card, index) => {
                const scales = [0.98, 1.08, 1.2, 1.32] // tune per card
                const widths = [240, 280, 320, 360] // px widths per card
                const translateY = [12, 6, 0, -6] // px vertical offsets per card
                const overlap = '-20px' // horizontal overlap between cards
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
                        '--card-overlap': index === 0 ? '0px' : overlap,
                        '--card-width': `${width}px`,
                        '--card-translate': `${ty}px`,
                        '--card-z': 10 + index,
                      } as CSSProperties
                    }
                  >
                    <div className="work-hero__card-media" style={{ backgroundImage: `url(${card.image})` }} />
                    <div className="work-hero__card-meta">
                      <p>{card.title}</p>
                      {card.subtitle && <span>{card.subtitle}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section work-gallery">
        <div className="content work-gallery__header">
          <div className="work-gallery__label">Why it matters</div>
          <div>
            <h2>{galleryTitle}</h2>
            <p>{galleryCopy}</p>
          </div>
        </div>
        <div className="content work-gallery__grid">
          {gallery.map((item, index) => {
            const ratios = ['square', 'wide', 'classic'] as const
            const ratio = ratios[index % ratios.length]
            const isTextOnly = !item.image
            return (
              <div
                key={item.title}
                className={`work-gallery__item ${isTextOnly ? 'work-gallery__item--text' : `work-gallery__item--${ratio}`}`}
              >
                {!isTextOnly && (
                  <div className="work-gallery__image" style={{ backgroundImage: `url(${item.image})` }} />
                )}
                <div className="work-gallery__caption">
                  <p className="work-gallery__title">{item.title}</p>
                  {item.subtitle && <p className="work-gallery__subtitle">{item.subtitle}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {extraGallery && extraGallery.length > 0 && (
        <section className="section work-gallery work-gallery--secondary">
          <div className="content work-gallery__header">
            <div className="work-gallery__label">More to expect</div>
            <div>
              <h2>{extraGalleryTitle}</h2>
              <p>{extraGalleryCopy}</p>
            </div>
          </div>
          <div className="content work-gallery__grid">
            {extraGallery.map((item, index) => {
              const ratios = ['wide', 'classic', 'square'] as const
              const ratio = ratios[index % ratios.length]
              const isTextOnly = !item.image
              return (
                <div
                  key={`${item.title}-${index}`}
                  className={`work-gallery__item ${isTextOnly ? 'work-gallery__item--text' : `work-gallery__item--${ratio}`}`}
                >
                  {!isTextOnly && (
                    <div className="work-gallery__image" style={{ backgroundImage: `url(${item.image})` }} />
                  )}
                  <div className="work-gallery__caption">
                    <p className="work-gallery__title">{item.title}</p>
                    {item.subtitle && <p className="work-gallery__subtitle">{item.subtitle}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {extraGallerySecondary && extraGallerySecondary.length > 0 && (
        <section className="section work-gallery work-gallery--secondary">
          <div className="content work-gallery__header">
            <div className="work-gallery__label">How we deliver</div>
            <div>
              <h2>{extraGallerySecondaryTitle}</h2>
              <p>{extraGallerySecondaryCopy}</p>
            </div>
          </div>
          <div className="content work-gallery__grid">
            {extraGallerySecondary.map((item, index) => {
              const ratios = ['classic', 'square', 'wide'] as const
              const ratio = ratios[index % ratios.length]
              const isTextOnly = !item.image
              return (
                <div
                  key={`${item.title}-secondary-${index}`}
                  className={`work-gallery__item ${isTextOnly ? 'work-gallery__item--text' : `work-gallery__item--${ratio}`}`}
                >
                  {!isTextOnly && (
                    <div className="work-gallery__image" style={{ backgroundImage: `url(${item.image})` }} />
                  )}
                  <div className="work-gallery__caption">
                    <p className="work-gallery__title">{item.title}</p>
                    {item.subtitle && <p className="work-gallery__subtitle">{item.subtitle}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">Ready to collaborate</p>
            <h3>{ctaText}</h3>
          </div>
          <a className="work-cta__link" href={ctaHref}>
            Contact us
          </a>
        </div>
      </section>
    </main>
  )
}

export default WorkPageLayout
