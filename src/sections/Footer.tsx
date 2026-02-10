import './Footer.css'
import { resolveImagePath } from '../utils/resolveImagePath'

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
        />
      </div>
      <div className="footer__content">
        <div className="footer__intro">
          <p className="footer__brand">expose.u</p>
          <p className="footer__tagline">Cinematic photo and video for Berlin&rsquo;s galleries, artists, and live events.</p>
          <p className="footer__cta">
            Ready to book visual documentation? <a href="/contact">Contact us</a>.
          </p>
        </div>
        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">Documentation types</p>
            <a href="/documentation">Exhibitions</a>
            <a href="/gallery-stories">Gallery stories</a>
            <a href="/artist-sessions">Artist sessions</a>
            <a href="/performance">Performances</a>
            <a href="/fashion-show">Fashion shows</a>
            <a href="/atmospheric">Atmospheric films</a>
          </div>
          <div className="footer__group">
            <p className="footer__label">Next steps</p>
            <a href="/contact">Contact us</a>
            <a href="/call-session">Book a call</a>
            <a href="/portfolio">View portfolio</a>
          </div>
          <div className="footer__group">
            <p className="footer__label">Legal</p>
            <a href="/impressum">Impressum</a>
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
