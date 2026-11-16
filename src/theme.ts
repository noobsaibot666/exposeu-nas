export const THEME_KEY = 'site-theme'

export type ThemeMode = 'dark' | 'light'

export const getInitialTheme = (): ThemeMode => {
  // index.html applies the stored theme before first paint; trust it first.
  const fromDom = document.documentElement.dataset.theme
  if (fromDom === 'light' || fromDom === 'dark') return fromDom
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable */
  }
  return 'dark' // site default
}

export const setTheme = (mode: ThemeMode, persist = true) => {
  document.documentElement.dataset.theme = mode
  if (!persist) return
  try {
    localStorage.setItem(THEME_KEY, mode)
  } catch {
    /* ignore */
  }
}

export const initTheme = () => {
  // Apply without persisting: only an explicit toggle stores a choice.
  setTheme(getInitialTheme(), false)
}
