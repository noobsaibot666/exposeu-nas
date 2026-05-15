import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/0002.jpg'), title: 'Opening Night' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/001.png'), title: 'Light Studies' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/009.jpg'), title: 'Curated Flow' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/012.jpg'), title: 'Install Detail' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.jpg'),
  idealFor: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/003.jpg'),
}

function ExhibitionGallery() {
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
    extraGalleryCopy: string
    extraGallery: Array<{ title: string; subtitle: string }>
  }>('services.pages.exhibition-gallery')
  return (
    <>
      <SEOMeta
        title="Exhibition & Gallery Photography Berlin"
        description="Exhibition and gallery documentation in Berlin. Opening night coverage, archive-quality delivery for press and funding."
        ogTitle="Exhibition Documentation Berlin — expose.u"
        ogDescription="Full opening and exhibition coverage. Delivered for press, funding, and archive. Berlin-based."
        canonical="https://expose-u.com/services/exhibition-gallery"
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
        extraGalleryTitle={t('services.shared.idealFor')}
        extraGalleryCopy={page.extraGalleryCopy}
        extraGallery={page.extraGallery}
        extraGalleryImage={sectionImages.idealFor}
        ctaText={page.ctaText}
        ctaLabel={page.footerCtaLabel}
        ctaHref="/contact"
        ctaDetail={t('services.shared.responseTime')}
        serviceSlug="exhibition-gallery"
      />
    </>
  )
}

export default ExhibitionGallery
