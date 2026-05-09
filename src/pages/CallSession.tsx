import './Page.css'
import './CallSession.css'
import { useLocalePath, useTranslation } from '../i18n/LocaleProvider'

function CallSession() {
  const localizePath = useLocalePath()
  const { t } = useTranslation()
  return (
    <main className="page-shell">
      <section className="section call-session">
        <div className="content call-session__nav">
          <nav className="call-session__links call-session__links--left">
            <a href={localizePath('/')}>{t('nav.home')}</a>
            <a href={localizePath('/#cases')}>{t('nav.services')}</a>
            <a href={localizePath('/#claim')}>{t('callSession.navClaim')}</a>
            <a href={localizePath('/#offer')}>{t('callSession.navOffer')}</a>
          </nav>
          <a className="call-session__brand" href={localizePath('/')}>
            {t('nav.brand')}
          </a>
          <nav className="call-session__links call-session__links--right">
            <a href={localizePath('/about')}>{t('nav.about')}</a>
            <a href={localizePath('/contact')}>{t('nav.checkAvailability')}</a>
          </nav>
        </div>

        <div className="content call-session__grid">
          <div className="call-session__header">
            <h1>{t('callSession.header')}</h1>
            <p className="call-session__subhead">{t('callSession.subhead')}</p>
          </div>

          <div className="call-session__card">
            <div className="call-session__intro">
              <p className="call-session__eyebrow">{t('callSession.eyebrow')}</p>
              <h3>{t('callSession.cardTitle')}</h3>
              <p>{t('callSession.cardCopy')}</p>
            </div>

            <div className="call-session__embed">
              <iframe
                src="https://calendly.com/alan-creative/15min"
                title={t('callSession.iframeTitle')}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CallSession
