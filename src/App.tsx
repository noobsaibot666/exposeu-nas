import { Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Claim from './sections/Claim'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Proposal from './sections/Proposal'
import About from './pages/About'
import Atmospheric from './pages/Atmospheric'
import CallSession from './pages/CallSession'
import Contact from './pages/Contact'
import Exhibitions from './pages/Exhibitions'
import FashionShow from './pages/FashionShow'
import GalleryStories from './pages/GalleryStories'
import Performance from './pages/Performance'
import ArtistSessions from './pages/ArtistSessions'
import Portfolio from './pages/Portfolio'
import { setTheme } from './theme'

function App() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.dataset.theme as 'light' | 'dark') || 'dark'
  })

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  useEffect(() => {
    const stored = document.documentElement.dataset.theme as 'light' | 'dark' | undefined
    if (stored && stored !== theme) {
      setThemeState(stored)
    }
  }, [theme])

  return (
    <div className="page">
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
        )}
      </button>
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
          path="/call-session"
          element={
            <>
              <CallSession />
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
        <Route
          path="/exhibitions"
          element={
            <>
              <Exhibitions />
            </>
          }
        />
        <Route
          path="/atmospheric"
          element={
            <>
              <Atmospheric />
            </>
          }
        />
        <Route
          path="/performance"
          element={
            <>
              <Performance />
            </>
          }
        />
        <Route
          path="/gallery-stories"
          element={
            <>
              <GalleryStories />
            </>
          }
        />
        <Route
          path="/artist-sessions"
          element={
            <>
              <ArtistSessions />
            </>
          }
        />
        <Route
          path="/fashion-show"
          element={
            <>
              <FashionShow />
            </>
          }
        />
        <Route
          path="/portfolio"
          element={
            <>
              <Portfolio />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
