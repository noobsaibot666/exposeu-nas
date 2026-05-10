import { useMemo } from 'react'
import './ConcertsBerlin.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { SEOMeta } from '../components/SEOMeta'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'

const STEPS = [
  {
    title: 'Tell us about your project',
    body: 'Fill out the contact form — scope, date, and what you need. We respond within 24 hours.',
  },
  {
    title: 'We align on the details',
    body: 'A short call or exchange to confirm access, timing, and deliverables. No lengthy briefing process.',
  },
  {
    title: 'We document. You receive.',
    body: 'Same-night or 48h selects depending on service. Organized files, ready to use immediately.',
  },
]

export default function ConcertsBerlin() {
  const navigate = useLocaleNavigate()
  const { t } = useTranslation()

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

  return (
    <main className="cb">
      <SEOMeta
        title="Concert & Live Event Photography Berlin"
        description="Berlin-based concert and live event photography. Same-night press selects, full atmospheric coverage. 8+ shows documented at Silent Green. From €900."
        ogTitle="Concert & Live Event Photography Berlin | expose.u"
        ogDescription="Berlin-based concert and live event photography. Same-night press selects, full atmospheric coverage. 8+ shows documented at Silent Green. From €900."
        canonical="https://expose-u.com/concerts-berlin"
        lang="en"
      />

      <div className="home__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
        />
      </div>

      {/* Hero */}
      <section className="section cb__hero">
        <div className="content cb__hero-inner">
          <span className="cb__label">Concert Photography Berlin</span>
          <h1>Your show documented.<br />Press-ready before morning.</h1>
          <p className="cb__subline">
            Berlin-based concert and live event photography — same-night selects, fast turnaround, built for press and social.
          </p>
          <p className="cb__credential">
            Documented 8+ concerts at Silent Green Kulturquartier, Berlin.
          </p>
          <a className="cb__cta" href="/contact?service=concerts-events">
            Tell us about your show →
          </a>
        </div>
      </section>

      {/* What we cover */}
      <section className="section cb__coverage">
        <div className="content cb__coverage-inner">
          <h2>Full coverage. Fast delivery.</h2>
          <ul className="cb__bullets">
            <li>Same-night priority selects for press and social</li>
            <li>Full coverage — stage, crowd, atmosphere</li>
            <li>Organized delivery, ready to publish</li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section className="section cb__pricing">
        <div className="content cb__pricing-inner">
          <h2>Transparent pricing.</h2>
          <p className="cb__pricing-copy">
            One show from €900. Monthly coverage from €2,900. Clear scope, simple proposal.
          </p>
          <a className="cb__pricing-link" href="/services/concerts-events#pricing">
            See full pricing →
          </a>
        </div>
      </section>

      {/* Process */}
      <section className="section cb__process">
        <div className="content cb__process-inner">
          <h2>Simple from first message to final delivery.</h2>
          <ol className="cb__steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="cb__step">
                <span className="cb__step-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section cb__final">
        <div className="content cb__final-inner">
          <h2>Let's cover your next show.</h2>
          <a className="cb__cta" href="/contact?service=concerts-events">
            Tell us about your show →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
