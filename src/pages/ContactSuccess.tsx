import './Contact.css'
import { Link } from 'react-router-dom'

function ContactSuccess() {
  return (
    <main className="contact contact--success">
      <div className="content contact__nav">
        <nav className="contact__links contact__links--left">
          <a href="/">Home</a>
          <a href="/#proposal">Proposal</a>
          <a href="/#claim">Claim</a>
          <a href="/#offer">Offer</a>
        </nav>
        <a className="contact__brand" href="/">
          expose.u
        </a>
        <nav className="contact__links contact__links--right">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>

      <section className="section contact__body">
        <div className="content contact__heading">
          <p className="contact__eyebrow">Thank you</p>
          <h1>We received your message.</h1>
          <p className="contact__lede">
            Our team will reach out shortly to plan next steps and confirm details.
          </p>
          <div className="contact__success-actions">
            <Link className="contact__submit" to="/">
              Back to Home
            </Link>
            <Link className="contact__submit contact__submit--ghost" to="/portfolio">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactSuccess
