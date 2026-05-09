import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useTranslation } from '../i18n/LocaleProvider'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_012.png'), title: 'Live Set' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_015.png'), title: 'Stage Glow' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/7_HERO_023.png'), title: 'Energy Capture' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_002.png'), title: 'Motion Freeze' },
]

function ConcertsEvents() {
  const { t, tm } = useTranslation()
  const page = tm<{
    title: string
    heroCopy: string
    detail: string
    socialProof: string
    ctaText: string
    footerCtaLabel: string
    cards: string[]
    galleryTitle: string
    galleryCopy: string
    gallery: Array<{ title: string; subtitle: string }>
    extraGalleryCopy: string
    extraGallery: Array<{ title: string; subtitle: string }>
  }>('services.pages.concerts-events')
  return (
    <WorkPageLayout
      title={page.title}
      heroCopy={page.heroCopy}
      detail={page.detail}
      socialProof={page.socialProof}
      cards={heroCards.map((card, index) => ({ ...card, title: page.cards[index] ?? card.title }))}
      galleryTitle={page.galleryTitle}
      galleryCopy={page.galleryCopy}
      gallery={page.gallery}
      extraGalleryTitle={t('services.shared.idealFor')}
      extraGalleryCopy={page.extraGalleryCopy}
      extraGallery={page.extraGallery}
      ctaText={page.ctaText}
      ctaLabel={page.footerCtaLabel}
      ctaHref="/contact"
      ctaDetail={t('services.shared.responseTime')}
      serviceSlug="concerts-events"
    />
  )
}

export default ConcertsEvents
