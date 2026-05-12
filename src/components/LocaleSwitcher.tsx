import { Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import './LocaleSwitcher.css'

const HOME_PATHS = new Set(['/', '/de', '/v2', '/de/v2', '/old-home'])

function LocaleSwitcher() {
  const { locale, switchLocale } = useLocale()
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const isHome = HOME_PATHS.has(pathname)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className={`locale-switcher ${isHome ? 'locale-switcher--home' : 'locale-switcher--page'}`} ref={rootRef}>
      <button
        type="button"
        className="locale-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        aria-label={t('common.language.switcherLabel')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe aria-hidden="true" size={20} strokeWidth={1.8} />
      </button>

      <div
        className={`locale-switcher__menu ${open ? 'is-open' : ''}`}
        role="menu"
        aria-label={t('common.language.menuLabel')}
        aria-hidden={open ? 'false' : 'true'}
      >
        <button
          type="button"
          className={`locale-switcher__option ${locale === 'en' ? 'is-active' : ''}`}
          role="menuitemradio"
          aria-checked={locale === 'en' ? 'true' : 'false'}
          onClick={() => {
            switchLocale('en')
            setOpen(false)
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
            setOpen(false)
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
