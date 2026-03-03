import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../pages/Home.css'
import { pricingTiers } from '../data/pricingTiers'
import { pricingByService, type PricingOverridesByService } from '../data/pricingByService'
import { trackEvent, useElementViewTracking } from '../utils/analytics'

type PricingSectionProps = {
  id?: string
  headline?: string
  serviceSlug?: string
}

function PricingSection({ id, headline, serviceSlug }: PricingSectionProps) {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement | null>(null)
  const headlineText = headline ?? 'Straightforward pricing for one-time and recurring work.'
  const serviceOverrides = (pricingByService as PricingOverridesByService)[serviceSlug ?? ''] ?? {}
  const tiers = pricingTiers.map((tier) => ({ ...tier, ...(serviceOverrides[tier.slug] ?? {}) }))

  useElementViewTracking(sectionRef, 'service_pricing_view', {
    service_slug: serviceSlug,
  })

  const handleSelectPlan = (slug: string, tierLabel: string) => {
    trackEvent('service_tier_click', {
      service_slug: serviceSlug,
      tier_id: slug,
      tier_label: tierLabel,
    })

    const params = new URLSearchParams()
    params.set('package', slug)
    if (serviceSlug) {
      params.set('service', serviceSlug)
    }
    const url = `/contact?${params.toString()}`
    navigate(url)
  }

  return (
    <section className="home__section home__pricing" id={id} ref={sectionRef}>
      <div className="home__pricing-header">
        <div>
          <p>Pricing</p>
          <h2>{headlineText}</h2>
        </div>
        <p>Most clients book this as a one-time project. Monthly options are for recurring work.</p>
      </div>
      <div className="home__pricing-grid">
        {tiers.map((tier) => {
            const isMonthly = tier.slug === 'monthly-coverage'
            const classes = ['home__pricing-card']
            if (tier.badge) classes.push('is-popular')
            if (isMonthly) classes.push('home__pricing-card--monthly')
            const isCustom = tier.price.toLowerCase() === 'custom'
            if (isCustom) classes.push('home__pricing-card--custom')
            const suffix = tier.slug === 'single-event' ? '/project' : tier.slug === 'monthly-coverage' ? '/mo' : ''

            return (
              <article key={tier.name} className={classes.join(' ')}>
              {tier.badge && <span className="home__pricing-badge">{tier.badge}</span>}
              <div className="home__pricing-meta">
                <h3>{tier.name}</h3>
                <p>{tier.cadence}</p>
              </div>
                <div className="home__pricing-value">
                  {isCustom ? (
                    <span>{tier.price}</span>
                  ) : (
                    <span>
                      From{' '}
                      <span className="home__pricing-amount">
                        {tier.price}
                        {suffix ? <small>{suffix}</small> : null}
                      </span>
                    </span>
                  )}
              </div>
              <p className="home__pricing-helper">
                Choose this if: {tier.chooseThisIf}
              </p>
              <p className="home__pricing-copy">{tier.description}</p>
              <ul>
                {tier.features.map((feature: string) => (
                  <li key={feature}>
                    <span>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => handleSelectPlan(tier.slug, tier.name)}>
                {tier.cta}
              </button>
            </article>
          )
        })}
      </div>
      <p className="home__pricing-footnote">
        Clear scope, clear pricing, simple proposal. Educational and artist-led initiatives receive preferred rates.
      </p>
    </section>
  )
}

export default PricingSection
