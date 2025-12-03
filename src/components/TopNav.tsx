import { useEffect, useMemo, useState } from 'react'
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

  const navLinks = useMemo(() => [...leftLinks, ...rightLinks], [leftLinks, rightLinks])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const closeMenu = () => setOpen(false)

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

  return (
    <div className={`top-nav ${className ?? ''}`}>
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

        <button
          type="button"
          className="top-nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
          <div className="top-nav__toggle-lines" aria-hidden />
        </button>
      </div>

      <div className={`top-nav__drawer ${open ? 'is-open' : ''}`}>
        <button type="button" className="top-nav__scrim" aria-label="Close menu" onClick={closeMenu} />
        <div className="top-nav__drawer-panel" id="mobile-menu">
          <div className="top-nav__drawer-header">
            {renderBrand()}
            <button type="button" className="top-nav__close" onClick={closeMenu}>
              Close
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
      </div>
    </div>
  )
}

export default TopNav
