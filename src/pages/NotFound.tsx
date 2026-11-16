import './WorkPage.css'
import LocalizedLink from '../i18n/LocalizedLink'
import { useTranslation } from '../i18n/LocaleProvider'

function NotFound() {
  const { t } = useTranslation()
  return (
    <main className="work-page" id="main">
      <section className="section work-cta">
        <div className="content work-cta__content">
          <div>
            <p className="work-cta__eyebrow">{t('notFound.eyebrow')}</p>
            <h1>{t('notFound.headline')}</h1>
          </div>
          <LocalizedLink className="work-cta__link" to="/">{t('notFound.cta')}</LocalizedLink>
        </div>
      </section>
    </main>
  )
}

export default NotFound
