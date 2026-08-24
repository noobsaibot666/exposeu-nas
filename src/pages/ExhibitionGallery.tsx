import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/0002.webp'), title: 'Opening Night' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/001.webp'), title: 'Light Studies' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/009.webp'), title: 'Curated Flow' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/012.webp'), title: 'Install Detail' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.webp'),
  idealFor: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/003.webp'),
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
    pricing: { body: string; cta: string }
  }>('services.pages.exhibition-gallery')
  return (
    <>
      <SEOMeta
        title={locale === 'de' ? 'Ausstellungsdokumentation Berlin' : 'Exhibition Documentation Berlin'}
        description={locale === 'de' ? 'Foto- und Videodokumentation für Galerien, Museen und Kulturinstitutionen in Berlin. Pressefertige Lieferung. Kleines Team. 24-Stunden-Turnaround.' : 'Photo and video documentation for galleries, museums and cultural institutions in Berlin. Press-ready delivery. Small crew. 24-hour turnaround.'}
        ogTitle={locale === 'de' ? 'Ausstellungsdokumentation Berlin | expose.u' : 'Exhibition Documentation Berlin | expose.u'}
        ogDescription={locale === 'de' ? 'Foto- und Videodokumentation für Galerien, Museen und Kulturinstitutionen in Berlin. Pressefertige Lieferung. Kleines Team. 24-Stunden-Turnaround.' : 'Full opening and exhibition coverage. Delivered for press, funding, and archive. Berlin-based.'}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services/exhibition-gallery' : 'https://expose-u.com/services/exhibition-gallery'}
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
        editorialPricingBody={page.pricing.body}
        editorialPricingCta={page.pricing.cta}
        editorialPricingCtaHref="/contact?service=exhibition-gallery"
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
