import { useRef, useState } from 'react'
import { hasAnalyticsConsent, trackEvent } from '../utils/analytics'

// Copy is passed in from the page config (same pattern as the rest of
// AdLandingPageConfig) so this component carries no i18n wiring of its own.
export type AdLeadFormCopy = {
  /** Locale-correct project-type label sent to /api/contact (e.g. "Exhibition / Gallery"). */
  serviceLabel: string
  heading: string
  body?: string
  nameLabel: string
  emailLabel: string
  dateLabel: string
  dateHint?: string
  /** Placeholder for the (free-text, not type="date") date field — see note below. */
  datePlaceholder?: string
  submitLabel: string
  sendingLabel: string
  successHeading: string
  successBody: string
  errorGeneric: string
  /** Small text link under the form, to the full /contact page as a fallback. */
  fullFormLabel: string
  fullFormHref: string
}

type AdLeadFormProps = {
  slug: string
  serviceSlug: string
  packageSlug?: string
  copy: AdLeadFormCopy
}

const createEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const resolveApi = (path: string) => {
  const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
  if (!raw) return path
  const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
  return `${base.replace(/\/+$/, '')}${path}`
}

export default function AdLeadForm({ slug, serviceSlug, packageSlug, copy }: AdLeadFormProps) {
  const { serviceLabel } = copy
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  const onFirstInteraction = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('landing_page_lead_start', { page_slug: slug, service_slug: serviceSlug })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const date = String(formData.get('openingDate') || '').trim()
    const companyWebsite = String(formData.get('companyWebsite') || '').trim()

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(copy.errorGeneric)
      trackEvent('landing_page_lead_error', { page_slug: slug, error_type: 'validation' })
      return
    }

    setIsSubmitting(true)
    try {
      const eventId = createEventId()
      const message = [
        `Quick booking from the ${slug} landing page.`,
        date ? `Opening / install date: ${date}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      const response = await fetch(resolveApi('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          projectType: serviceLabel,
          message,
          service: serviceSlug,
          serviceLabel,
          ...(packageSlug ? { package: packageSlug } : {}),
          sourceUrl: window.location.href,
          referrer: document.referrer,
          eventId,
          ...(companyWebsite ? { companyWebsite } : {}),
        }),
      })

      if (!response.ok) {
        let msg = copy.errorGeneric
        try {
          const data = (await response.json()) as { error?: string | { message?: string } }
          if (typeof data.error === 'string') msg = data.error
          else if (data.error?.message) msg = String(data.error.message)
        } catch {
          /* keep generic */
        }
        throw new Error(msg)
      }

      setSubmitted(true)
      trackEvent('landing_page_lead_submit', {
        page_slug: slug,
        service_slug: serviceSlug,
        package_slug: packageSlug,
        has_date: date ? 'true' : 'false',
      })

      // Meta: client Lead + server CAPI mirror, same eventID for dedup. Both
      // gate on consent themselves, exactly like the /contact page does.
      if (hasAnalyticsConsent()) {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', { content_name: serviceLabel, content_category: serviceSlug }, { eventID: eventId })
        }
        if (typeof window.clarity === 'function') {
          window.clarity('event', `landing_page_lead_submit_${slug}`)
        }
        fetch(resolveApi('/api/track-lead'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Lead',
            email,
            sourceUrl: window.location.href,
            eventId,
            projectType: serviceLabel,
            service: serviceSlug,
            package: packageSlug,
          }),
        }).catch(() => {
          /* best effort */
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric)
      trackEvent('landing_page_lead_error', { page_slug: slug, error_type: 'api_error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section alp__quick-book" id="quick-book">
      <div className="content alp__quick-book-inner">
        {submitted ? (
          <div className="alp__quick-book-success" role="status">
            <h2>{copy.successHeading}</h2>
            <p>{copy.successBody}</p>
          </div>
        ) : (
          <>
            <div className="alp__quick-book-copy">
              <h2>{copy.heading}</h2>
              {copy.body && <p>{copy.body}</p>}
            </div>
            <form className="alp__quick-book-form" onSubmit={handleSubmit} onFocus={onFirstInteraction} noValidate>
              <label className="alp__quick-book-field">
                <span>{copy.nameLabel}</span>
                <input id="quick-book-name" name="name" type="text" autoComplete="name" required />
              </label>
              <label className="alp__quick-book-field">
                <span>{copy.emailLabel}</span>
                <input name="email" type="email" inputMode="email" autoComplete="email" required />
              </label>
              <label className="alp__quick-book-field">
                <span>
                  {copy.dateLabel}
                  {copy.dateHint && <em> {copy.dateHint}</em>}
                </span>
                {/* Free text, not type="date" — the Instagram/Facebook in-app
                    WebView (100% of this campaign's traffic) doesn't
                    reliably surface a native date picker on tap, which reads
                    as a dead field. A plain text field always works. */}
                <input name="openingDate" type="text" inputMode="text" placeholder={copy.datePlaceholder} autoComplete="off" />
              </label>

              {/* Honeypot */}
              <div className="alp__quick-book-hp" aria-hidden="true">
                <label htmlFor="quick-book-company">Company website</label>
                <input id="quick-book-company" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {error && (
                <p className="alp__quick-book-error" role="alert">
                  {error}
                </p>
              )}

              <button className="alp__button alp__button--primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? copy.sendingLabel : copy.submitLabel}
              </button>
              <a className="alp__quick-book-fulllink" href={copy.fullFormHref}>
                {copy.fullFormLabel}
              </a>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
