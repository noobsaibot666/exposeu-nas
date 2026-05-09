import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'
import { useLocaleNavigate, useLocalePath, useTranslation } from '../i18n/LocaleProvider'

function About() {
  const navigate = useLocaleNavigate()
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
      gsap.from('.about__profile', { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out' })

      const rows = gsap.utils.toArray<HTMLElement>('.about__row')
      gsap.from(rows, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about__grid',
          start: 'top 80%',
        },
      })

      gsap.from('.about__portrait', {
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about__portrait-block',
          start: 'top 80%',
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="about" ref={rootRef} id="main">
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
          <div className="about__label">{t('about.label')}</div>
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
