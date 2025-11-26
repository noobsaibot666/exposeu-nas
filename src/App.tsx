import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Claim from './sections/Claim'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Proposal from './sections/Proposal'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__left">
          {!isHome && (
            <Link to="/" className="topbar__back">
              ← Back
            </Link>
          )}
          <button
            className="topbar__menu-button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
          <nav className={`topbar__nav ${menuOpen ? 'is-open' : ''}`}>
            <a href="/#hero" onClick={() => setMenuOpen(false)}>
              Hero
            </a>
            <a href="/#proposal" onClick={() => setMenuOpen(false)}>
              Proposal
            </a>
            <a href="/#claim" onClick={() => setMenuOpen(false)}>
              Claim
            </a>
            <a href="/#offer" onClick={() => setMenuOpen(false)}>
              Offer
            </a>
          </nav>
        </div>
        <Link to="/" className="topbar__logo" aria-label="Home">
          <div className="logo-square" />
        </Link>
        <div className="topbar__links">
          <NavLink to="/about" className="topbar__link">
            About Us
          </NavLink>
          <NavLink to="/contact" className="topbar__link">
            Contact
          </NavLink>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Proposal />
              <Claim />
              <Offer />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Contact />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
