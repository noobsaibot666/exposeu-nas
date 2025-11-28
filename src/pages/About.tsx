import './About.css'

function About() {
  return (
    <main className="about">
      <div className="content about__nav">
        <div className="about__brand">expose.u</div>
        <nav className="about__links">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="about__contact">hello@exposeu.studio</div>
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

        <div className="content about__footer-mark">
          <a className="about__footer-link" href="/contact">
            Contact
            <span aria-hidden="true" className="about__arrow">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </main>
  )
}

export default About
