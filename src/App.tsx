import { Route, Routes } from 'react-router-dom'
import './App.css'
import Claim from './sections/Claim'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Proposal from './sections/Proposal'
import About from './pages/About'
import Contact from './pages/Contact'

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
