import { useEffect, useRef, useState } from 'react'
import styles from './AnalyticsConsentBanner.module.css'
import {
  ANALYTICS_CONSENT_KEY,
  initializeAnalyticsConsent,
  initializeAnalyticsVendors,
} from '../utils/analytics'
import { useTranslation } from '../i18n/LocaleProvider'

function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => initializeAnalyticsConsent() === null)
  const { t } = useTranslation()
  const bannerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (initializeAnalyticsConsent() === true) initializeAnalyticsVendors()
  }, [])

  const handleChoice = (value: 'true' | 'false') => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
    } catch {
      // ignore storage access issues
    }

    const granted = value === 'true'
    window.__analyticsConsent = granted
    if (granted) initializeAnalyticsVendors()
    // The focused button is about to unmount; without this, keyboard and
    // screen-reader focus falls back to <body> (top of the document).
    if (bannerRef.current?.contains(document.activeElement)) {
      const main = document.getElementById('main')
      if (main) {
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
      }
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    // Non-modal banner: a labelled landmark, not role="dialog" (it never takes
    // or traps focus, so announcing it as a dialog was misleading).
    <aside ref={bannerRef} className={styles.consent__banner} aria-label={t('common.analytics.ariaLabel')}>
      <p className={styles.consent__copy}>
        {t('common.analytics.copy')}
      </p>
      <div className={styles.consent__actions}>
        <button
          type="button"
          className={`${styles.consent__button} ${styles.consent__buttonPrimary}`}
          onClick={() => handleChoice('true')}
        >
          {t('common.analytics.accept')}
        </button>
        <button
          type="button"
          className={`${styles.consent__button} ${styles.consent__buttonSecondary}`}
          onClick={() => handleChoice('false')}
        >
          {t('common.analytics.reject')}
        </button>
      </div>
    </aside>
  )
}

export default AnalyticsConsentBanner
