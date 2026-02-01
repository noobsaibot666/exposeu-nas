import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <motion.header
        className={`layout__header${headerClassName ? ` ${headerClassName}` : ''}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
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
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
              >
                {title}
              </motion.h1>
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
      </motion.header>
      <motion.main
        className="layout__content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
      >
        {children}
      </motion.main>
      <footer className="layout__footer">
        <span>Version 1.0</span>
        <span>Copyright: Alan Alves</span>
      </footer>
    </div>
  )
}

export default Layout
