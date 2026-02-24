import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

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
  activeLabel?: string
}

function TopNav({
  leftLinks,
  rightLinks,
  brandHref = '/',
  brandLabel = 'expose.u',
  onBrandClick,
  className,
  activeLabel,
}: TopNavProps) {
  const [open, setOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const navLinks = useMemo(() => [...leftLinks, ...rightLinks], [leftLinks, rightLinks])

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Auto-focus close button in drawer
    requestAnimationFrame(() => {
      const closeBtn = document.querySelector<HTMLElement>('.top-nav__close')
      closeBtn?.focus()
    })
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
      // Restore focus to toggle button
      requestAnimationFrame(() => toggleRef.current?.focus())
      document.removeEventListener('keydown', handleKey)
      mql.removeEventListener('change', handleBreakpoint)
    }
  }, [open, closeMenu])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mql = window.matchMedia('(min-width: 901px)')
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      if (!mql.matches || open) return
      if (ticking.current) return
      ticking.current = true
      window.requestAnimationFrame(() => {
        const current = window.scrollY
        if (current <= 0) {
          setIsHidden(false)
        } else if (current > lastScrollY.current && current > 120) {
          setIsHidden(true)
        } else if (current < lastScrollY.current) {
          setIsHidden(false)
        }
        lastScrollY.current = current
        ticking.current = false
      })
    }

    const handleChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setIsHidden(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    mql.addEventListener('change', handleChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      mql.removeEventListener('change', handleChange)
    }
  }, [open])

  const renderLink = (item: NavItem) => {
    const isActive = item.label === activeLabel
    const linkClassName = ['top-nav__link', isActive ? 'top-nav__link--active' : ''].filter(Boolean).join(' ')
    const ariaCurrent = isActive ? 'location' : undefined

    if (item.onClick) {
      return (
        <button
          type="button"
          className={linkClassName}
          aria-current={ariaCurrent}
          onClick={() => {
            item.onClick?.()
            closeMenu()
          }}
        >
          {item.label}
        </button>
      )
    }

    if (item.href && item.href.startsWith('/')) {
      return (
        <Link className={linkClassName} to={item.href} onClick={closeMenu} aria-current={ariaCurrent}>
          {item.label}
        </Link>
      )
    }

    return (
      <a className={linkClassName} href={item.href ?? '#'} onClick={closeMenu} aria-current={ariaCurrent}>
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

  const containerClassName = [
    'top-nav',
    className ?? '',
    open ? 'is-open' : '',
    isHidden ? 'is-hidden' : '',
  ].filter(Boolean).join(' ')

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
            className="top-nav__toggle"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="top-nav__toggle-lines" aria-hidden="true" />
          </button>
        </div>
      </div>

      {drawer}
    </div>
  )
}

export default TopNav
