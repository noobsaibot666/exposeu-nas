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
    </footer>
  )
}

export default Footer
