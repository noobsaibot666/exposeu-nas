import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

type TeamMember = {
  name: string
  role: string
  bio: string
  initials: string
  tone: string
}

type AboutCopy = {
  title: string
  tagline: string
  paragraphs: string[]
  location: string
  teamTitle: string
  teamIntro: string
  members: TeamMember[]
  selectedMember: string
}

function About() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const rootRef = useRef<HTMLElement | null>(null)
  const { t, tm } = useTranslation()
  const copy = tm<AboutCopy>('about.page')
  const [selectedMember, setSelectedMember] = useState(0)

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
        { id: 'services', label: t('nav.services'), href: '/#cases' },
        { id: 'portfolio', label: t('nav.lastProjects'), onClick: () => navigate('/portfolio') },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__wordmark',
        { opacity: 0, y: 34, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out' },
      )

      gsap.fromTo(
        '.about__intro-copy > *',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.2, ease: 'power2.out', clearProps: 'opacity,transform' },
      )

      gsap.fromTo(
        '.about__team',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: '.about__team', start: 'top 82%' },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const activeMember = copy.members[selectedMember] ?? copy.members[0]

  return (
    <main className="about" ref={rootRef} id="main">
      <SEOMeta
        title={t('common.meta.about.title')}
        description={t('common.meta.about.description')}
        ogTitle={t('common.meta.about.title')}
        ogDescription={t('common.meta.about.description')}
        canonical="https://expose-u.com/about"
        lang={locale}
      />
      <div className="home__nav about__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="about"
        />
      </div>

      <section className="about__shell">
        <div className="about__wordmark-wrap" aria-label="expose.u">
          <div className="about__wordmark" aria-hidden="true">expose.u</div>
        </div>

        <div className="about__intro content">
          <div className="about__intro-heading">
            <p className="about__eyebrow">{copy.title}</p>
            <h1>{copy.tagline}</h1>
          </div>
          <div className="about__intro-copy">
            {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="about__location">{copy.location}</p>
          </div>
        </div>

        <section className="about__team content" aria-labelledby="about-team-heading">
          <div className="about__team-intro">
            <p className="about__eyebrow">{copy.teamTitle}</p>
            <h2 id="about-team-heading">{copy.teamIntro}</h2>
          </div>

          <div className="about__team-interactive">
            <div className="about__team-list" aria-label={copy.teamTitle}>
              {copy.members.map((member, index) => (
                <button
                  className={`about__team-button${selectedMember === index ? ' is-active' : ''}`}
                  type="button"
                  aria-pressed={selectedMember === index}
                  aria-controls="about-team-portrait"
                  id={`about-team-tab-${index}`}
                  key={member.name}
                  onMouseEnter={() => setSelectedMember(index)}
                  onFocus={() => setSelectedMember(index)}
                  onClick={() => setSelectedMember(index)}
                >
                  <span className="about__team-name">{member.name}</span>
                  <span className="about__team-role">{member.role}</span>
                </button>
              ))}
            </div>

            <div
              className={`about__team-portrait about__team-portrait--${activeMember.tone}`}
              id="about-team-portrait"
              role="region"
              aria-label={`${copy.selectedMember}: ${activeMember.name}`}
              aria-labelledby={`about-team-tab-${selectedMember}`}
              key={activeMember.name}
            >
              <div className="about__team-portrait-mark" aria-hidden="true">{activeMember.initials}</div>
              <div className="about__team-portrait-caption">
                <span>{activeMember.name}</span>
                <p>{activeMember.bio}</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </section>
    </main>
  )
}

export default About
