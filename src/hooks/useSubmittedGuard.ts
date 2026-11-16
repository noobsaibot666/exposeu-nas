import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocaleNavigate } from '../i18n/LocaleProvider'

/** Navigation state a form passes to its success page after a real submission. */
export const SUBMITTED_STATE = { submitted: true } as const

/**
 * Success pages must only confirm a submission that just happened. Opened
 * directly (typed URL, bookmark, crawler) they redirect to the contact page
 * instead of telling the visitor their message was received.
 */
export function useSubmittedGuard(fallback = '/contact'): boolean {
  const location = useLocation()
  const navigate = useLocaleNavigate()
  const submitted = (location.state as { submitted?: boolean } | null)?.submitted === true

  useEffect(() => {
    if (!submitted) navigate(fallback, { replace: true })
  }, [submitted, navigate, fallback])

  return submitted
}
