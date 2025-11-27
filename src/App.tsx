import { Route, Routes } from 'react-router-dom'
import './App.css'
import Claim from './sections/Claim'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Offer from './sections/Offer'
import Proposal from './sections/Proposal'
import About from './pages/About'
import Contact from './pages/Contact'
import Project01 from './pages/project_01'
import Project02 from './pages/project_02'
import Project03 from './pages/project_03'
import Project04 from './pages/project_04'
import Project05 from './pages/project_05'

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
        <Route
          path="/project_01"
          element={
            <>
              <Project01 />
              <Footer />
            </>
          }
        />
        <Route
          path="/project_02"
          element={
            <>
              <Project02 />
              <Footer />
            </>
          }
        />
        <Route
          path="/project_03"
          element={
            <>
              <Project03 />
              <Footer />
            </>
          }
        />
        <Route
          path="/project_04"
          element={
            <>
              <Project04 />
              <Footer />
            </>
          }
        />
        <Route
          path="/project_05"
          element={
            <>
              <Project05 />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
