import './Footer.css'

function Footer() {
  return (
    <footer className="footer section">
      <div className="content footer__grid">
        <div>
          <p className="footer__brand">Footer</p>
          <p className="footer__copy">
            Use this area for brand info, a short mission line, or contact
            details.
          </p>
        </div>
        <div className="footer__links">
          <a href="#">Link one</a>
          <a href="#">Link two</a>
          <a href="#">Link three</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
