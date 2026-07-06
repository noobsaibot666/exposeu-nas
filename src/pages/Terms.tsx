import { useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import './Impressum.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

function Terms() {
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
        title="Terms of Use"
        description="Terms governing the use of the expose.u website and services."
        canonical="https://expose-u.com/terms"
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
          <h1>Terms of Use</h1>

          <div className="impressum__block">
            <p>
              By accessing <a href="https://expose-u.com">expose-u.com</a>, you agree to the following terms. If you do not agree, please do not use this website. Last updated: June 2026.
            </p>
          </div>

          <div className="impressum__block">
            <h2>Website ownership</h2>
            <p>This website is owned and operated by expose.u GbR, a photography and video documentation studio based in Berlin, Germany.</p>
          </div>

          <div className="impressum__block">
            <h2>Informational purpose</h2>
            <p>The content on this website is provided for general informational purposes only. It describes the services offered by expose.u and is not a binding contract or offer unless explicitly confirmed in writing.</p>
          </div>

          <div className="impressum__block">
            <h2>Intellectual property</h2>
            <p>All images, videos, branding, text, and other content on this website are the property of expose.u or of the respective clients who have granted permission for their use. Unauthorised reproduction, distribution, or use of any content is prohibited without prior written consent.</p>
          </div>

          <div className="impressum__block">
            <h2>Accuracy of information</h2>
            <p>We make reasonable efforts to keep the information on this website accurate and up to date. However, content — including service descriptions, pricing, and availability — may change without notice. expose.u accepts no liability for decisions made based on information found on this website.</p>
          </div>

          <div className="impressum__block">
            <h2>Limitation of liability</h2>
            <p>expose.u is not liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or its content. Use of this website is at your own risk.</p>
          </div>

          <div className="impressum__block">
            <h2>External links</h2>
            <p>This website may contain links to third-party websites. expose.u has no control over their content and accepts no responsibility for them.</p>
          </div>

          <div className="impressum__block">
            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Germany. Any disputes shall be subject to the jurisdiction of the courts in Berlin.</p>
          </div>

          <div className="impressum__block">
            <h2>Contact</h2>
            <p>Questions about these terms: <a href="mailto:hello@expose-u.com">hello@expose-u.com</a></p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Terms
