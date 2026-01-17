import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Contact.css'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'

function Contact() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const resolveContactEndpoint = () => {
    // Traefik routes the API at /api and strips /api before forwarding to the Node service.
    // So frontend must POST to /api/contact (same origin).
    const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()

    // Default: same-origin
    if (!raw) return '/api/contact'

    // If user set "expose-u.com" (no scheme), fix it
    const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`

    // Ensure no trailing slash
    return `${base.replace(/\/+$/, '')}/api/contact`
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

      const payload = {
        firstName: String(formData.get('firstName') || '').trim(),
        lastName: String(formData.get('lastName') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        message: String(formData.get('message') || '').trim(),
      }

      if (!payload.email || !payload.message) {
        setSubmitError('Please add your email and a message.')
        setIsSubmitting(false)
        return
      }

      const endpoint = resolveContactEndpoint()

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let serverMsg = 'Contact request failed'
        try {
          const data = await response.json()
          if (data?.error) serverMsg = String(data.error)
        } catch {
          // ignore parsing errors
        }
        throw new Error(serverMsg)
      }

      form.reset()
      navigate('/contact-success')
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const headingItems = gsap.utils.toArray<HTMLElement>('.contact__heading > *')
      gsap.from(headingItems, { opacity: 0, y: 18, duration: 0.7, stagger: 0.08, ease: 'power2.out' })

      gsap.from('.contact__info', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.contact__grid', start: 'top 80%' },
      })

      gsap.from('.contact__form', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.contact__form', start: 'top 85%' },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="contact" ref={rootRef}>
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
          <p className="contact__eyebrow">Contact</p>
          <h1>Let&apos;s plan your project.</h1>
          <p className="contact__lede">
            We reply within 24 hours. Share your dates, location, and goals, and we&apos;ll propose the right package.
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
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your exhibition, performance, or event. Include date, venue, and goals."
                rows={4}
                required
              />
            </div>

            {submitError ? <p className="contact__error">{submitError}</p> : null}

            <button className="contact__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Contact
