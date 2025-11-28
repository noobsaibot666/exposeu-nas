import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './About.css'

function About() {
  const headlineRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const headline = headlineRef.current
    if (!headline) return

    const tiltX = gsap.quickTo(headline, 'rotateX', { duration: 0.4, ease: 'power2.out' })
    const tiltY = gsap.quickTo(headline, 'rotateY', { duration: 0.4, ease: 'power2.out' })
    const moveX = gsap.quickTo(headline, 'xPercent', { duration: 0.4, ease: 'power2.out' })
    const moveY = gsap.quickTo(headline, 'yPercent', { duration: 0.4, ease: 'power2.out' })

    const handleMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = event.clientX / innerWidth - 0.5
      const y = event.clientY / innerHeight - 0.5

      tiltX(y * 8)
      tiltY(-x * 8)
      moveX(x * 4)
      moveY(y * 4)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <main className="about">
      <div className="content about__nav">
        <nav className="about__links about__links--left">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
        </nav>
        <div className="about__brand">expose.u</div>
        <nav className="about__links about__links--right">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>

      <section className="section about__hero">
        <div className="content about__hero-grid">
          <div className="about__text" ref={headlineRef}>
            <p className="about__eyebrow">About</p>
            <h1>We document the art world from inside the room.</h1>
            <p className="about__copy">
              We’re image-makers embedded in galleries, venues, and studios. We listen to the artist
              first, then capture the show with taste, respect, and an eye for the details that
              define your voice.
            </p>
            <p className="about__copy">
              Our team covers exhibitions, performances, talks, and intimate sessions—always with
              lighting, pacing, and framing that belong to your universe, not a generic event reel.
            </p>
          </div>
          <div className="about__media">
            <img src="/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg" alt="Artistic scene" />
            <div className="about__glow" aria-hidden />
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
