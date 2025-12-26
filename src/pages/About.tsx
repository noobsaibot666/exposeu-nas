import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { resolveImagePath } from '../utils/resolveImagePath'

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
                Intentional coverage with clean edits, balanced light, and pacing that respects the work, not
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
              <img src={resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg')} alt="Portrait" />
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
                Tell us what you’re launching. We’ll map coverage, crew, and delivery so your visuals feel unmistakably yours.
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
