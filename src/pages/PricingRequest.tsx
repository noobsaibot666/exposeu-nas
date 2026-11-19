import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import TopNav from '../components/TopNav'
import { useNavOverMedia } from '../hooks/useNavOverMedia'
import { SUBMITTED_STATE } from '../hooks/useSubmittedGuard'
import { resolveImagePath } from '../utils/resolveImagePath'
import { trackEvent } from '../utils/analytics'
import { serviceMeta, type ServiceSlug } from '../data/serviceMeta'
import { pricingTiers } from '../data/pricingTiers'
import './PricingRequest.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'

const serviceImages: Record<ServiceSlug, string> = {
  'concerts-events': resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.webp'),
  'exhibition-gallery': resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.webp'),
  'artist-sessions': resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.webp'),
  'brand-agency': resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.webp'),
  'release-content-kit': resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0022.webp'),
  popups: resolveImagePath('/src/assets/images/landing/agency_hero_02.webp'),
  'gallery-museum': resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_055.webp'),
  'artist-musician': resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.webp'),
}

// Same contact API base resolution as Contact.tsx / AdLeadForm.tsx.
const resolveApi = (path: string) => {
  const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
  if (!raw) return path
  const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
  return `${base.replace(/\/+$/, '')}${path}`
}

function PricingRequest() {
  const navigate = useLocaleNavigate()
  const { t, tm } = useTranslation()
  const { plan } = useParams()
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service') ?? ''
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [retryBlocked, setRetryBlocked] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)
  useNavOverMedia(heroRef)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const hasTrackedPlanSelect = useRef(false)

  // Only known tiers have intro copy; tm() throws on a missing key, so an old
  // or mistyped /pricing-request/<plan> link would otherwise blank the page.
  // Unknown plans fall back to the generic request form.
  const knownPlan = plan && pricingTiers.some((tier) => tier.slug === plan) ? plan : null
  const planInfo = knownPlan ? tm<{ name: string; intro: string }>(`forms.pricing.planIntros.${knownPlan}`) : null
  const serviceInfo = useMemo(() => {
    if (!serviceParam || !(serviceParam in serviceMeta)) return null
    const serviceSlug = serviceParam as ServiceSlug

    return {
      label: t(serviceMeta[serviceSlug].labelKey),
      image: serviceImages[serviceSlug],
      intro: t(`forms.pricing.serviceIntros.${serviceSlug}`),
    }
  }, [serviceParam, t])

  const headline = useMemo(() => {
    if (serviceInfo && planInfo) return t('forms.pricing.headlineByPlanAndService', { plan: planInfo.name, service: serviceInfo.label })
    if (planInfo) return t('forms.pricing.headlineByPlan', { plan: planInfo.name })
    if (serviceInfo) return t('forms.pricing.headlineByService', { service: serviceInfo.label })
    return t('forms.pricing.defaultHeadline')
  }, [planInfo, serviceInfo, t])

  const description = useMemo(() => {
    if (serviceInfo && planInfo) return `${serviceInfo.intro} ${planInfo.intro}`
    if (serviceInfo) return serviceInfo.intro
    if (planInfo) return planInfo.intro
    return t('forms.pricing.defaultDescription')
  }, [planInfo, serviceInfo, t])

  const heroImage = serviceInfo?.image ?? resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_004.webp')

  useEffect(() => {
    trackEvent('pricing_request_view', {
      tier_id: plan ?? undefined,
      tier_label: planInfo?.name,
      service: serviceParam || undefined,
      serviceLabel: serviceInfo?.label,
    })
  }, [plan, planInfo?.name, serviceInfo?.label, serviceParam])

  useEffect(() => {
    if (!planInfo || hasTrackedPlanSelect.current) return
    hasTrackedPlanSelect.current = true
    trackEvent('pricing_request_plan_select', {
      tier_id: plan ?? undefined,
      tier_label: planInfo.name,
      service: serviceParam || undefined,
      serviceLabel: serviceInfo?.label,
    })
  }, [plan, planInfo, serviceInfo?.label, serviceParam])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    trackEvent('pricing_request_cta_click', {
      cta_label: 'Send request',
      tier_id: plan ?? undefined,
      tier_label: planInfo?.name,
      service: serviceParam || undefined,
      serviceLabel: serviceInfo?.label,
    })

    // Capture the form now: React clears event.currentTarget once the handler's
    // synchronous part returns, so after the fetch below it would be null and
    // form.reset()/navigate() would never run.
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    const coverageType = String(formData.get('coverageType') ?? '')
    const coverageNotes = String(formData.get('coverageNotes') ?? '')
    const fullName = String(formData.get('fullName') ?? '')
    const email = String(formData.get('email') ?? '')
    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedCoverageNotes = coverageNotes.trim()
    payload.fullName = trimmedName
    payload.email = trimmedEmail
    payload.coverageNotes = trimmedCoverageNotes
    const nextErrors: Record<string, string> = {}

    if (!coverageType) nextErrors.coverageType = t('forms.pricing.errors.coverageTypeRequired')
    if (!trimmedName) nextErrors.fullName = t('forms.pricing.errors.nameRequired')
    if (!trimmedEmail) nextErrors.email = t('forms.pricing.errors.emailRequired')
    if (coverageType === 'Other' && !trimmedCoverageNotes) {
      nextErrors.coverageNotes = t('forms.pricing.errors.coverageNotesRequired')
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setStatus('idle')
      // Move focus to the first invalid field so keyboard/screen-reader users land on the error.
      const firstInvalid = ['coverageType', 'fullName', 'email', 'coverageNotes'].find((name) => nextErrors[name])
      if (firstInvalid) (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus()
      return
    }

    setFieldErrors({})
    setStatus('sending')

    // Primary delivery: the contact API (email + Supabase log), same as
    // /contact. It returns a real result, so the visitor only sees success
    // when the request was actually accepted (V2-004 / V2-030 — the Google
    // Apps Script endpoint answered 403 to every public request).
    const field = (key: string) => String(formData.get(key) ?? '').trim()
    const planName = planInfo?.name ?? plan ?? ''
    const message = [
      `Pricing request${planName ? ` — ${planName}` : ''}${serviceInfo?.label ? ` · ${serviceInfo.label}` : ''}`,
      `Coverage type: ${coverageType}`,
      trimmedCoverageNotes ? `Coverage notes: ${trimmedCoverageNotes}` : '',
      field('phone') ? `Phone: ${field('phone')}` : '',
      field('organization') ? `Organization: ${field('organization')}` : '',
      field('date') ? `Date: ${field('date')}` : '',
      field('location') ? `Location: ${field('location')}` : '',
      field('details') ? `\nDetails:\n${field('details')}` : '',
    ].filter(Boolean).join('\n')

    let requestId: string | undefined
    try {
      const response = await fetch(resolveApi('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          projectType: `Pricing request: ${coverageType}`,
          message,
          ...(serviceParam ? { service: serviceParam } : {}),
          ...(serviceInfo?.label ? { serviceLabel: serviceInfo.label } : {}),
          ...(plan ? { package: plan } : {}),
          ...(planName ? { packageLabel: planName } : {}),
          sourceUrl: window.location.href,
          referrer: document.referrer,
        }),
      })
      const data = (await response.json().catch(() => null)) as { ok?: boolean; requestId?: string; error?: { code?: string } } | null
      requestId = data?.requestId
      if (!response.ok || data?.ok !== true) {
        const message = data?.error?.code === 'CONTACT_PERSISTENCE_FAILED'
          ? t('forms.pricing.errors.persistenceFailed')
          : t('forms.pricing.errors.requestFailed')
        if (data?.error?.code === 'CONTACT_PERSISTENCE_FAILED') setRetryBlocked(true)
        throw new Error(message)
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage(
        requestId
          ? `${error instanceof Error ? error.message : t('forms.pricing.errors.requestFailed')} ${t('forms.contact.errors.referenceId', { id: requestId })}`
          : t('forms.pricing.errors.requestFailed'),
      )
      return
    }

    // Secondary copy to the pricing sheet, if configured. Best effort only:
    // Apps Script needs no-cors, so its result can't be read and never gates
    // the visitor's success state.
    const sheetEndpoint = (import.meta.env.VITE_PRICING_FORM_ENDPOINT as string | undefined)?.trim()
    if (sheetEndpoint) {
      const useNoCors = sheetEndpoint.includes('script.google.com')
      fetch(sheetEndpoint, {
        method: 'POST',
        mode: useNoCors ? 'no-cors' : 'cors',
        headers: useNoCors ? { 'Content-Type': 'application/x-www-form-urlencoded' } : { 'Content-Type': 'application/json' },
        body: useNoCors ? new URLSearchParams(payload as Record<string, string>).toString() : JSON.stringify(payload),
        keepalive: true,
      }).catch(() => { /* sheet copy is optional */ })
    }

    trackEvent('form_submission', 'pricing', planInfo?.name ?? plan ?? 'unknown')
    setStatus('success')
    form.reset()
    navigate('/pricing-request/success', { state: SUBMITTED_STATE })
  }

  const clearFieldError = (name: string) => {
    if (!fieldErrors[name]) return
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const fieldClass = (name: string) => (fieldErrors[name] ? 'pricing-request__field is-error' : 'pricing-request__field')

  return (
    <main className="pricing-request" id="main">
      <div className="home__nav pricing-request__nav">
        <TopNav
          leftLinks={[
            { id: 'home', label: t('nav.home'), onClick: () => navigate('/') },
            { id: 'services', label: t('nav.services'), href: '/#cases' },
            { id: 'portfolio', label: t('nav.lastProjects'), onClick: () => navigate('/portfolio') },
          ]}
          rightLinks={[
            { id: 'about', label: t('nav.about'), onClick: () => navigate('/about') },
            { id: 'contact', label: t('nav.contact'), onClick: () => navigate('/contact') },
          ]}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="pricing-request__hero" ref={heroRef} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="pricing-request__hero-overlay" />
        <div className="pricing-request__hero-content content">
          <p className="pricing-request__eyebrow">{t('forms.pricing.eyebrow')}</p>
          <h1>{headline}</h1>
          <p>{description}</p>
          <div className="pricing-request__meta">
            <span>{planInfo?.name ?? t('forms.pricing.planSelectedFallback')}</span>
            <span>{serviceInfo?.label ?? t('forms.pricing.generalInquiry')}</span>
          </div>
        </div>
      </section>

      <section className="section pricing-request__body">
        <div className="content pricing-request__grid">
          <div className="pricing-request__copy">
            <h2>{t('forms.pricing.essentialsHeadline')}</h2>
            <p>{t('forms.pricing.essentialsCopy')}</p>
          </div>

          <form className="pricing-request__form" onSubmit={handleSubmit}>
            <input type="hidden" name="plan" value={planInfo?.name ?? plan ?? ''} />
            <input type="hidden" name="service" value={serviceInfo?.label ?? serviceParam ?? ''} />
            <div className={`${fieldClass('coverageType')} pricing-request__field--full`}>
              <label htmlFor="coverageType">{t('forms.pricing.coverageTypeLabel')}</label>
              <select
                id="coverageType"
                name="coverageType"
                required
                onChange={() => clearFieldError('coverageType')}
                aria-invalid={fieldErrors.coverageType ? 'true' : undefined}
                aria-describedby={fieldErrors.coverageType ? 'coverageType-error' : undefined}
              >
                <option value="">{t('forms.pricing.coverageTypePlaceholder')}</option>
                {tm<string[]>('forms.pricing.coverageTypeOptions').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {fieldErrors.coverageType && <span className="pricing-request__field-error" id="coverageType-error" role="alert">{fieldErrors.coverageType}</span>}
            </div>
            <div className={fieldClass('fullName')}>
              <label htmlFor="fullName">{t('forms.pricing.fields.name')}</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder={t('forms.pricing.fields.namePlaceholder')}
                onChange={() => clearFieldError('fullName')}
                aria-invalid={fieldErrors.fullName ? 'true' : undefined}
                aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
              />
              {fieldErrors.fullName && <span className="pricing-request__field-error" id="fullName-error" role="alert">{fieldErrors.fullName}</span>}
            </div>
            <div className={fieldClass('email')}>
              <label htmlFor="email">{t('forms.pricing.fields.email')}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t('forms.pricing.fields.emailPlaceholder')}
                onChange={() => clearFieldError('email')}
                aria-invalid={fieldErrors.email ? 'true' : undefined}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && <span className="pricing-request__field-error" id="email-error" role="alert">{fieldErrors.email}</span>}
            </div>
            <div className="pricing-request__field">
              <label htmlFor="phone">{t('forms.pricing.fields.phone')}</label>
              <input id="phone" name="phone" type="tel" placeholder={t('forms.pricing.fields.phonePlaceholder')} />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="organization">{t('forms.pricing.fields.organization')}</label>
              <input id="organization" name="organization" type="text" placeholder={t('forms.pricing.fields.organizationPlaceholder')} />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="date">{t('forms.pricing.fields.date')}</label>
              <input id="date" name="date" type="text" placeholder={t('forms.pricing.fields.datePlaceholder')} />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="location">{t('forms.pricing.fields.location')}</label>
              <input id="location" name="location" type="text" placeholder={t('forms.pricing.fields.locationPlaceholder')} />
            </div>
            <div className={`${fieldClass('coverageNotes')} pricing-request__field--full`}>
              <label htmlFor="coverageNotes">{t('forms.pricing.fields.coverageNotes')}</label>
              <input
                id="coverageNotes"
                name="coverageNotes"
                type="text"
                placeholder={t('forms.pricing.fields.coverageNotesPlaceholder')}
                onChange={() => clearFieldError('coverageNotes')}
                aria-invalid={fieldErrors.coverageNotes ? 'true' : undefined}
                aria-describedby={fieldErrors.coverageNotes ? 'coverageNotes-error' : undefined}
              />
              {fieldErrors.coverageNotes && <span className="pricing-request__field-error" id="coverageNotes-error" role="alert">{fieldErrors.coverageNotes}</span>}
            </div>
            <div className="pricing-request__field pricing-request__field--full">
              <label htmlFor="details">{t('forms.pricing.fields.details')}</label>
              <textarea
                id="details"
                name="details"
                rows={4}
                placeholder={t('forms.pricing.fields.detailsPlaceholder')}
              />
            </div>
            <button type="submit" disabled={status === 'sending' || retryBlocked}>
              {status === 'sending' ? t('forms.pricing.submitSending') : t('forms.pricing.submitIdle')}
            </button>
            {status === 'error' && <p className="pricing-request__error" role="alert">{errorMessage}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

export default PricingRequest
