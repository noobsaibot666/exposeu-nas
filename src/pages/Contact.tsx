import { useMemo } from 'react'
import './Contact.css'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'

function Contact() {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/contact-success')
  }

  return (
    <main className="contact">
      <div className="home__nav contact__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => goToHomeSection('#hero')}
          brandLabel="expose.u"
          className="top-nav--page"
        />
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

          <form className="contact__form" onSubmit={handleSubmit}>
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
      <Footer />
    </main>
  )
}

export default Contact
