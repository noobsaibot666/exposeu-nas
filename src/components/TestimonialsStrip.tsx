import { useTranslation } from '../i18n/LocaleProvider'
import styles from './TestimonialsStrip.module.css'

type TestimonialItem = {
  id: string
  quote: string
  author: string
  company: string
  avatar: string | null
  service: string
}

type Props = {
  service: string
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

export default function TestimonialsStrip({ service }: Props) {
  const { t, tm } = useTranslation()
  const all = tm<TestimonialItem[]>('testimonials.items')
  const items = all.filter((item) => item.service === service)

  if (items.length === 0) return null

  return (
    <section className={`section ${styles.section}`}>
      <div className={`content ${styles.inner}`}>
        <span className={styles.label}>{t('testimonials.label')}</span>
        <div className={styles.strip}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <p className={styles.quote}>{item.quote}</p>
              <div className={styles.meta}>
                <div className={styles.avatar}>
                  {item.avatar
                    ? <img src={item.avatar} alt={item.author} />
                    : initials(item.author)}
                </div>
                <div className={styles.metaText}>
                  <p className={styles.author}>{item.author}</p>
                  <p className={styles.company}>{item.company}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
