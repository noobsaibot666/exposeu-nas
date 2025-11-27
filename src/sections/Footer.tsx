import './Footer.css'

function Footer() {
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
            <p className="footer__label">Choose the best fit</p>
            <a href="#">Glow Up Kit</a>
            <a href="#">Spotlight</a>
            <a href="#">Prime Cut</a>
          </div>
          <div className="footer__group">
            <p className="footer__label">Get in touch</p>
            <a href="/contact">Contact</a>
            <a href="#">Book a call session</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
