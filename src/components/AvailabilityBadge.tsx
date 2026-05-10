import { useLocale } from '../i18n/LocaleProvider'
import config from '../config/availability.json'
import './AvailabilityBadge.css'

export default function AvailabilityBadge() {
  const { locale } = useLocale()
  const entry = config[locale as keyof typeof config] ?? config.en

  if (!entry.active) return null

  return (
    <p className="availability-badge">
      <span className="availability-badge__dot" aria-hidden="true" />
      {entry.message}
    </p>
  )
}
