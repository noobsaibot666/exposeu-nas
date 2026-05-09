import { Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import './LocaleSwitcher.css'

function LocaleSwitcher() {
  const { locale, switchLocale } = useLocale()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

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
    <div className="locale-switcher" ref={rootRef}>
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
