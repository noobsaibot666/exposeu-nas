import './Contact.css'
import TopNav from '../components/TopNav'
import LocalizedLink from '../i18n/LocalizedLink'
import { useTranslation } from '../i18n/LocaleProvider'

function ContactSuccess() {
  const { t } = useTranslation()
  return (
    <main className="contact contact--success" id="main">
      <div className="content contact__nav">
        <TopNav
          leftLinks={[
            { id: 'home', label: t('nav.home'), href: '/' },
            { id: 'services', label: t('nav.services'), href: '/#cases' },
          ]}
          rightLinks={[
            { id: 'about', label: t('nav.about'), href: '/about' },
            { id: 'contact', label: t('nav.contact'), href: '/contact' },
          ]}
          className="top-nav--page"
          activeId="contact"
        />
      </div>

      <section className="section contact__body">
        <div className="content contact__heading">
          <p className="contact__eyebrow">{t('forms.contact.success.eyebrow')}</p>
          <h1>{t('forms.contact.success.headline')}</h1>
          <p className="contact__lede">{t('forms.contact.success.copy')}</p>
          <div className="contact__success-actions">
            <LocalizedLink className="contact__submit" to="/">{t('forms.contact.success.backHome')}</LocalizedLink>
            <LocalizedLink className="contact__submit contact__submit--ghost" to="/portfolio">{t('forms.contact.success.viewPortfolio')}</LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactSuccess
