import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroImage = resolveImagePath('/src/assets/images/landing/agency_hero_01.webp')

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/6_brand_agency/6_BA_gallery.webp'),
  idealFor: resolveImagePath('/src/assets/images/services/6_brand_agency/6_BA_idealFor.webp'),
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
    galleryTitle: string
    galleryCopy: string
    gallery: Array<{ title: string; subtitle: string }>
    extraGalleryCopy: string
    extraGallery: Array<{ title: string; subtitle: string }>
    pricing: { body: string; cta: string }
  }>('services.pages.brand-agency')
  return (
    <>
      <SEOMeta
        title={locale === 'de' ? 'Brand & Agency Dokumentation Berlin' : 'Brand & Agency Documentation Berlin'}
        description={locale === 'de' ? 'Foto- und Videodokumentation für Markenaktivierungen, Agenturen und gestaltete Erfahrungen in Berlin. Award-Einreichungen, Fallstudien, Kundenpräsentationen.' : 'Photo and video documentation for brand activations, agencies and designed experiences in Berlin. Award submissions, case studies, client presentations.'}
        ogTitle={locale === 'de' ? 'Brand & Agency Dokumentation Berlin | expose.u' : 'Brand & Agency Documentation Berlin | expose.u'}
        ogDescription={locale === 'de' ? 'Dokumentation für gestaltete Erfahrungen. Foto und Video für Agenturen, Markenaktivierungen und Installationen in Berlin.' : 'Documentation for designed experiences. Photo and video for agencies, brand activations and installations in Berlin.'}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services/brand-agency' : 'https://expose-u.com/services/brand-agency'}
        lang={locale}
      />
      <WorkPageLayout
        title={page.title}
        heroCopy={page.heroCopy}
        detail={page.detail}
        socialProof={page.socialProof}
        heroImage={heroImage}
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
