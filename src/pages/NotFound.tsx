import { Link } from 'react-router-dom'
import './WorkPage.css'

function NotFound() {
  return (
    <main className="work-page" id="main">
      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">Page not found</p>
            <h3>We couldn&apos;t find that page.</h3>
          </div>
          <Link className="work-cta__link" to="/">
            Go Home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
