import { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import './Impressum.css'

function Impressum() {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLElement | null>(null)

  const navLinks = useMemo(
    () => ({
      left: [
        { label: 'Home', onClick: () => navigate('/') },
        { label: 'Services', href: '/#services' },
      ],
      right: [
        { label: 'About', onClick: () => navigate('/about') },
        { label: 'Check availability', onClick: () => navigate('/contact') },
      ],
    }),
    [navigate],
  )

  return (
    <main className="impressum" ref={rootRef}>
      <div className="home__nav impressum__nav">
        <TopNav
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate('/')}
          brandLabel="expose.u"
          className="top-nav--page"
        />
      </div>

      <section className="section impressum__shell">
        <div className="content impressum__content">
          <h1>Impressum</h1>

          <div className="impressum__block">
            <h2>Angaben gemaess § 5 TMG</h2>
            <p>expose.u GbR</p>
            <p>Alan Alves</p>
            <p>Duden Str. 24</p>
            <p>Berlin, Germany</p>
          </div>

          <div className="impressum__block">
            <h2>Kontakt</h2>
            <p>
              <a href="mailto:infor@expose-u.com">infor@expose-u.com</a>
            </p>
            <p>
              <a href="tel:+4917622132950">+49 176 2213 2950</a>
            </p>
          </div>

          <div className="impressum__block">
            <h2>Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>Alan Alves, Duden Str. 24, Berlin</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Impressum
