import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useThemeContext } from '../ThemeContext'
import './TopNav.css'

export type NavItem = {
  label: string
  href?: string
  onClick?: () => void
}

type TopNavProps = {
  leftLinks: NavItem[]
  rightLinks: NavItem[]
  brandLabel?: string
  brandHref?: string
  onBrandClick?: () => void
  className?: string
}

function TopNav({
  leftLinks,
  rightLinks,
  brandHref = '/',
  brandLabel = 'expose.u',
  onBrandClick,
  className,
}: TopNavProps) {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useThemeContext()

  const navLinks = useMemo(() => [...leftLinks, ...rightLinks], [leftLinks, rightLinks])

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    const mql = window.matchMedia('(min-width: 901px)')
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu()
    }
    document.addEventListener('keydown', handleKey)
    mql.addEventListener('change', handleBreakpoint)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      mql.removeEventListener('change', handleBreakpoint)
    }
  }, [open, closeMenu])

  const renderLink = (item: NavItem) => {
    if (item.onClick) {
      return (
        <button
          type="button"
          className="top-nav__link"
          onClick={() => {
            item.onClick?.()
            closeMenu()
          }}
        >
          {item.label}
        </button>
      )
    }

    return (
      <a className="top-nav__link" href={item.href ?? '#'} onClick={closeMenu}>
        {item.label}
      </a>
    )
  }

  const renderBrand = () => {
    if (onBrandClick) {
      return (
        <button
          type="button"
          className="top-nav__brand"
          onClick={() => {
            onBrandClick()
            closeMenu()
          }}
        >
          {brandLabel}
        </button>
      )
    }

    return (
      <a className="top-nav__brand" href={brandHref}>
        {brandLabel}
      </a>
    )
  }

  const containerClassName = ['top-nav', className ?? '', open ? 'is-open' : ''].filter(Boolean).join(' ')

  const drawer = typeof document !== 'undefined'
    ? createPortal(
        <div className={`top-nav__drawer ${open ? 'is-open' : ''}`}>
          <button type="button" className="top-nav__scrim" aria-label="Close menu" onClick={closeMenu} />
          <div className="top-nav__drawer-panel" id="mobile-menu">
            <div className="top-nav__drawer-header">
              {renderBrand()}
              <button type="button" className="top-nav__close" onClick={closeMenu} aria-label="Close menu">
                ×
              </button>
            </div>
            <div className="top-nav__drawer-links">
              {navLinks.map((item) => (
                <div key={item.label} className="top-nav__drawer-link">
                  {renderLink(item)}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div className={containerClassName}>
      <div className="top-nav__bar">
        <nav className="top-nav__links top-nav__links--left" aria-label="Primary">
          {leftLinks.map((item) => (
            <span key={item.label}>{renderLink(item)}</span>
          ))}
        </nav>

        {renderBrand()}

        <nav className="top-nav__links top-nav__links--right" aria-label="Secondary">
          {rightLinks.map((item) => (
            <span key={item.label}>{renderLink(item)}</span>
          ))}
        </nav>

        <div className="top-nav__actions">
          <button
            type="button"
            className="top-nav__theme"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="top-nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <div className="top-nav__toggle-lines" aria-hidden />
          </button>
        </div>
      </div>

      {drawer}
    </div>
  )
}

export default TopNav
