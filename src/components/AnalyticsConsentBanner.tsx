import { useEffect, useState } from 'react'
import styles from './AnalyticsConsentBanner.module.css'
import { ANALYTICS_CONSENT_KEY, initializeAnalyticsConsent } from '../utils/analytics'

function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = initializeAnalyticsConsent()
    setIsVisible(consent === null)
  }, [])

  const handleChoice = (value: 'true' | 'false') => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
    } catch {
      // ignore storage access issues
    }

    window.__analyticsConsent = value === 'true'
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside className={styles.consent__banner} aria-label="Analytics consent" role="dialog">
      <p className={styles.consent__title}>Analytics consent</p>
      <p className={styles.consent__copy}>
        Allow anonymous analytics so we can measure page use and improve the site.
      </p>
      <div className={styles.consent__actions}>
        <button
          type="button"
          className={`${styles.consent__button} ${styles.consent__buttonPrimary}`}
          onClick={() => handleChoice('true')}
        >
          Accept
        </button>
        <button
          type="button"
          className={`${styles.consent__button} ${styles.consent__buttonSecondary}`}
          onClick={() => handleChoice('false')}
        >
          Reject
        </button>
      </div>
    </aside>
  )
}

export default AnalyticsConsentBanner
