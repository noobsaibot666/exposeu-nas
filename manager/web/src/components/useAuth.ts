import { useCallback, useEffect, useState } from 'react'

const storageKey = 'exposeu_manager_token'
const authEvent = 'exposeu-auth-change'

type AuthUser = {
  id: number
  email: string
  is_admin?: boolean
}

const decodeToken = (token: string | null): AuthUser | null => {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = JSON.parse(atob(padded))
    return decoded as AuthUser
  } catch {
    return null
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKey))
  const [user, setUser] = useState<AuthUser | null>(() => decodeToken(localStorage.getItem(storageKey)))

  useEffect(() => {
    const handleStorage = () => {
      const nextToken = localStorage.getItem(storageKey)
      setToken(nextToken)
      setUser(decodeToken(nextToken))
    }
    const handleAuthEvent = ((event: Event) => {
      const custom = event as CustomEvent<string | null>
      const nextToken = custom.detail ?? null
      setToken(nextToken)
      setUser(decodeToken(nextToken))
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
    setUser(decodeToken(value))
    window.dispatchEvent(new CustomEvent(authEvent, { detail: value }))
  }, [])

  return { token, saveToken, user }
}
