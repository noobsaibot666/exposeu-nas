import './Footer.css'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceList } from '../data/serviceMeta'
import { useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'

function Footer() {
  const { t } = useTranslation()
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__media">
        <img
          src={resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_033.png')}
          alt={t('footer.imageAlt')}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="footer__content">
        <div className="footer__intro">
          <p className="footer__brand">{t('footer.brand')}</p>
          <p className="footer__tagline">{t('footer.tagline')}</p>
          <p className="footer__trust">{t('footer.trust')}</p>
          <p className="footer__cta">
            {t('footer.ctaPrefix')} <LocalizedLink to="/contact">{t('footer.ctaLink')}</LocalizedLink>.
          </p>
        </div>
        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">{t('footer.documentationTypes')}</p>
            {serviceList.map((service) => (
              <LocalizedLink key={service.slug} to={service.href}>
                {t(service.shortLabelKey)}
              </LocalizedLink>
            ))}
          </div>
          <div className="footer__group">
            <p className="footer__label">{t('footer.nextSteps')}</p>
            <LocalizedLink to="/contact">{t('footer.ctaLink')}</LocalizedLink>
<LocalizedLink to="/portfolio">{t('footer.viewPortfolio')}</LocalizedLink>
          </div>
          <div className="footer__group">
            <p className="footer__label">{t('footer.legal')}</p>
            <LocalizedLink to="/impressum">Impressum</LocalizedLink>
            <a href="https://instagram.com/xposeu_official" target="_blank" rel="noreferrer">
              {t('footer.instagram')}
            </a>
          </div>
        </div>
      </div>
      <button type="button" className="footer__to-top" onClick={scrollToTop} aria-label={t('footer.backToTop')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m5 12 7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer
