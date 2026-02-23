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
  setTheme('dark')
}
