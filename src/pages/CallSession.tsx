import { useMemo } from 'react'
import './Page.css'
import './CallSession.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import TopNav from '../components/TopNav'

function CallSession() {
  const navigate = useLocaleNavigate()
  const { t } = useTranslation()

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

  return (
    <main className="page-shell">
      <TopNav
        leftLinks={navLinks.left}
        rightLinks={navLinks.right}
        onBrandClick={() => navigate('/')}
        brandLabel={t('nav.brand')}
        className="top-nav--page"
      />
      <section className="section call-session">
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
