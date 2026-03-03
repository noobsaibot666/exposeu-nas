import { useEffect, useMemo, useRef, useState } from 'react'
import './Contact.css'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { serviceMeta } from '../data/serviceMeta'
import { trackEvent } from '../utils/analytics'

function Contact() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasTrackedStart, setHasTrackedStart] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)
  const location = useLocation()

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Home', onClick: () => navigate('/') },
        { label: 'Services', href: '/#cases' },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Contact', onClick: () => navigate('/contact') },
      ],
    }),
    [navigate],
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
      const params = new URLSearchParams(location.search)
      const serviceParam = params.get('service')?.trim() ?? ''
      const packageParam = params.get('package')?.trim() ?? ''
      const serviceLabels: Record<string, string> = {
        documentation: serviceMeta.documentation.label,
        'gallery-stories': serviceMeta['gallery-stories'].label,
        'artist-sessions': serviceMeta['artist-sessions'].label,
        performance: serviceMeta.performance.label,
        'fashion-show': serviceMeta['fashion-show'].label,
        atmospheric: serviceMeta.atmospheric.label,
      }
      const packageLabels: Record<string, string> = {
        'single-event': 'One-time',
        'monthly-coverage': 'Monthly',
        'retainer-studio': 'Studio retainer',
      }
      const hasService = Boolean(serviceLabels[serviceParam])
      const hasPackage = Boolean(packageLabels[packageParam])
      const message = String(formData.get('message') || '').trim()
      const serviceLabel = hasService ? serviceLabels[serviceParam] : ''
      const packageLabel = hasPackage ? packageLabels[packageParam] : ''

      const payload = {
        firstName: String(formData.get('firstName') || '').trim(),
        lastName: String(formData.get('lastName') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        service: hasService ? serviceParam : '',
        serviceLabel,
        package: hasPackage ? packageParam : '',
        packageLabel,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        message,
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
      trackEvent('contact_submit_success', 'conversion', 'contact_form')
      navigate('/contact-success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please email us directly.'
      setSubmitError(message)
      trackEvent('contact_submit_error', 'conversion', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormFocus = () => {
    if (hasTrackedStart) return
    setHasTrackedStart(true)
    trackEvent('contact_form_start', 'conversion', 'contact_form')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const serviceParam = params.get('service')?.trim() ?? ''
    const packageParam = params.get('package')?.trim() ?? ''

    if (!messageRef.current) return
    if (messageRef.current.value.trim()) return

    const serviceLabels: Record<string, string> = {
      documentation: serviceMeta.documentation.label,
      'gallery-stories': serviceMeta['gallery-stories'].label,
      'artist-sessions': serviceMeta['artist-sessions'].label,
      performance: serviceMeta.performance.label,
      'fashion-show': serviceMeta['fashion-show'].label,
      atmospheric: serviceMeta.atmospheric.label,
    }

    const hasService = Boolean(serviceLabels[serviceParam])
    const packageLabels: Record<string, string> = {
      'single-event': 'One-time',
      'monthly-coverage': 'Monthly',
      'retainer-studio': 'Studio retainer',
    }

    const hasPackage = Boolean(packageLabels[packageParam])

    if (!hasService && !hasPackage) return

    const serviceLabel = hasService ? serviceLabels[serviceParam] : ''
    const packageLabel = hasPackage ? packageLabels[packageParam] : ''
    const detail = serviceLabel ? serviceLabel : 'a project'
    const packageSuffix = packageLabel ? ` (${packageLabel})` : ''

    messageRef.current.value =
      `Hi - I'm reaching out about ${detail}${packageSuffix}. Dates: ___. Location: ___. Deliverables: ___.`
  }, [location.search])

  useEffect(() => {


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
    <main className="contact" ref={rootRef} id="main">
      <div className="home__nav contact__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel="expose.u"
          className="top-nav--page"
          activeLabel="Contact"
        />
      </div>

      <section className="section contact__body">
        <div className="content contact__heading">
          <p className="contact__eyebrow">Contact</p>
          <h1>Let&apos;s plan your project.</h1>
          <p className="contact__lede">
            We usually reply within 24 hours. No automated replies. No sales pressure.
          </p>
          <p className="contact__lede">
            Reaching out about a specific service or package? Mention it below and we’ll respond accordingly.
          </p>
        </div>

        <div className="content contact__grid">
          <div className="contact__info">
            <div className="contact__list">
              <div>
                <p className="contact__label">Email</p>
                <a href="mailto:hello@expose-u.com">hello@expose-u.com</a>
              </div>
              <div>
                <p className="contact__label">Phone</p>
                <a href="tel:+4917622132950">+49 176 2213 2950</a>
              </div>
              <div>
                <p className="contact__label">Studio</p>
                <p className="contact__address">
                  Duden Straße 24, Kreuzberg, Berlin
                </p>
              </div>
              <div>
                <p className="contact__label">Instagram</p>
                <a href="https://instagram.com/xposeu_official" target="_blank" rel="noreferrer">
                  xposeu_official
                </a>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit} onFocus={handleFormFocus}>
            <div className="contact__field">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" type="text" placeholder="First name" />
            </div>

            <div className="contact__field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" type="text" placeholder="Last name" />
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="message">Message <span aria-hidden="true">*</span></label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your exhibition, performance, or event. Include date, venue, and goals."
                rows={4}
                required
                ref={messageRef}
              />
            </div>

            <p className="contact__error" role="alert" aria-live="assertive">
              {submitError ?? ''}
            </p>

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
