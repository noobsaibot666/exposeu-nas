import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './Contact.css'
import gsap from 'gsap'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { hasAnalyticsConsent, trackEvent } from '../utils/analytics'
import { useLocale, useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'
import AvailabilityBadge from '../components/AvailabilityBadge'
import { serviceMeta, type ServiceSlug } from '../data/serviceMeta'

const TYPE_MAP: Record<string, string> = {
  'concert': 'Concert / Event',
  'exhibition': 'Exhibition / Gallery',
  'artist-session': 'Artist Session',
  'brand-event': 'Brand / Agency',
}

const createMetaEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Contact() {
  const navigate = useLocaleNavigate()
  const { locale } = useLocale()
  const [searchParams] = useSearchParams()
  const rootRef = useRef<HTMLElement | null>(null)
  const selectRef = useRef<HTMLDivElement | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [messageValue, setMessageValue] = useState('')
  const hasStartedRef = useRef(false)
  const hasSubmittedRef = useRef(false)
  const hasAbandonFiredRef = useRef(false)
  const { t, tm } = useTranslation()
  const projectTypeOptions = tm<string[]>('forms.contact.projectTypes')

  const typeParam = searchParams.get('type')
  const serviceParam = searchParams.get('service')
  const packageParam = searchParams.get('package')
  const selectedService = serviceParam && serviceParam in serviceMeta ? serviceMeta[serviceParam as ServiceSlug] : null
  const selectedServiceLabel = selectedService ? t(selectedService.labelKey) : ''
  const defaultProjectType = selectedServiceLabel || (typeParam ? (TYPE_MAP[typeParam] ?? '') : '')
  const [selectedType, setSelectedType] = useState(defaultProjectType)
  const [lastDefaultProjectType, setLastDefaultProjectType] = useState(defaultProjectType)

  // Re-sync selectedType when the URL-derived default changes (service/type
  // param or locale switch), without clobbering it on every render — adjusted
  // during render per https://react.dev/learn/you-might-not-need-an-effect,
  // not in an effect (which triggers an extra commit and cascading renders).
  if (defaultProjectType !== lastDefaultProjectType) {
    setLastDefaultProjectType(defaultProjectType)
    if (defaultProjectType) setSelectedType(defaultProjectType)
  }

  const navLinks = useMemo(
    () => ({
      left: [
        { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
        { id: 'services', label: t('nav.services'), href: '/#cases' },
      ],
      right: [
        { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
        { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
      ],
    }),
    [navigate, t],
  )

  const resolveContactEndpoint = () => {
    const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
    if (!raw) return '/api/contact'
    const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
    return `${base.replace(/\/+$/, '')}/api/contact`
  }

  const resolveTrackLeadEndpoint = () => {
    const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
    if (!raw) return '/api/track-lead'
    const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
    return `${base.replace(/\/+$/, '')}/api/track-lead`
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
    if (!name) nextErrors.name = t('forms.contact.errors.nameRequired')
    if (!email) {
      nextErrors.email = t('forms.contact.errors.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t('forms.contact.errors.emailInvalid')
    }
    if (!projectType) nextErrors.projectType = t('forms.contact.errors.projectTypeRequired')

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      trackEvent('contact_form_submit_error', { error_type: 'validation', projectType })
      setSubmitError(t('forms.contact.errors.highlightedFields'))
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const metaEventId = createMetaEventId()
      const payload = {
        name,
        email,
        projectType,
        message,
        sourceUrl: window.location.href,
        referrer: document.referrer,
        eventId: metaEventId,
        ...(selectedService ? { service: selectedService.slug, serviceLabel: selectedServiceLabel } : {}),
        ...(packageParam ? { package: packageParam } : {}),
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
        let serverMsg = t('forms.contact.errors.generic')
        if (typeof responseData === 'object' && responseData !== null) {
          const data = responseData as { error?: string | { message?: string } }
          if (typeof data.error === 'string') serverMsg = data.error
          else if (data.error?.message) serverMsg = String(data.error.message)
        }
        throw new Error(serverMsg)
      }

      hasSubmittedRef.current = true
      setSubmitted(true)
      trackEvent('contact_form_submit_success', {
        projectType,
        service_slug: selectedService?.slug,
        package_slug: packageParam,
      })

      // gtag/fbq are called directly here (not via trackEvent) because this
      // needs fbq's track/eventID shape for Meta CAPI dedup — but that means
      // it must gate on consent itself, the same way trackEvent does.
      if (hasAnalyticsConsent()) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'form_submit_contact', {
            event_category: 'contact',
            event_label: projectType,
            service_slug: selectedService?.slug,
            package_slug: packageParam,
          })
        }
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: projectType,
            content_category: selectedService?.slug,
            content_type: packageParam || undefined,
          }, { eventID: metaEventId })
        }
      }

      // Server-side Meta CAPI mirrors the client-side fbq call above (same
      // eventID, for dedup) — gate it the same way so a rejected consent
      // banner can't be bypassed by just moving the same tracking server-side.
      if (hasAnalyticsConsent()) {
        fetch(resolveTrackLeadEndpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Lead',
            email,
            sourceUrl: window.location.href,
            eventId: metaEventId,
            projectType,
            service: selectedService?.slug,
            package: packageParam,
          }),
        }).then((r) => {
          if (!r.ok) console.warn('Meta CAPI Lead tracking returned non-ok status', r.status)
        }).catch((error) => {
          console.warn('Meta CAPI Lead tracking request failed', error)
        })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t('forms.contact.errors.generic')
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
    if (!isSelectOpen) return
    const handle = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsSelectOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isSelectOpen])

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
      <SEOMeta
        title="Contact"
        description="Get in touch with expose.u — Berlin-based concert and exhibition documentation. Fast response, no sales pressure."
        ogTitle="Start a Project | expose.u"
        ogDescription="Tell us what you're working on. We reply within 24 hours. No sales pressure."
        canonical="https://expose-u.com/contact"
        lang={locale}
      />
      <div className="home__nav contact__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="contact"
        />
      </div>

      <section className="section contact__body">
        <div className="content contact__heading">
          <h1>{t('contact.headline')}</h1>
          <p className="contact__lede">{t('contact.ledePrimary')}</p>
          <AvailabilityBadge />
        </div>

        <div className="content contact__grid">
          <div className="contact__info">
            <div className="contact__list">
              <div>
                <p className="contact__label">{t('contact.labels.email')}</p>
                <a href="mailto:hello@expose-u.com">hello@expose-u.com</a>
              </div>
              <div>
                <p className="contact__label">{t('contact.labels.phone')}</p>
                <a href="tel:+4917622132950">+49 176 2213 2950</a>
              </div>
              <div>
                <p className="contact__label">{t('contact.labels.studio')}</p>
                <p className="contact__address">{t('contact.studioAddress')}</p>
              </div>
              <div>
                <p className="contact__label">{t('contact.labels.instagram')}</p>
                <a href="https://instagram.com/xposeu_official" target="_blank" rel="noopener noreferrer">
                  xposeu_official
                </a>
              </div>
            </div>
          </div>

          {submitted ? (
            <p className="contact__success contact__success--standalone" role="status">
              {t('contact.successStandalone')}
            </p>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} onFocus={handleFormFocus} noValidate>
              <div className="contact__field">
                <label htmlFor="name">{t('forms.contact.fields.name')}</label>
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
                <label htmlFor="email">{t('forms.contact.fields.email')}</label>
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
                <label htmlFor="projectType-trigger">{t('forms.contact.fields.projectType')}</label>
                <div
                  ref={selectRef}
                  className={`contact__select-wrap${isSelectOpen ? ' is-open' : ''}${fieldErrors.projectType ? ' has-error' : ''}`}
                >
                  <input type="hidden" name="projectType" value={selectedType} />
                  <button
                    type="button"
                    id="projectType-trigger"
                    className="contact__select-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isSelectOpen}
                    aria-invalid={fieldErrors.projectType ? 'true' : undefined}
                    aria-describedby={fieldErrors.projectType ? getFieldErrorId('projectType') : undefined}
                    onClick={() => setIsSelectOpen((v) => !v)}
                  >
                    <span className={selectedType ? '' : 'contact__select-placeholder'}>
                      {selectedType || t('forms.contact.fields.projectTypePlaceholder')}
                    </span>
                    <svg className="contact__select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {isSelectOpen && (
                    <ul role="listbox" className="contact__select-dropdown" aria-label={t('forms.contact.fields.projectType')}>
                      {projectTypeOptions.map((opt) => (
                        <li
                          key={opt}
                          role="option"
                          aria-selected={selectedType === opt}
                          className={`contact__select-option${selectedType === opt ? ' is-selected' : ''}`}
                          onClick={() => {
                            setSelectedType(opt)
                            setIsSelectOpen(false)
                            handleFieldInput('projectType')
                          }}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {fieldErrors.projectType && (
                  <span className="contact__field-error" id={getFieldErrorId('projectType')} role="alert">
                    {fieldErrors.projectType}
                  </span>
                )}
              </div>

              <div className="contact__field contact__field--full">
                <label htmlFor="message">{t('forms.contact.fields.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={t('forms.contact.fields.starterMessage')}
                  value={messageValue}
                  onChange={(e) => { setMessageValue(e.target.value); handleFieldInput('message') }}
                />
              </div>

              {/* Honeypot */}
              <div
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
                aria-hidden="true"
              >
                <label htmlFor="companyWebsite">{t('forms.contact.fields.companyWebsite')}</label>
                <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <p className="contact__error" role="alert" aria-live="assertive">
                {submitError ?? ''}
              </p>

              <button className="contact__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="contact__spinner" aria-hidden="true" />
                    {t('forms.contact.submit.sending')}
                  </>
                ) : (
                  t('forms.contact.submit.idle')
                )}
              </button>

              <div className="contact__whatsapp">
                <a
                  href="https://wa.me/48786696765"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contact.whatsapp')}
                </a>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Contact
