import { useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import './Impressum.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'

function Impressum() {
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
          <h1>{t('legal.title')}</h1>

          <div className="impressum__block">
            <h2>{t('legal.companyBlockTitle')}</h2>
            <p>expose.u GbR</p>
            <p>Alan Alves</p>
            <p>Duden Str. 24</p>
            <p>Berlin, Germany</p>
          </div>

          <div className="impressum__block">
            <h2>{t('legal.contactTitle')}</h2>
            <p>
              <a href="mailto:infor@expose-u.com">infor@expose-u.com</a>
            </p>
            <p>
              <a href="tel:+4917622132950">+49 176 2213 2950</a>
            </p>
          </div>

          <div className="impressum__block">
            <h2>{t('legal.responsibleTitle')}</h2>
            <p>Alan Alves, Duden Str. 24, Berlin</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Impressum
