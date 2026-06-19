import { useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import './Impressum.css'
import { useLocaleNavigate, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

function Privacy() {
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
        title="Privacy Policy — expose.u"
        description="How expose.u collects, uses, and protects your personal data."
        canonical="https://expose-u.com/privacy"
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
          <h1>Privacy Policy</h1>

          <div className="impressum__block">
            <p>
              This Privacy Policy explains how expose.u (<a href="https://expose-u.com">expose-u.com</a>) collects, uses, and protects information when you visit our website or contact us. Last updated: June 2026.
            </p>
          </div>

          <div className="impressum__block">
            <h2>Who we are</h2>
            <p>expose.u GbR — photography and video documentation studio based in Berlin, Germany.</p>
            <p>Contact: <a href="mailto:hello@expose-u.com">hello@expose-u.com</a></p>
          </div>

          <div className="impressum__block">
            <h2>What data we collect</h2>
            <p><strong>Contact form</strong> — name, email address, and any message you submit through our contact form.</p>
            <p><strong>Analytics data</strong> — pages visited, time on site, device type, and approximate location via Google Analytics (GA4) and Microsoft Clarity.</p>
            <p><strong>Advertising data</strong> — ad interactions and website events tracked via Meta Pixel (Facebook & Instagram).</p>
            <p><strong>Cookies</strong> — small files stored in your browser by analytics and advertising tools listed above. You can disable cookies in your browser settings at any time.</p>
          </div>

          <div className="impressum__block">
            <h2>Why we collect it</h2>
            <p><strong>Communication</strong> — to respond to enquiries submitted through the contact form.</p>
            <p><strong>Website improvement</strong> — to understand how visitors use the site and improve the experience.</p>
            <p><strong>Advertising measurement</strong> — to measure the effectiveness of ads shown on Meta platforms (Facebook & Instagram).</p>
          </div>

          <div className="impressum__block">
            <h2>Third-party services</h2>
            <p><strong>Meta (Facebook & Instagram)</strong> — Meta Pixel is used to track website visits and conversions from Meta ads. Meta may use this data according to their own privacy policy.</p>
            <p><strong>Google Analytics (GA4)</strong> — used to analyse website traffic and user behaviour.</p>
            <p><strong>Microsoft Clarity</strong> — used to record anonymised session replays and heatmaps to improve usability.</p>
          </div>

          <div className="impressum__block">
            <h2>Your rights</h2>
            <p>You have the right to request access to, correction of, or deletion of any personal data we hold about you. You may also object to data processing or request that we restrict it.</p>
            <p>To exercise any of these rights, contact us at <a href="mailto:hello@expose-u.com">hello@expose-u.com</a>.</p>
          </div>

          <div className="impressum__block">
            <h2>Data retention</h2>
            <p>Contact form submissions are retained only as long as necessary to respond to your enquiry. Analytics data is retained according to the default retention periods of each third-party service.</p>
          </div>

          <div className="impressum__block">
            <h2>Contact</h2>
            <p>If you have any questions regarding your personal data or wish to request its deletion, please contact us at <a href="mailto:hello@expose-u.com">hello@expose-u.com</a>.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Privacy
