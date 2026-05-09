import { useState } from 'react'
import styles from './AnalyticsConsentBanner.module.css'
import { ANALYTICS_CONSENT_KEY, initializeAnalyticsConsent } from '../utils/analytics'
import { useTranslation } from '../i18n/LocaleProvider'

function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => initializeAnalyticsConsent() === null)
  const { t } = useTranslation()

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
    <aside className={styles.consent__banner} aria-label={t('common.analytics.ariaLabel')} role="dialog">
      <p className={styles.consent__title}>{t('common.analytics.title')}</p>
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
