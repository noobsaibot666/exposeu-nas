import { Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Atmospheric from './pages/Atmospheric'
import CallSession from './pages/CallSession'
import Contact from './pages/Contact'
import ContactSuccess from './pages/ContactSuccess'
import Exhibitions from './pages/Exhibitions'
import FashionShow from './pages/FashionShow'
import GalleryStories from './pages/GalleryStories'
import Performance from './pages/Performance'
import ArtistSessions from './pages/ArtistSessions'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import SecondHome from './pages/SecondHome'
import PricingRequest from './pages/PricingRequest'
import PricingRequestSuccess from './pages/PricingRequestSuccess'
import { ThemeProvider } from './ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/second-home" element={<SecondHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/call-session" element={<CallSession />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-success" element={<ContactSuccess />} />
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
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pricing-request/:plan" element={<PricingRequest />} />
          <Route path="/pricing-request/success" element={<PricingRequestSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
