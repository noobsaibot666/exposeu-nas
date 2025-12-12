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
          src={resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg')}
          alt="Silhouette portrait in blue light"
        />
      </div>
      <div className="footer__content">
        <div>
          <p className="footer__brand">expose.u</p>
          <p className="footer__tagline">Cinematic photo + video for Berlin&rsquo;s galleries, artists, and electric nights.</p>
        </div>
        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">Need coverage for</p>
            <a href="/exhibitions">Exhibitions</a>
            <a href="/fashion-show">Fashion shows</a>
            <a href="/gallery-stories">Gallery stories</a>
            <a href="/artist-sessions">Artist sessions</a>
            <a href="/performance">Performances</a>
            <a href="/atmospheric">Atmospheric films</a>
          </div>
          <div className="footer__group">
            <p className="footer__label">Next steps</p>
            <a href="/contact">Contact the studio</a>
            <a href="/call-session">Book a call session</a>
            <a href="/portfolio">View portfolio</a>
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
