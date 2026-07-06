import { useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import './Impressum.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

function DataDeletion() {
  const navigate = useLocaleNavigate()
  const rootRef = useRef<HTMLElement | null>(null)
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
    <main className="impressum" ref={rootRef} id="main">
      <SEOMeta
        title="Data Deletion Instructions"
        description="How to request deletion of your data from expose.u services connected via Facebook or Instagram."
        canonical="https://expose-u.com/data-deletion"
        lang="en"
      />

      <div className="home__nav impressum__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel={t('nav.brand')}
          className="top-nav--page"
        />
      </div>

      <section className="section impressum__shell">
        <div className="content impressum__content">
          <h1>Data Deletion Instructions</h1>

          <div className="impressum__block">
            <p>
              If you have connected your Facebook, Instagram, or Threads account with expose.u services and wish to have your data removed, please follow the instructions below.
            </p>
          </div>

          <div className="impressum__block">
            <h2>How to request deletion</h2>
            <p>Send an email to <a href="mailto:hello@expose-u.com">hello@expose-u.com</a> with the subject line:</p>
            <p><strong>Data Deletion Request</strong></p>
          </div>

          <div className="impressum__block">
            <h2>What to include</h2>
            <p>Your Facebook or Instagram username.</p>
            <p>The email address associated with your account.</p>
          </div>

          <div className="impressum__block">
            <h2>What happens next</h2>
            <p>We will process your request and permanently delete any stored data within 30 days of receiving it, except where retention is required by applicable law.</p>
            <p>You will receive a confirmation email once the deletion is complete.</p>
          </div>

          <div className="impressum__block">
            <h2>Contact</h2>
            <p><a href="mailto:hello@expose-u.com">hello@expose-u.com</a></p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default DataDeletion
