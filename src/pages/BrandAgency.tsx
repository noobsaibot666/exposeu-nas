import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_014.png'), title: 'Runway Light' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_015.png'), title: 'Backstage' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_017.png'), title: 'Final Walk' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_041.png'), title: 'Fabric Motion' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_030.png'),
  idealFor: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_011.jpeg'),
}

function BrandAgency() {
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
  }>('services.pages.brand-agency')
  return (
    <>
      <SEOMeta
        title="Brand & Agency Documentation Berlin — expose.u"
        description="Photo and video documentation for brand activations, agencies and designed experiences in Berlin. Award submissions, case studies, client presentations."
        ogTitle="Brand & Agency Documentation Berlin — expose.u"
        ogDescription="Documentation for designed experiences. Photo and video for agencies, brand activations and installations in Berlin."
        canonical="https://expose-u.com/services/brand-agency"
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
        editorialPricingCtaHref="/contact?service=brand-agency&package=project"
        ctaText={page.ctaText}
        ctaLabel={page.footerCtaLabel}
        ctaHref="/contact"
        ctaDetail={t('services.shared.responseTime')}
        serviceSlug="brand-agency"
      />
    </>
  )
}

export default BrandAgency
