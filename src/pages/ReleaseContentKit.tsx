import { useEffect, useMemo } from 'react'
import './ReleaseContentKit.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocale, useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'
import { trackEvent, useScrollDepthTracking, useTrackViewEvent } from '../utils/analytics'
import { resolveImagePath } from '../utils/resolveImagePath'

const SERVICE_SLUG = 'release-content-kit'

const heroImage = resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0022.jpeg')
const studioImage = resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/DSC_4950.jpg')
const liveImage = resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/024.jpg')

const audiences = [
  'musicians',
  'singers',
  'DJs',
  'producers',
  'bands',
  'performers',
  'visual artists',
  'independent creatives',
  'labels',
  'artist managers',
]

const releases = [
  'single release',
  'album campaign',
  'live show',
  'tour announcement',
  'music video launch',
  'press campaign',
  'new artist profile',
]

const coreContent = [
  'Press photos',
  'Artist portraits',
  'Short-form video clips',
  'Social media assets',
  'Behind-the-scenes moments',
  'Promo visuals for release announcements',
  'Website and profile images',
]

const addOns = [
  'Short interview clips',
  'Vertical reels',
  'Teaser videos',
  'Live session documentation',
  'Cover art direction support',
  'Extended campaign content',
]

const packages = [
  {
    id: 'essential-kit',
    title: 'Essential Kit',
    intro: 'For artists who need clean press and promo visuals.',
    includes: ['photo session', 'edited press images', 'social-ready crops', 'basic promo clips'],
    bestFor: ['single releases', 'profile updates', 'booking pages', 'simple campaign refreshes'],
  },
  {
    id: 'campaign-kit',
    title: 'Campaign Kit',
    intro: 'For artists preparing a stronger release push.',
    includes: ['photo session', 'short-form video clips', 'vertical social assets', 'behind-the-scenes material', 'release announcement visuals'],
    bestFor: ['album campaigns', 'show promotion', 'tour announcements', 'social media campaigns'],
  },
  {
    id: 'full-release-kit',
    title: 'Full Release Kit',
    intro: 'For artists who need a complete visual campaign.',
    includes: ['press photos', 'artist portraits', 'short videos', 'interview-style clips', 'social media assets', 'teaser content'],
    bestFor: ['labels', 'managers', 'bigger campaigns', 'album releases', 'major shows', 'artist relaunches'],
  },
]

const usage = [
  'Instagram posts and reels',
  'TikTok clips',
  'Spotify profile visuals',
  'Spotify Canvas',
  'YouTube Shorts',
  'press releases',
  'EPKs',
  'posters and flyers',
  'booking emails',
  'artist websites',
  'ads and release campaigns',
]

const process = [
  ['Tell us what you are releasing', 'Single, album, show, tour, campaign, or new artist profile.'],
  ['We shape the visual direction', 'Mood, location, styling, references, and content needs.'],
  ['We shoot photo and video', 'A focused session built around your release.'],
  ['You receive ready-to-use assets', 'Edited content prepared for press, social media, websites, and promotion.'],
]

export default function ReleaseContentKit() {
  const navigate = useLocaleNavigate()
  const localizePath = useLocalePath()
  const { locale } = useLocale()
  const { t } = useTranslation()

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
    <main className="rck" id="main">
      <SEOMeta
        title="Release Content Kit for Artists"
        description="Photo and video content for musicians and artists preparing a single, album, show, tour, or campaign release. Press photos, short videos, social media assets, and optional interview content in Berlin."
        ogTitle="Release Content Kit for Artists | expose.u Berlin"
        ogDescription="Photo and video assets for musicians, performers, and artists preparing a release, show, tour, or campaign."
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

      <section className="rck__hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 7, 11, 0.9), rgba(5, 7, 11, 0.52)), url(${heroImage})` }}>
        <div className="content rck__hero-inner">
          <p className="rck__eyebrow">Artist release content in Berlin</p>
          <h1>Release Content Kit</h1>
          <p className="rck__subheadline">
            Photo and video content for artists preparing a single, album, show, tour, or campaign release.
          </p>
          <p className="rck__intro">
            A focused content session designed to give you strong visuals for press, social media, release campaigns, booking pages, and show promotion.
          </p>
          <div className="rck__actions">
            <a className="rck__button rck__button--primary" href={contactHref} onClick={() => trackCta('hero_primary')}>
              Book a Release Session
            </a>
            <a className="rck__button" href="#included" onClick={() => trackCta('hero_secondary')}>
              See What's Included
            </a>
          </div>
        </div>
      </section>

      <section className="section rck__problem">
        <div className="content rck__split">
          <div>
            <p className="rck__label">The problem</p>
            <h2>You have the release. Now you need the visuals.</h2>
          </div>
          <div className="rck__copy">
            <p>Before a single, album, show, or campaign goes live, artists need more than one good photo.</p>
            <p>You need content that can work across press, social media, posters, announcements, interviews, profiles, and ads.</p>
            <p>The Release Content Kit gives you a clean set of photo and video assets ready to support your next launch.</p>
          </div>
        </div>
      </section>

      <section className="section rck__audience">
        <div className="content">
          <p className="rck__label">Who it is for</p>
          <h2>Made for artists preparing something new.</h2>
          <div className="rck__tag-grid" aria-label="Audience and release types">
            {[...audiences, ...releases].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section rck__included" id="included">
        <div className="content rck__media-split">
          <div className="rck__image" style={{ backgroundImage: `url(${studioImage})` }} />
          <div>
            <p className="rck__label">What you get</p>
            <h2>A focused photo and video package for your release.</h2>
            <p className="rck__lede">The session is built around your upcoming release, campaign, or show.</p>
            <div className="rck__list-columns">
              <div>
                <h3>Core content</h3>
                <ul>{coreContent.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3>Optional add-ons</h3>
                <ul>{addOns.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section rck__packages">
        <div className="content">
          <div className="rck__section-head">
            <p className="rck__label">Package structure</p>
            <h2>Choose the level you need.</h2>
          </div>
          <div className="rck__package-grid">
            {packages.map((pkg) => (
              <article className="rck__package" key={pkg.id}>
                <h3>{pkg.title}</h3>
                <p>{pkg.intro}</p>
                <h4>Includes</h4>
                <ul>{pkg.includes.map((item) => <li key={item}>{item}</li>)}</ul>
                <h4>Best for</h4>
                <ul>{pkg.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
                <a
                  className="rck__package-link"
                  href={localizePath(`/contact?service=${SERVICE_SLUG}&package=${pkg.id}`)}
                  onClick={() => trackCta('package_card', pkg.id)}
                >
                  Ask about {pkg.title}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section rck__usage">
        <div className="content rck__split">
          <div>
            <p className="rck__label">Where it works</p>
            <h2>Ready for press, social, and promotion.</h2>
          </div>
          <div className="rck__tag-grid rck__tag-grid--compact">
            {usage.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section rck__why">
        <div className="content rck__media-split rck__media-split--reverse">
          <div>
            <p className="rck__label">Why expose.u</p>
            <h2>Visual content with an editorial eye.</h2>
            <p className="rck__lede">expose.u creates photo and video content for artists, performances, exhibitions, and cultural work.</p>
            <p>We focus on visuals that feel honest, cinematic, and ready to use, not generic promo content.</p>
            <p>Based in Berlin, working with artists, venues, performers, and creative teams.</p>
          </div>
          <div className="rck__image" style={{ backgroundImage: `url(${liveImage})` }} />
        </div>
      </section>

      <section className="section rck__process">
        <div className="content">
          <div className="rck__section-head">
            <p className="rck__label">Process</p>
            <h2>How it works.</h2>
          </div>
          <ol className="rck__steps">
            {process.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section rck__final">
        <div className="content rck__final-inner">
          <p className="rck__label">Preparing a release?</p>
          <h2>Let's create the visuals you need before your campaign goes live.</h2>
          <a className="rck__button rck__button--primary" href={contactHref} onClick={() => trackCta('final')}>
            Book a Release Session
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
