import { Link } from 'react-router-dom'
import TopNav from '../components/TopNav'
import './PricingRequest.css'

function PricingRequestSuccess() {
  return (
    <main className="pricing-request pricing-request--success">
      <div className="home__nav pricing-request__nav">
        <TopNav
          leftLinks={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/#services' },
          ]}
          rightLinks={[
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ]}
          className="top-nav--page"
          activeLabel="Services"
        />
      </div>

      <section className="section pricing-request__body">
        <div className="content pricing-request__success">
          <p className="pricing-request__eyebrow">Thank you</p>
          <h1>Your pricing request is in.</h1>
          <p>
            We’ll review the details and reach out shortly with next steps, timing, and deliverables.
          </p>
          <div className="pricing-request__success-actions">
            <Link className="pricing-request__button" to="/">
              Back to Home
            </Link>
            <Link className="pricing-request__button pricing-request__button--ghost" to="/portfolio">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PricingRequestSuccess
