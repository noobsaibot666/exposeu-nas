import { Link } from 'react-router-dom'
import { useAuth } from './useAuth'
import './Layout.css'

function Layout({
  title,
  children,
  headerClassName,
  hideDashboardLink,
  headerActions,
}: {
  title: string
  children: React.ReactNode
  headerClassName?: string
  hideDashboardLink?: boolean
  headerActions?: React.ReactNode
}) {
  const { saveToken } = useAuth()

  return (
    <div className="layout">
      <header className={`layout__header${headerClassName ? ` ${headerClassName}` : ''}`}>
        <div className="layout__topline">
          <p className="layout__eyebrow">Exposeu Manager</p>
          <button type="button" className="layout__logout" onClick={() => saveToken(null)}>
            <span aria-hidden="true">⎋</span>
            Log out
          </button>
        </div>
        <div className="layout__title">
          <div className="layout__title-row">
            <div className="layout__title-main">
              <h1>{title}</h1>
            </div>
          </div>
          {(!hideDashboardLink || headerActions) && (
            <div className="layout__actions-row">
              <div className="layout__actions-left">
                {!hideDashboardLink && (
                  <Link to="/" className="layout__primary">
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="layout__actions-right">{headerActions}</div>
            </div>
          )}
        </div>
      </header>
      <main className="layout__content">{children}</main>
    </div>
  )
}

export default Layout
