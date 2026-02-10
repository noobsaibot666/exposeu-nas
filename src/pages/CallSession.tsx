import './Page.css'
import './CallSession.css'

function CallSession() {
  return (
    <main className="page-shell">
      <section className="section call-session">
        <div className="content call-session__nav">
          <nav className="call-session__links call-session__links--left">
            <a href="/">Home</a>
            <a href="/#services">Services</a>
            <a href="/#claim">Claim</a>
            <a href="/#offer">Offer</a>
          </nav>
          <a className="call-session__brand" href="/">
            expose.u
          </a>
          <nav className="call-session__links call-session__links--right">
            <a href="/about">About</a>
            <a href="/contact">Check availability</a>
          </nav>
        </div>

        <div className="content call-session__grid">
          <div className="call-session__header">
            <h1>Clear Answers, Fast Decisions</h1>
            <p className="call-session__subhead">
              In a short call, we’ll answer your questions, clear any doubts, and help you choose
              the perfect content package for your goals. Simple, fast, and tailored to you.
            </p>
          </div>

          <div className="call-session__card">
            <div className="call-session__intro">
              <p className="call-session__eyebrow">Calendly</p>
              <h3>Schedule a 15 minute call</h3>
              <p>Pick a time that fits and we&apos;ll get you clarity quickly.</p>
            </div>

            <div className="call-session__embed">
              <iframe
                src="https://calendly.com/alan-creative/15min"
                title="Book a 15 minute call with Alan Creative"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CallSession
