import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import TopNav from '../components/TopNav'
import { resolveImagePath } from '../utils/resolveImagePath'
import './PricingRequest.css'

const planDetails = {
  'single-event': {
    name: 'Single Event',
    intro: 'One focused shoot built around your timeline, key moments, and delivery needs.',
  },
  'monthly-coverage': {
    name: 'Monthly Coverage',
    intro: 'Recurring documentation with consistent crew, look, and delivery cadence.',
  },
  'retainer-studio': {
    name: 'Retainer Studio',
    intro: 'Ongoing support for multi-event programming, launches, and seasonal campaigns.',
  },
}

const serviceDetails = {
  exhibitions: {
    label: 'Exhibitions',
    image: resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_030.png'),
    intro: 'Curation-forward coverage designed for press kits, collector previews, and gallery archives.',
  },
  'gallery-stories': {
    label: 'Gallery Stories',
    image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_012.png'),
    intro: 'Narrative-led coverage with interviews and b-roll that keeps the curator voice intact.',
  },
  'artist-sessions': {
    label: 'Artist Sessions',
    image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_012.png'),
    intro: 'Portraits and BTS that capture process, personality, and the release story.',
  },
  performance: {
    label: 'Performance',
    image: resolveImagePath('/src/assets/images/services/4_performance_doc/4_PD_004.png'),
    intro: 'Live show coverage with sharp timing and fast turnarounds for socials and press.',
  },
  'fashion-show': {
    label: 'Fashion Show',
    image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
    intro: 'Runway coverage built for look-by-look documentation, press pushes, and same-day selects.',
  },
  atmospheric: {
    label: 'Atmospheric Films',
    image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/6_AF_018.png'),
    intro: 'Mood-first storytelling with slow pacing, rich tones, and immersive art direction.',
  },
}

function PricingRequest() {
  const navigate = useNavigate()
  const { plan } = useParams()
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service') ?? ''
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const planInfo = plan && plan in planDetails ? planDetails[plan as keyof typeof planDetails] : null
  const serviceInfo =
    serviceParam && serviceParam in serviceDetails ? serviceDetails[serviceParam as keyof typeof serviceDetails] : null

  const headline = useMemo(() => {
    if (serviceInfo && planInfo) return `${planInfo.name} coverage for ${serviceInfo.label}.`
    if (planInfo) return `${planInfo.name} coverage request.`
    if (serviceInfo) return `Coverage request for ${serviceInfo.label}.`
    return 'Request a pricing plan.'
  }, [planInfo, serviceInfo])

  const description = useMemo(() => {
    if (serviceInfo && planInfo) return `${serviceInfo.intro} ${planInfo.intro}`
    if (serviceInfo) return serviceInfo.intro
    if (planInfo) return planInfo.intro
    return 'Share your dates, location, and goals so we can build the right coverage plan.'
  }, [planInfo, serviceInfo])

  const heroImage = serviceInfo?.image ?? resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_004.png')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
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

    if (!coverageType) nextErrors.coverageType = 'Select a coverage type.'
    if (!trimmedName) nextErrors.fullName = 'Enter your name.'
    if (!trimmedEmail) nextErrors.email = 'Enter your email address.'
    if (coverageType === 'Other' && !trimmedCoverageNotes) {
      nextErrors.coverageNotes = 'Tell us what coverage you need.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setStatus('idle')
      return
    }

    setFieldErrors({})
    setStatus('sending')
    const endpoint = import.meta.env.VITE_PRICING_FORM_ENDPOINT as string | undefined

    if (!endpoint) {
      setStatus('error')
      setErrorMessage('Missing form endpoint. Add VITE_PRICING_FORM_ENDPOINT to your environment settings.')
      return
    }

    const useNoCors = endpoint.includes('script.google.com')
    try {
      const body = useNoCors ? new URLSearchParams(payload as Record<string, string>).toString() : JSON.stringify(payload)
      const response = await fetch(endpoint, {
        method: 'POST',
        mode: useNoCors ? 'no-cors' : 'cors',
        headers: useNoCors ? { 'Content-Type': 'application/x-www-form-urlencoded' } : { 'Content-Type': 'application/json' },
        body,
      })

      if (!useNoCors && !response.ok) {
        throw new Error('Request failed.')
      }
    } catch (error) {
      console.error(error)
      if (!useNoCors) {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again or email us directly.')
        return
      }
    }

    setStatus('success')
    event.currentTarget.reset()
    navigate('/pricing-request/success')
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
    <main className="pricing-request">
      <div className="home__nav pricing-request__nav">
        <TopNav
          leftLinks={[
            { label: 'Studio', onClick: () => navigate('/#hero') },
            { label: 'Cases', onClick: () => navigate('/#cases') },
            { label: 'Pricing', onClick: () => navigate('/#services') },
          ]}
          rightLinks={[
            { label: 'About', onClick: () => navigate('/about') },
            { label: 'Contact', onClick: () => navigate('/contact') },
          ]}
          onBrandClick={() => navigate('/')}
          brandLabel="expose.u"
          className="top-nav--page"
        />
      </div>

      <section className="pricing-request__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="pricing-request__hero-overlay" />
        <div className="pricing-request__hero-content content">
          <p className="pricing-request__eyebrow">Pricing request</p>
          <h1>{headline}</h1>
          <p>{description}</p>
          <div className="pricing-request__meta">
            <span>{planInfo?.name ?? 'Plan selected on request'}</span>
            <span>{serviceInfo?.label ?? 'General inquiry'}</span>
          </div>
        </div>
      </section>

      <section className="section pricing-request__body">
        <div className="content pricing-request__grid">
          <div className="pricing-request__copy">
            <h2>Tell us the essentials.</h2>
            <p>
              We’ll review your details and come back with a clear proposal, timeline, and next steps. The form keeps it short
              so we can reply fast.
            </p>
          </div>

          <form className="pricing-request__form" onSubmit={handleSubmit}>
            <input type="hidden" name="plan" value={planInfo?.name ?? plan ?? ''} />
            <input type="hidden" name="service" value={serviceInfo?.label ?? serviceParam ?? ''} />
            <div className={`${fieldClass('coverageType')} pricing-request__field--full`}>
              <label htmlFor="coverageType">Type of coverage</label>
              <select
                id="coverageType"
                name="coverageType"
                required
                onChange={() => clearFieldError('coverageType')}
                aria-invalid={fieldErrors.coverageType ? 'true' : undefined}
              >
                <option value="">Select a coverage type</option>
                <option value="Photo only">Photo only</option>
                <option value="Video only">Video only</option>
                <option value="Photo + video">Photo + video</option>
                <option value="Highlights + recap">Highlights + recap</option>
                <option value="Social-first reels">Social-first reels</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.coverageType && <span className="pricing-request__field-error">{fieldErrors.coverageType}</span>}
            </div>
            <div className={fieldClass('fullName')}>
              <label htmlFor="fullName">Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Full name"
                onChange={() => clearFieldError('fullName')}
                aria-invalid={fieldErrors.fullName ? 'true' : undefined}
              />
              {fieldErrors.fullName && <span className="pricing-request__field-error">{fieldErrors.fullName}</span>}
            </div>
            <div className={fieldClass('email')}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                onChange={() => clearFieldError('email')}
                aria-invalid={fieldErrors.email ? 'true' : undefined}
              />
              {fieldErrors.email && <span className="pricing-request__field-error">{fieldErrors.email}</span>}
            </div>
            <div className="pricing-request__field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" placeholder="Phone number" />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="organization">Organization</label>
              <input id="organization" name="organization" type="text" placeholder="Gallery, label, or studio" />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="date">Target date</label>
              <input id="date" name="date" type="text" placeholder="Event date or timeframe" />
            </div>
            <div className="pricing-request__field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" type="text" placeholder="City, venue, or region" />
            </div>
            <div className={`${fieldClass('coverageNotes')} pricing-request__field--full`}>
              <label htmlFor="coverageNotes">Coverage details (if other)</label>
              <input
                id="coverageNotes"
                name="coverageNotes"
                type="text"
                placeholder="Describe the coverage mix you need."
                onChange={() => clearFieldError('coverageNotes')}
                aria-invalid={fieldErrors.coverageNotes ? 'true' : undefined}
              />
              {fieldErrors.coverageNotes && <span className="pricing-request__field-error">{fieldErrors.coverageNotes}</span>}
            </div>
            <div className="pricing-request__field pricing-request__field--full">
              <label htmlFor="details">Project notes</label>
              <textarea
                id="details"
                name="details"
                rows={4}
                placeholder="Share the format, deliverables, and any timing constraints."
              />
            </div>
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send request'}
            </button>
            {status === 'error' && <p className="pricing-request__error">{errorMessage}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

export default PricingRequest
