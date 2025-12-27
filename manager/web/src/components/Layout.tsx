import { Link } from 'react-router-dom'
import { useAuth } from './useAuth'
import './Layout.css'

function Layout({ title, children }: { title: string; children: React.ReactNode }) {
  const { saveToken } = useAuth()

  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <p className="layout__eyebrow">Exposeu Manager</p>
          <h1>{title}</h1>
        </div>
        <div className="layout__actions">
          <Link to="/">Dashboard</Link>
          <button type="button" onClick={() => saveToken(null)}>
            Log out
          </button>
        </div>
      </header>
      <main className="layout__content">{children}</main>
    </div>
  )
}

export default Layout
