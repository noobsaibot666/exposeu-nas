import { useEffect, useMemo, useRef, useState } from 'react'
import './Contact.css'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { trackEvent } from '../utils/analytics'

const PROJECT_TYPE_OPTIONS = [
  'Concert / Event',
  'Exhibition / Gallery',
  'Artist Session',
  'Brand / Agency',
  'Other',
]

function Contact() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasStartedRef = useRef(false)
  const hasSubmittedRef = useRef(false)
  const hasAbandonFiredRef = useRef(false)

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
    const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
    if (!raw) return '/api/contact'
    const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
    return `${base.replace(/\/+$/, '')}/api/contact`
  }

  const clearFieldError = (name: string) => {
    if (!fieldErrors[name]) return
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const getFieldErrorId = (name: string) => `${name}-error`

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setSubmitError(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const projectType = String(formData.get('projectType') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const companyWebsite = String(formData.get('companyWebsite') || '').trim()

    const nextErrors: Record<string, string> = {}
    if (!name) nextErrors.name = 'Enter your name.'
    if (!email) {
      nextErrors.email = 'Enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!projectType) nextErrors.projectType = 'Select a project type.'

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      trackEvent('contact_form_submit_error', { error_type: 'validation', projectType })
      setSubmitError('Please correct the highlighted fields.')
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const payload = {
        name,
        email,
        projectType,
        message,
        sourceUrl: window.location.href,
        referrer: document.referrer,
        ...(companyWebsite ? { companyWebsite } : {}),
      }

      const response = await fetch(resolveContactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let responseData: unknown = null
      try { responseData = await response.json() } catch { responseData = null }

      if (!response.ok) {
        let serverMsg = 'Something went wrong — please email us at hello@expose-u.com'
        if (typeof responseData === 'object' && responseData !== null) {
          const data = responseData as { error?: string | { message?: string } }
          if (typeof data.error === 'string') serverMsg = data.error
          else if (data.error?.message) serverMsg = String(data.error.message)
        }
        throw new Error(serverMsg)
      }

      hasSubmittedRef.current = true
      setSubmitted(true)
      trackEvent('contact_form_submit_success', { projectType })

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit_contact', {
          event_category: 'contact',
          event_label: projectType,
        })
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: projectType })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong — please email us at hello@expose-u.com'
      setSubmitError(msg)
      trackEvent('contact_form_submit_error', { error_type: 'api_error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormFocus = () => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    trackEvent('contact_form_start')
  }

  const handleFieldInput = (name: string) => {
    clearFieldError(name)
    if (submitError) setSubmitError(null)
  }

  useEffect(() => {
    trackEvent('contact_view')
  }, [])

  useEffect(() => {
    const maybeTrackAbandon = () => {
      if (!hasStartedRef.current || hasSubmittedRef.current || hasAbandonFiredRef.current) return
      hasAbandonFiredRef.current = true
      trackEvent('contact_form_abandon')
    }
    const handleBeforeUnload = () => maybeTrackAbandon()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') maybeTrackAbandon()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

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
            Reaching out about a specific service or package? Mention it below and we&apos;ll respond accordingly.
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

          {submitted ? (
            <p className="contact__success contact__success--standalone" role="status">
              Thanks — we&apos;ll get back to you within 24 hours.
            </p>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} onFocus={handleFormFocus} noValidate>
              <div className="contact__field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  aria-invalid={fieldErrors.name ? 'true' : undefined}
                  aria-describedby={fieldErrors.name ? getFieldErrorId('name') : undefined}
                  onChange={() => handleFieldInput('name')}
                />
                {fieldErrors.name && (
                  <span className="contact__field-error" id={getFieldErrorId('name')} role="alert">
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              <div className="contact__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-invalid={fieldErrors.email ? 'true' : undefined}
                  aria-describedby={fieldErrors.email ? getFieldErrorId('email') : undefined}
                  onChange={() => handleFieldInput('email')}
                />
                {fieldErrors.email && (
                  <span className="contact__field-error" id={getFieldErrorId('email')} role="alert">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className="contact__field contact__field--full">
                <label htmlFor="projectType">Type of project</label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  aria-invalid={fieldErrors.projectType ? 'true' : undefined}
                  aria-describedby={fieldErrors.projectType ? getFieldErrorId('projectType') : undefined}
                  onChange={() => handleFieldInput('projectType')}
                  defaultValue=""
                >
                  <option value="" disabled>Select a type…</option>
                  {PROJECT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {fieldErrors.projectType && (
                  <span className="contact__field-error" id={getFieldErrorId('projectType')} role="alert">
                    {fieldErrors.projectType}
                  </span>
                )}
              </div>

              <div className="contact__field contact__field--full">
                <label htmlFor="message">Tell us about your project</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  onChange={() => handleFieldInput('message')}
                />
              </div>

              {/* Honeypot */}
              <div
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                aria-hidden="true"
              >
                <label htmlFor="companyWebsite">Company website</label>
                <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <p className="contact__error" role="alert" aria-live="assertive">
                {submitError ?? ''}
              </p>

              <button className="contact__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="contact__spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Contact
