import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../components/useAuth'
import '../styles/forms.css'

function NotFound() {
  const { token } = useAuth()

  const content = (
    <div className="notfound">
      <p className="eyebrow">Not found</p>
      <h2>We couldn’t find that page</h2>
      <p className="muted">The link might be broken or the page was moved.</p>
      <div className="notfound__actions">
        <Link to="/" className="primary-link">
          Go to dashboard
        </Link>
        <Link to="/projects/new" className="ghost-link">
          Start a project
        </Link>
        {!token && (
          <Link to="/login" className="ghost-link">
            Back to login
          </Link>
        )}
      </div>
    </div>
  )

  if (!token) {
    return (
      <div className="login">
        <div className="card">{content}</div>
      </div>
    )
  }

  return <Layout title="Page not found">{content}</Layout>
}

export default NotFound
