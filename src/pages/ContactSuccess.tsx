import './Contact.css'
import { Link } from 'react-router-dom'
import TopNav from '../components/TopNav'

function ContactSuccess() {
  return (
    <main className="contact contact--success">
      <div className="content contact__nav">
        <TopNav
          leftLinks={[
            { label: 'Studio', href: '/#hero' },
            { label: 'Services', href: '/#cases' },
            { label: 'Start Now', href: '/#services' },
          ]}
          rightLinks={[
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ]}
          className="top-nav--page"
          activeLabel="Contact"
        />
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
