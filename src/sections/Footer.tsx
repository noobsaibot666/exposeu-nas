import './Footer.css'
import { Link } from 'react-router-dom'
import { resolveImagePath } from '../utils/resolveImagePath'
import { serviceList } from '../data/serviceMeta'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__media">
        <img
          src={resolveImagePath('/src/assets/images/services/7_Hero/7_HERO_033.png')}
          alt="Audience in blue light"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="footer__content">
        <div className="footer__intro">
          <p className="footer__brand">expose.u</p>
          <p className="footer__tagline">Cinematic photo and video for Berlin&rsquo;s galleries, artists, and live events.</p>
          <p className="footer__trust">
            Selected collaborators: galleries, artists, cultural venues, and independent producers in Berlin.
          </p>
          <p className="footer__cta">
            Ready to book visual documentation? <Link to="/contact">Check availability</Link>.
          </p>
        </div>
        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">Documentation types</p>
            {serviceList.map((service) => (
              <Link key={service.slug} to={service.href}>
                {service.label}
              </Link>
            ))}
          </div>
          <div className="footer__group">
            <p className="footer__label">Next steps</p>
            <Link to="/contact">Check availability</Link>
            <Link to="/call-session">Book a call</Link>
            <Link to="/portfolio">View portfolio</Link>
          </div>
          <div className="footer__group">
            <p className="footer__label">Legal</p>
            <Link to="/impressum">Impressum</Link>
            <a href="https://instagram.com/xposeu_official" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <button type="button" className="footer__to-top" onClick={scrollToTop} aria-label="Back to top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m5 12 7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer
