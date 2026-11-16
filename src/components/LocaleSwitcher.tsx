import { Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import './LocaleSwitcher.css'

// Pages using the homepage's full-width fixed nav (homepage + project pages):
// the controls sit fixed top-right there, not anchored to the content column.
const HOME_PATHS = new Set(['/', '/de'])
const usesHomeNav = (pathname: string) => HOME_PATHS.has(pathname) || /^(\/de)?\/projects\//.test(pathname)

function LocaleSwitcher() {
  const { locale, switchLocale } = useLocale()
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const isHome = usesHomeNav(pathname)

  const closeMenu = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        closeMenu(true)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className={`locale-switcher ${isHome ? 'locale-switcher--home' : 'locale-switcher--page'}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="locale-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        aria-label={t('common.language.switcherLabel')}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        <Globe aria-hidden="true" size={17} strokeWidth={1.8} />
      </button>

      <div
        className={`locale-switcher__menu ${open ? 'is-open' : ''}`}
        role="menu"
        aria-label={t('common.language.menuLabel')}
        aria-hidden={open ? 'false' : 'true'}
        inert={!open}
      >
        <button
          type="button"
          className={`locale-switcher__option ${locale === 'en' ? 'is-active' : ''}`}
          role="menuitemradio"
          aria-checked={locale === 'en' ? 'true' : 'false'}
          onClick={() => {
            switchLocale('en')
            closeMenu(true)
          }}
          tabIndex={open ? 0 : -1}
        >
          English
        </button>
        <button
          type="button"
          className={`locale-switcher__option ${locale === 'de' ? 'is-active' : ''}`}
          role="menuitemradio"
          aria-checked={locale === 'de' ? 'true' : 'false'}
          onClick={() => {
            switchLocale('de')
            closeMenu(true)
          }}
          tabIndex={open ? 0 : -1}
        >
          Deutsch
        </button>
      </div>
    </div>
  )
}

export default LocaleSwitcher
