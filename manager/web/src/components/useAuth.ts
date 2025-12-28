import { useCallback, useEffect, useState } from 'react'

const storageKey = 'exposeu_manager_token'
const authEvent = 'exposeu-auth-change'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKey))

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== token) {
      setToken(stored)
    }
  }, [token])

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem(storageKey))
    }
    const handleAuthEvent = ((event: Event) => {
      const custom = event as CustomEvent<string | null>
      setToken(custom.detail ?? null)
    }) as EventListener
    window.addEventListener('storage', handleStorage)
    window.addEventListener(authEvent, handleAuthEvent)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(authEvent, handleAuthEvent)
    }
  }, [])

  const saveToken = useCallback((value: string | null) => {
    if (value) {
      localStorage.setItem(storageKey, value)
    } else {
      localStorage.removeItem(storageKey)
    }
    setToken(value)
    window.dispatchEvent(new CustomEvent(authEvent, { detail: value }))
  }, [])

  return { token, saveToken }
}
