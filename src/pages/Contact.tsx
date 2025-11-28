import './Contact.css'

function Contact() {
  return (
    <main className="contact">
      <div className="content contact__nav">
        <nav className="contact__links contact__links--left">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
        </nav>
        <div className="contact__brand">expose.u</div>
        <nav className="contact__links contact__links--right">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>

      <section className="section contact__body">
        <div className="content contact__heading">
          <p className="contact__eyebrow">Contact Us</p>
          <h1>Let&apos;s plan your shoot.</h1>
          <p className="contact__lede">
            We respond fast—share your project and we&apos;ll align on the perfect coverage.
          </p>
        </div>
        <div className="content contact__grid">
          <div className="contact__info">
            <div className="contact__list">
              <div>
                <p className="contact__label">Email</p>
                <a href="mailto:hello@exposeu.studio">hello@exposeu.studio</a>
              </div>
              <div>
                <p className="contact__label">Phone</p>
                <a href="tel:+49123456789">+49 123 456 789</a>
              </div>
              <div>
                <p className="contact__label">Studio</p>
                <p className="contact__address">
                  Kreuzberg, Berlin<br />
                  Germany
                </p>
              </div>
            </div>
          </div>

          <form className="contact__form">
            <div className="contact__field">
              <label htmlFor="firstName">Name</label>
              <input id="firstName" name="firstName" type="text" placeholder="First name" />
            </div>
            <div className="contact__field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" type="text" placeholder="Last name" />
            </div>
            <div className="contact__field contact__field--full">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="contact__field contact__field--full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your exhibition, performance, or shoot."
                rows={4}
              />
            </div>
            <button className="contact__submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Contact
