import { useNavigate } from 'react-router-dom'
import '../pages/Home.css'
import { pricingTiers } from '../data/pricingTiers'
import { pricingByService, type PricingOverridesByService } from '../data/pricingByService'

type PricingSectionProps = {
  id?: string
  headline?: string
  serviceSlug?: string
}

function PricingSection({ id, headline, serviceSlug }: PricingSectionProps) {
  const navigate = useNavigate()
  const headlineText = headline ?? 'Straightforward packages for Berlin creators.'
  const serviceOverrides = (pricingByService as PricingOverridesByService)[serviceSlug ?? ''] ?? {}
  const tiers = pricingTiers.map((tier) => ({ ...tier, ...(serviceOverrides[tier.slug] ?? {}) }))

  const handleSelectPlan = (slug: string) => {
    const params = new URLSearchParams()
    params.set('package', slug)
    if (serviceSlug) {
      params.set('service', serviceSlug)
    }
    const url = `/contact?${params.toString()}`
    navigate(url)
  }

  return (
    <section className="home__section home__pricing" id={id}>
      <div className="home__pricing-header">
        <div>
          <p>Pricing</p>
          <h2>{headlineText}</h2>
        </div>
      </div>
      <div className="home__pricing-grid">
        {tiers.map((tier) => {
            const isMonthly = tier.name === 'Monthly'
            const classes = ['home__pricing-card']
            if (tier.badge) classes.push('is-popular')
            if (isMonthly) classes.push('home__pricing-card--monthly')
            const isCustom = tier.price.toLowerCase() === 'custom'
            const priceLabel = isCustom ? tier.price : `Packages starting from ${tier.price}`

            return (
              <article key={tier.name} className={classes.join(' ')}>
              {tier.badge && <span className="home__pricing-badge">{tier.badge}</span>}
              <div className="home__pricing-meta">
                <h3>{tier.name}</h3>
                <p>{tier.cadence}</p>
              </div>
                <div className="home__pricing-value">
                  <span>{priceLabel}</span>
                <small>{tier.cadence === 'Per event' ? '/project' : tier.cadence === 'Retainer' ? '' : '/mo'}</small>
              </div>
              <p className="home__pricing-helper">
                Final scope depends on duration, location, and delivery needs. We confirm everything transparently before production.
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
              <button type="button" onClick={() => handleSelectPlan(tier.slug)}>
                {tier.cta}
              </button>
            </article>
          )
        })}
      </div>
      <p className="home__pricing-footnote">
        Start with a single event or scale into monthly documentation. Educational and artist-led initiatives receive preferred
        rates.
      </p>
    </section>
  )
}

export default PricingSection
