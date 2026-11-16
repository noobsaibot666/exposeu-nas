import { Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useThemeContext } from '../ThemeContext'
import { useTranslation } from '../i18n/LocaleProvider'
import './ThemeToggle.css'

// Pages using the homepage's full-width fixed nav (homepage + project pages):
// the controls sit fixed top-right there, not anchored to the content column.
const HOME_PATHS = new Set(['/', '/de'])
const usesHomeNav = (pathname: string) => HOME_PATHS.has(pathname) || /^(\/de)?\/projects\//.test(pathname)

/**
 * Light/dark switch shown beside the language switcher. `solo` places it in the
 * language switcher's own spot on pages where that switcher is hidden.
 */
function ThemeToggle({ solo = false }: { solo?: boolean }) {
  const { theme, toggleTheme } = useThemeContext()
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isHome = usesHomeNav(pathname)
  const label = theme === 'dark' ? t('common.theme.toLight') : t('common.theme.toDark')

  return (
    <button
      type="button"
      className={[
        'theme-toggle',
        isHome ? 'theme-toggle--home' : 'theme-toggle--page',
        solo ? 'theme-toggle--solo' : '',
      ].join(' ').trim()}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'dark'
        ? <Sun aria-hidden="true" size={17} strokeWidth={1.6} />
        : <Moon aria-hidden="true" size={17} strokeWidth={1.6} />}
    </button>
  )
}

export default ThemeToggle
