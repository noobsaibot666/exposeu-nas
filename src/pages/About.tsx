import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'

function About() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement | null>(null)

  const goToHomeSection = useCallback((hash?: string) => {
    navigate(hash ? `/${hash}` : '/')
  }, [navigate])

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Studio', onClick: () => goToHomeSection('#hero') },
        { label: 'Services', onClick: () => goToHomeSection('#cases') },
        { label: 'Start Now', onClick: () => goToHomeSection('#services') },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [goToHomeSection, navigate],
  )

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
    <main className="about" ref={rootRef}>
      <div className="home__nav about__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => goToHomeSection('#hero')}
          brandLabel="expose.u"
          className="top-nav--page"
          activeLabel="About"
        />
      </div>

      <section className="section about__shell">
        <div className="content about__profile">
          <div className="about__label">Profile</div>
          <h1>
            We’re artist-directors creating photo and video for exhibitions, performances, and
            galleries. Precise, art-first, and shaped by people inside the scene.
          </h1>
        </div>

        <div className="content about__grid">
          <div className="about__column about__column--wide">
            <div className="about__row">
              <p className="about__label">What we create</p>
              <p className="about__body">
                Photo and video for exhibitions, openings, performances, and artist releases, built to match your
                voice and your audience.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">How it feels</p>
              <p className="about__body">
                Intentional documentation with clean edits, balanced light, and pacing that respects the work, not
                generic event reels.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">Who we shoot</p>
              <p className="about__body">
                Artists, curators, and producers from intimate shows to mid-size venues, all with high aesthetic
                standards.
              </p>
            </div>
          </div>

          <div className="about__portrait-block">
            <div className="about__portrait">
              <img src={resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_024.png')} alt="Installation scene" />
            </div>
          </div>

          <div className="about__column about__column--meta">
            <div className="about__row">
              <p className="about__label">Where we work</p>
              <p className="about__body">Berlin-based, available for nearby cities as your program expands.</p>
            </div>
            <div className="about__row">
              <p className="about__label">Why us</p>
              <p className="about__body">
                We’re artists and directors, fast on set, quiet in your space, obsessive about tone and detail.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">Collab</p>
              <p className="about__body">
                Tell us what you’re launching. We’ll map documentation, crew, and delivery so your visuals feel unmistakably yours.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </main>
  )
}

export default About
