import { useState } from 'react'
import { useTranslation } from '../i18n/LocaleProvider'
import './FAQSection.css'

type FaqItem = { q: string; a: string }

type FaqData = {
  label: string
  general: FaqItem[]
  [service: string]: FaqItem[] | string
}

type Props = { service: string }

export default function FAQSection({ service }: Props) {
  const { t, tm } = useTranslation()
  const data = tm<FaqData>('faq')
  const serviceItems = Array.isArray(data[service]) ? (data[service] as FaqItem[]) : []
  const items = [...data.general, ...serviceItems]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (items.length === 0) return null

  return (
    <section className="section faq-section">
      <div className="content faq-section__inner">
        <span className="work-gallery__label">{t('faq.label')}</span>
        <dl className="faq-section__list">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            const answerId = `faq-answer-${i}`
            return (
              <div key={i} className={`faq-section__item${isOpen ? ' is-open' : ''}`}>
                <dt>
                  <button
                    type="button"
                    className="faq-section__trigger"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <svg
                      className="faq-section__chevron"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </dt>
                <dd id={answerId} className="faq-section__answer" role="region">
                  <div className="faq-section__answer-inner">
                    <p>{item.a}</p>
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
