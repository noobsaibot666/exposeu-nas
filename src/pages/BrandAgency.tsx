import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/6_brand_agency/_thumb/9_16/6_BA_001.svg'), title: 'Activation Space' },
  { image: resolveImagePath('/src/assets/images/services/6_brand_agency/_thumb/9_16/6_BA_002.svg'), title: 'Installation Detail' },
  { image: resolveImagePath('/src/assets/images/services/6_brand_agency/_thumb/9_16/6_BA_003.svg'), title: 'Spatial Documentation' },
  { image: resolveImagePath('/src/assets/images/services/6_brand_agency/_thumb/9_16/6_BA_004.svg'), title: 'Agency Environment' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/6_brand_agency/6_BA_gallery.svg'),
  idealFor: resolveImagePath('/src/assets/images/services/6_brand_agency/6_BA_idealFor.svg'),
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
        title={locale === 'de' ? 'Brand & Agency Dokumentation Berlin — expose.u' : 'Brand & Agency Documentation Berlin — expose.u'}
        description={locale === 'de' ? 'Foto- und Videodokumentation für Markenaktivierungen, Agenturen und gestaltete Erfahrungen in Berlin. Award-Einreichungen, Fallstudien, Kundenpräsentationen.' : 'Photo and video documentation for brand activations, agencies and designed experiences in Berlin. Award submissions, case studies, client presentations.'}
        ogTitle={locale === 'de' ? 'Brand & Agency Dokumentation Berlin — expose.u' : 'Brand & Agency Documentation Berlin — expose.u'}
        ogDescription={locale === 'de' ? 'Dokumentation für gestaltete Erfahrungen. Foto und Video für Agenturen, Markenaktivierungen und Installationen in Berlin.' : 'Documentation for designed experiences. Photo and video for agencies, brand activations and installations in Berlin.'}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services/brand-agency' : 'https://expose-u.com/services/brand-agency'}
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
