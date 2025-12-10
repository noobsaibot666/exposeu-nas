import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'

function About() {
  const navigate = useNavigate()

  const goToHomeSection = (hash?: string) => {
    navigate(hash ? `/${hash}` : '/')
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Studio', onClick: () => goToHomeSection('#hero') },
        { label: 'Cases', onClick: () => goToHomeSection('#cases') },
        { label: 'Pricing', onClick: () => goToHomeSection('#services') },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [navigate],
  )

  return (
    <main className="about">
      <div className="home__nav about__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => goToHomeSection('#hero')}
          brandLabel="expose.u"
          className="top-nav--page"
        />
      </div>

      <section className="section about__shell">
        <div className="content about__profile">
          <div className="about__label">Profile</div>
          <h1>
            We’re artist-directors shooting photo + video for exhibitions, performances, and
            galleries. Tasteful, precise, made by artists who live in the scene.
          </h1>
        </div>

        <div className="content about__grid">
          <div className="about__column about__column--wide">
            <div className="about__row">
              <p className="about__label">What we create</p>
              <p className="about__body">
                Photo + video for exhibitions, performances, gallery takeovers, and launches—art-first and true
                to your voice.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">How it feels</p>
              <p className="about__body">
                Intentional coverage with clean edits, balanced light, and pacing that matches your work—not
                event reels.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">Who we shoot</p>
              <p className="about__body">
                Artists, curators, producers, and stages from intimate shows to mid-size venues—people who care
                about aesthetics.
              </p>
            </div>
          </div>

          <div className="about__portrait-block">
            <div className="about__portrait">
              <img src="/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg" alt="Portrait" />
            </div>
          </div>

          <div className="about__column about__column--meta">
            <div className="about__row">
              <p className="about__label">Where we work</p>
              <p className="about__body">Berlin-based, working across EU/UK for residencies, festivals, and quick pop-ups.</p>
            </div>
            <div className="about__row">
              <p className="about__label">Why us</p>
              <p className="about__body">
                We’re artists and directors—fast on set, respectful in your space, obsessed with tone and detail.
              </p>
            </div>
            <div className="about__row">
              <p className="about__label">Collab</p>
              <p className="about__body">
                Tell us what you’re unveiling. We’ll map coverage, crew, and delivery so you launch with visuals that feel like you.
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
