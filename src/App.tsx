import { Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <div className="page">
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
      </Routes>
    </div>
  )
}

export default App
