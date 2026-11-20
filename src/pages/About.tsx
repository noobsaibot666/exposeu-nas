import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

type TeamMember = {
  name: string
  role: string
  bio: string
  portrait: 'alan' | 'joanna' | 'martha'
  tone: string
  photoCredit: string
  photoUrl: string
}

type AboutCopy = {
  title: string
  tagline: string
  paragraphs: string[]
  location: string
  teamTitle: string
  teamIntro: string
  portraitAlt: string
  previewLabel: string
  members: TeamMember[]
  selectedMember: string
}

const teamPortraits = {
  alan: resolveImagePath('/src/assets/images/team/alan-alves-preview.webp'),
  joanna: resolveImagePath('/src/assets/images/team/joanna-opalko-preview.webp'),
  martha: resolveImagePath('/src/assets/images/team/martha-losi-preview.webp'),
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
        { autoAlpha: 0, y: 28, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'opacity,visibility,transform' },
      )

      const revealOnEnter = (selector: string, distance = 20, stagger = 0) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((element, index) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: distance },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              delay: stagger * index,
              ease: 'power2.out',
              clearProps: 'opacity,visibility,transform',
              scrollTrigger: {
                trigger: element,
                start: 'top 92%',
                toggleActions: 'restart none restart none',
              },
            },
          )
        })
      }

      revealOnEnter('.about__intro-heading > *, .about__intro-copy > *', 18, 0.08)
      revealOnEnter('.about__team-intro > *, .about__team-button, .about__team-portrait', 22, 0.09)
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
                  <span className={`about__team-details${selectedMember === index ? ' is-active' : ''}`} aria-hidden={selectedMember !== index}>
                    <span className="about__team-role">{member.role}</span>
                    <span className="about__team-bio">{member.bio}</span>
                  </span>
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
              <img
                className="about__team-photo"
                src={teamPortraits[activeMember.portrait]}
                alt={`${copy.portraitAlt} ${activeMember.name}`}
              />
              <div className="about__team-photo-caption">
                <a className="about__team-photo-credit" href={activeMember.photoUrl} target="_blank" rel="noreferrer">
                  {copy.previewLabel} · {activeMember.photoCredit} / Unsplash
                </a>
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
