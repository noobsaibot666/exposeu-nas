import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { useLocale, useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

function About() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const rootRef = useRef<HTMLElement | null>(null)
  const { t, tm } = useTranslation()
  const localizePath = useLocalePath()
  const sections = tm<Array<{ label: string; body: string; cta?: string }>>('about.sections')

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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__profile',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'opacity,transform' },
      )

      const rows = gsap.utils.toArray<HTMLElement>('.about__row')
      gsap.fromTo(
        rows,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.about__grid',
            start: 'top 80%',
          },
        },
      )

      gsap.fromTo(
        '.about__portrait',
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.about__portrait-block',
            start: 'top 80%',
          },
        },
      )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="about" ref={rootRef} id="main">
      <SEOMeta
        title="About"
        description="Berlin-based documentation studio for concerts, exhibitions, and cultural events. Art-first approach, fast delivery."
        ogTitle="About expose.u | Berlin Documentation Studio"
        ogDescription="Berlin-based documentation studio run by people inside the cultural scene. Fast delivery. Art-first."
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

      <section className="section about__shell">
        <div className="content about__profile">
          <div className="about__profile-spacer" aria-hidden="true" />
          <div>
            <h1>{t('about.headline')}</h1>
            <p className="about__subline">{t('about.subline')}</p>
          </div>
        </div>

        <div className="content about__grid">
          <div className="about__column about__column--wide">
            {sections.slice(0, 3).map((section) => (
              <div className="about__row" key={section.label}>
                <p className="about__label">{section.label}</p>
                <p className="about__body">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="about__portrait-block">
            <div className="about__portrait">
              <img src={resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_024.png')} alt={t('about.portraitAlt')} />
            </div>
          </div>

          <div className="about__column about__column--meta">
            {sections.slice(3).map((section) => (
              <div className="about__row" key={section.label}>
                <p className="about__label">{section.label}</p>
                <div>
                  <p className="about__body">{section.body}</p>
                  {section.cta && (
                    <a className="about__cta-link" href={localizePath('/contact')}>
                      {section.cta}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </section>
    </main>
  )
}

export default About
