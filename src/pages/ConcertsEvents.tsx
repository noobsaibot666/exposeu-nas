import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4018.jpg'), title: 'Live Set' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4012.jpg'), title: 'Stage Glow' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4038.jpg'), title: 'Energy Capture' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4340.jpg'), title: 'Motion Freeze' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4263.jpg'),
  idealFor: resolveImagePath('/src/assets/images/services/4_performance_doc/_incoming/gallery/DSC_4210.jpg'),
}

function ConcertsEvents() {
  const { locale } = useLocale()
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
    midNote: string
    extraGalleryCopy: string
    extraGallery: Array<{ title: string; subtitle: string }>
    pricing: { body: string; cta: string }
  }>('services.pages.concerts-events')
  return (
    <>
      <SEOMeta
        title="Live Event Documentation Berlin — expose.u"
        description="Photo and video documentation for concerts, venues, labels and promoters in Berlin. Press-ready delivery. One crew, photo and video."
        ogTitle="Live Event Documentation Berlin — expose.u"
        ogDescription="Multi-angle concert and live event coverage. Press-ready in 24–48h. Serving Berlin venues and promoters."
        canonical="https://expose-u.com/services/concerts-events"
        lang={locale}
      />
      <WorkPageLayout
        title={page.title}
        heroCopy={page.heroCopy}
        detail={page.detail}
        socialProof={page.socialProof}
        cards={heroCards.map((card, index) => ({ ...card, title: page.cards[index] ?? card.title }))}
        galleryTitle={page.galleryTitle}
        galleryCopy={page.galleryCopy}
        gallery={page.gallery}
        galleryImage={sectionImages.gallery}
        midSectionNote={page.midNote}
        extraGalleryTitle={t('services.shared.idealFor')}
        extraGalleryCopy={page.extraGalleryCopy}
        extraGallery={page.extraGallery}
        extraGalleryImage={sectionImages.idealFor}
        editorialPricingBody={page.pricing.body}
        editorialPricingCta={page.pricing.cta}
        editorialPricingCtaHref="/contact?service=concerts-events"
        ctaText={page.ctaText}
        ctaLabel={page.footerCtaLabel}
        ctaHref="/contact"
        ctaDetail={t('services.shared.responseTime')}
        serviceSlug="concerts-events"
      />
    </>
  )
}

export default ConcertsEvents
