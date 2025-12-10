import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setTheme } from './theme'

type ThemeMode = 'dark' | 'light'

type ThemeContextValue = {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (document.documentElement.dataset.theme as ThemeMode) || 'dark'
  })

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  useEffect(() => {
    const stored = document.documentElement.dataset.theme as ThemeMode | undefined
    if (stored && stored !== theme) {
      setThemeState(stored)
    }
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useThemeContext must be used inside ThemeProvider')
  }
  return value
}
