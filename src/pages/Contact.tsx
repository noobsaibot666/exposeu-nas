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
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasTrackedStart, setHasTrackedStart] = useState(false)
  const [hasTouchedMessage, setHasTouchedMessage] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)
  const hasStartedRef = useRef(false)
  const hasSubmittedRef = useRef(false)
  const hasAbandonFiredRef = useRef(false)
  const location = useLocation()

  const queryContext = useMemo(() => {
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

    return {
      serviceParam,
      packageParam,
      serviceLabel: serviceLabels[serviceParam] ?? '',
      packageLabel: packageLabels[packageParam] ?? '',
    }
  }, [location.search])

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

  const starterMessage = useMemo(() => {
    if (!queryContext.serviceLabel || !queryContext.packageLabel) return ''

    return [
      `Hello Expose.u — I'd like to inquire about ${queryContext.serviceLabel} (${queryContext.packageLabel}).`,
      'Context: __. Dates: __. Location: __.',
    ].join('\n')
  }, [queryContext.packageLabel, queryContext.serviceLabel])

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

  const clearFieldError = (name: string) => {
    if (!fieldErrors[name]) return

    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const getFieldErrorId = (name: string) => `${name}-error`

  const isDebugEnabled = () => {
    if (typeof window === 'undefined') return false

    try {
      return window.localStorage.getItem('__analyticsDebug') === 'true'
    } catch {
      return false
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setSubmitError(null)
    setSubmitSuccessMessage(null)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const hasService = Boolean(queryContext.serviceLabel)
      const hasPackage = Boolean(queryContext.packageLabel)
      const firstName = String(formData.get('firstName') || '').trim()
      const lastName = String(formData.get('lastName') || '').trim()
      const email = String(formData.get('email') || '').trim()
      const message = String(formData.get('message') || '').trim()
      const companyWebsite = String(formData.get('companyWebsite') || '').trim()
      const serviceLabel = hasService ? queryContext.serviceLabel : ''
      const packageLabel = hasPackage ? queryContext.packageLabel : ''
      const nextErrors: Record<string, string> = {}

      if (!firstName && !lastName) {
        nextErrors.firstName = 'Add your first or last name.'
        nextErrors.lastName = 'Add your first or last name.'
      }

      if (!email) {
        nextErrors.email = 'Enter your email address.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        nextErrors.email = 'Enter a valid email address.'
      }

      if (!message) {
        nextErrors.message = 'Tell us about your project.'
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors)
        trackEvent('contact_form_submit_error', {
          error_type: 'validation',
          service: hasService ? queryContext.serviceParam : undefined,
          serviceLabel: serviceLabel || undefined,
          package: hasPackage ? queryContext.packageParam : undefined,
          packageLabel: packageLabel || undefined,
        })
        setSubmitError('Please correct the highlighted fields.')
        return
      }

      setFieldErrors({})
      setIsSubmitting(true)

      const payload = {
        firstName,
        lastName,
        email,
        service: hasService ? queryContext.serviceParam : '',
        serviceLabel,
        package: hasPackage ? queryContext.packageParam : '',
        packageLabel,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        message,
      }

      if (companyWebsite) {
        Object.assign(payload, { companyWebsite })
      }

      const endpoint = resolveContactEndpoint()

      if (isDebugEnabled()) {
        console.debug('[contact submit] request fired', {
          endpoint,
          payload: {
            ...payload,
            message: payload.message ? '[present]' : '[missing]',
          },
        })
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let responseData: unknown = null
      try {
        responseData = await response.json()
      } catch {
        responseData = null
      }

      if (isDebugEnabled()) {
        console.debug('[contact submit] response', {
          status: response.status,
          ok: response.ok,
          data: responseData,
        })
      }

      if (!response.ok) {
        let serverMsg = 'Something went wrong. Please try again or email us directly.'

        if (typeof responseData === 'object' && responseData !== null) {
          const data = responseData as { error?: string | { message?: string } }
          if (typeof data.error === 'string') {
            serverMsg = data.error
          } else if (data.error?.message) {
            serverMsg = String(data.error.message)
          }
        }

        throw new Error(serverMsg)
      }

      if (
        typeof responseData !== 'object' ||
        responseData === null ||
        !('ok' in responseData) ||
        responseData.ok !== true
      ) {
        const serverMsg =
          typeof responseData === 'object' &&
          responseData !== null &&
          'error' in responseData &&
          typeof responseData.error === 'object' &&
          responseData.error !== null &&
          'message' in responseData.error &&
          typeof responseData.error.message === 'string'
            ? responseData.error.message
            : 'Something went wrong. Please try again or email us directly.'

        throw new Error(serverMsg)
      }

      form.reset()
      hasSubmittedRef.current = true
      setHasTouchedMessage(false)
      setSubmitError(null)
      setSubmitSuccessMessage('Thanks. Your request was sent successfully.')
      trackEvent('contact_form_submit_success', {
        service: payload.service || undefined,
        serviceLabel: payload.serviceLabel || undefined,
        package: payload.package || undefined,
        packageLabel: payload.packageLabel || undefined,
      })
      navigate('/contact-success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please email us directly.'
      setSubmitError(message)
      trackEvent('contact_form_submit_error', {
        error_type: err instanceof Error ? err.name || 'api_error' : 'unknown_error',
        service: queryContext.serviceParam || undefined,
        serviceLabel: queryContext.serviceLabel || undefined,
        package: queryContext.packageParam || undefined,
        packageLabel: queryContext.packageLabel || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormFocus = () => {
    if (hasTrackedStart) return
    hasStartedRef.current = true
    setHasTrackedStart(true)
    trackEvent('contact_form_start', {
      service: queryContext.serviceParam || undefined,
      serviceLabel: queryContext.serviceLabel || undefined,
      package: queryContext.packageParam || undefined,
      packageLabel: queryContext.packageLabel || undefined,
    })
  }

  const handleFieldInput = (name: string) => {
    clearFieldError(name)
    if (submitError) setSubmitError(null)
  }

  const handleMessageFocus = () => {
    if (!messageRef.current) return

    if (!hasTouchedMessage && starterMessage && messageRef.current.value === starterMessage) {
      messageRef.current.value = ''
    }

    setHasTouchedMessage(true)
    handleFieldInput('message')
  }

  const [starterMessageInjected, setStarterMessageInjected] = useState(false)

  const isStarterMessageVisible = Boolean(
    starterMessage &&
      !hasTouchedMessage &&
      starterMessageInjected &&
      messageRef.current &&
      messageRef.current.value === starterMessage,
  )

  useEffect(() => {
    if (!messageRef.current) return
    if (hasTouchedMessage) return
    if (messageRef.current.value.trim() && messageRef.current.value !== starterMessage) return

    messageRef.current.value = starterMessage
    setStarterMessageInjected(true)
  }, [hasTouchedMessage, starterMessage])

  useEffect(() => {
    trackEvent('contact_view', {
      service: queryContext.serviceParam || undefined,
      serviceLabel: queryContext.serviceLabel || undefined,
      package: queryContext.packageParam || undefined,
      packageLabel: queryContext.packageLabel || undefined,
    })
  }, [queryContext])

  useEffect(() => {
    const abandonParams = {
      service: queryContext.serviceParam || undefined,
      serviceLabel: queryContext.serviceLabel || undefined,
      package: queryContext.packageParam || undefined,
      packageLabel: queryContext.packageLabel || undefined,
    }

    const maybeTrackAbandon = () => {
      if (!hasStartedRef.current || hasSubmittedRef.current || hasAbandonFiredRef.current) return

      hasAbandonFiredRef.current = true
      trackEvent('contact_form_abandon', abandonParams)
    }

    const handleBeforeUnload = () => {
      maybeTrackAbandon()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        maybeTrackAbandon()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [queryContext])

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

          <form className="contact__form" onSubmit={handleSubmit} onFocus={handleFormFocus} noValidate>
            <div className="contact__field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                aria-invalid={fieldErrors.firstName ? 'true' : undefined}
                aria-describedby={fieldErrors.firstName ? getFieldErrorId('firstName') : undefined}
                onChange={() => handleFieldInput('firstName')}
              />
              {fieldErrors.firstName && (
                <span className="contact__field-error" id={getFieldErrorId('firstName')} role="alert">
                  {fieldErrors.firstName}
                </span>
              )}
            </div>

            <div className="contact__field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                aria-invalid={fieldErrors.lastName ? 'true' : undefined}
                aria-describedby={fieldErrors.lastName ? getFieldErrorId('lastName') : undefined}
                onChange={() => handleFieldInput('lastName')}
              />
              {fieldErrors.lastName && (
                <span className="contact__field-error" id={getFieldErrorId('lastName')} role="alert">
                  {fieldErrors.lastName}
                </span>
              )}
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
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
              <label htmlFor="message">Message <span aria-hidden="true">*</span></label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your exhibition, performance, or event. Include date, venue, and goals."
                rows={3}
                required
                ref={messageRef}
                className={isStarterMessageVisible ? 'isStarterMessage' : undefined}
                aria-invalid={fieldErrors.message ? 'true' : undefined}
                aria-describedby={fieldErrors.message ? getFieldErrorId('message') : undefined}
                onFocus={handleMessageFocus}
                onChange={() => {
                  setHasTouchedMessage(true)
                  handleFieldInput('message')
                }}
              />
              {fieldErrors.message && (
                <span className="contact__field-error" id={getFieldErrorId('message')} role="alert">
                  {fieldErrors.message}
                </span>
              )}
            </div>

            <div
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
              aria-hidden="true"
            >
              <label htmlFor="companyWebsite">Company website</label>
              <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <p className="contact__error" role="alert" aria-live="assertive">
              {submitError ?? ''}
            </p>
            <p className="contact__success" role="status" aria-live="polite">
              {submitSuccessMessage ?? ''}
            </p>

            <button className="contact__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Request availability'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Contact
