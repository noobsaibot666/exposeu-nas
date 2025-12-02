const THEME_KEY = 'site-theme'

type ThemeMode = 'dark' | 'light'

export const setTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode
  try {
    localStorage.setItem(THEME_KEY, mode)
  } catch {
    /* ignore */
  }
}

export const initTheme = () => {
  const stored = (() => {
    try {
      return localStorage.getItem(THEME_KEY) as ThemeMode | null
    } catch {
      return null
    }
  })()
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  const mode: ThemeMode = stored ?? (prefersLight ? 'light' : 'dark')
  setTheme(mode)
}
