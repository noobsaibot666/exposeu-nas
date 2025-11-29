import type { CSSProperties } from 'react'
import Footer from '../sections/Footer'
import './WorkPage.css'

export type WorkCard = {
  image: string
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
}: WorkPageLayoutProps) {
  return (
    <main className="work-page">
      <div className="content work-nav">
        <nav className="work-nav__links work-nav__links--left">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
        </nav>
        <div className="work-nav__brand">expose.u</div>
        <nav className="work-nav__links work-nav__links--right">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
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
            <div className="work-hero__stack">
              {cards.map((card, index) => (
                <div
                  key={card.title}
                  className="work-hero__card"
                  style={{ '--offset': `${index * 16}px` } as CSSProperties}
                >
                  <div className="work-hero__card-media" style={{ backgroundImage: `url(${card.image})` }} />
                  <div className="work-hero__card-meta">
                    <p>{card.title}</p>
                    {card.subtitle && <span>{card.subtitle}</span>}
                  </div>
                </div>
              ))}
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
          {gallery.map((item) => (
            <div key={item.title} className="work-gallery__item">
              <div className="work-gallery__image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="work-gallery__caption">
                <p className="work-gallery__title">{item.title}</p>
                {item.subtitle && <p className="work-gallery__subtitle">{item.subtitle}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">Ready to collaborate</p>
            <h3>{ctaText}</h3>
          </div>
          <a className="btn btn-primary" href={ctaHref}>
            Let&apos;s talk
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default WorkPageLayout
