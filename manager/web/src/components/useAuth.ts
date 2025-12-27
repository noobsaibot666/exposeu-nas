import { useCallback, useEffect, useState } from 'react'

const storageKey = 'exposeu_manager_token'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKey))

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== token) {
      setToken(stored)
    }
  }, [token])

  const saveToken = useCallback((value: string | null) => {
    if (value) {
      localStorage.setItem(storageKey, value)
    } else {
      localStorage.removeItem(storageKey)
    }
    setToken(value)
  }, [])

  return { token, saveToken }
}
