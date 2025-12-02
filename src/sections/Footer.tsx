import './Footer.css'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer__media">
        <img
          src="/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg"
          alt="Silhouette portrait in blue light"
        />
      </div>
      <div className="footer__content">
        <p className="footer__brand">expose.u</p>
        <div className="footer__links">
          <div className="footer__group">
            <p className="footer__label">I need to content for my</p>
            <a href="#">Exhibition</a>
            <a href="#">Fashion Show</a>
            <a href="#">Gallery Showcase</a>
            <a href="#">Artists Talks</a>
          </div>
          <div className="footer__group">
            <p className="footer__label">Get in touch</p>
            <a href="/contact">Contact</a>
            <a href="/call-session">Book a call session</a>
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
