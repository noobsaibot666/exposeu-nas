import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import PricingSection from '../sections/PricingSection'
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
  serviceSlug?: string
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
  serviceSlug,
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

      const gallerySections = gsap.utils.toArray<HTMLElement>('.work-gallery')
      gallerySections.forEach((section) => {
        const sequenceItems = section.querySelectorAll<HTMLElement>('.work-gallery__sequence-item')
        const media = section.querySelector<HTMLElement>('.work-gallery__image')
        const split = section.querySelector<HTMLElement>('.work-gallery__split')
        const textItems = section.querySelectorAll<HTMLElement>('.work-gallery__text > *')

        gsap.from(sequenceItems, {
          opacity: 0,
          y: 36,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        })

        if (split) {
          gsap.from(split, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
            },
          })
        }

        if (textItems.length) {
          gsap.from(textItems, {
            opacity: 0,
            y: 18,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
            },
          })
        }

        if (media) {
          gsap.from(media, {
            opacity: 0,
            scale: 1.08,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
            },
          })

          gsap.to(media, {
            y: -70,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        if (media) {
          gsap.fromTo(
            media,
            { clipPath: 'inset(12% 0% 12% 0%)', skewY: 1.5 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              skewY: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
              },
            },
          )
        }
      })

      gsap.from('.work-cta__content > *', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-cta',
          start: 'top 80%',
        },
      })

      const listeners: Array<() => void> = []
      const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')

      if (hoverMedia.matches) {
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
      }

      return () => listeners.forEach((off) => off())
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const sectionImages = [
    cards[0]?.image,
    cards[1]?.image ?? cards[0]?.image,
    cards[2]?.image ?? cards[0]?.image,
  ]

  const renderSection = (
    label: string,
    heading: string,
    copy: string,
    items: WorkCard[],
    image?: string,
    isFlipped?: boolean,
    key?: string,
  ) => (
    <section className={`section work-gallery${isFlipped ? ' work-gallery--flipped' : ''}`} key={key}>
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
    <main className="work-page" ref={rootRef}>
      <div className="content work-nav">
        <TopNav
          leftLinks={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/#services' },
          ]}
          rightLinks={[
            { label: 'About', href: '/about' },
            { label: 'Check availability', href: '/contact' },
          ]}
          className="top-nav--page"
          activeLabel="Services"
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

      {renderSection(
        'Why it matters',
        galleryTitle,
        galleryCopy,
        gallery,
        sectionImages[0],
        false,
        'gallery-primary',
      )}

      {extraGallery &&
        extraGallery.length > 0 &&
        renderSection(
          'More to expect',
          extraGalleryTitle ?? '',
          extraGalleryCopy ?? '',
          extraGallery,
          sectionImages[1],
          false,
          'gallery-secondary',
        )}

      {extraGallerySecondary &&
        extraGallerySecondary.length > 0 &&
        renderSection(
          'How we deliver',
          extraGallerySecondaryTitle ?? '',
          extraGallerySecondaryCopy ?? '',
          extraGallerySecondary,
          sectionImages[2],
          false,
          'gallery-tertiary',
        )}

      <PricingSection
        headline={`${title} packages for galleries, artists, and producers.`}
        serviceSlug={serviceSlug}
      />

      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">Ready to collaborate?</p>
            <h3>{ctaText}</h3>
          </div>
          <a className="work-cta__link" href={ctaHref}>
            Check availability
          </a>
        </div>
      </section>
    </main>
  )
}

export default WorkPageLayout
