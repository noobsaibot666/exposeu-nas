import TopNav from '../components/TopNav'
import './PricingRequest.css'
import LocalizedLink from '../i18n/LocalizedLink'
import { useTranslation } from '../i18n/LocaleProvider'

function PricingRequestSuccess() {
  const { t } = useTranslation()
  return (
    <main className="pricing-request pricing-request--success" id="main">
      <div className="home__nav pricing-request__nav">
        <TopNav
          leftLinks={[
            { id: 'home', label: t('nav.home'), href: '/' },
            { id: 'services', label: t('nav.services'), href: '/#cases' },
          ]}
          rightLinks={[
            { id: 'about', label: t('nav.about'), href: '/about' },
            { id: 'contact', label: t('nav.contact'), href: '/contact' },
          ]}
          className="top-nav--page"
          activeId="services"
        />
      </div>

      <section className="section pricing-request__body">
        <div className="content pricing-request__success">
          <p className="pricing-request__eyebrow">{t('forms.pricing.success.eyebrow')}</p>
          <h1>{t('forms.pricing.success.headline')}</h1>
          <p>{t('forms.pricing.success.copy')}</p>
          <div className="pricing-request__success-actions">
            <LocalizedLink className="pricing-request__button" to="/">{t('forms.pricing.success.backHome')}</LocalizedLink>
            <LocalizedLink className="pricing-request__button pricing-request__button--ghost" to="/portfolio">{t('forms.pricing.success.viewPortfolio')}</LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PricingRequestSuccess
