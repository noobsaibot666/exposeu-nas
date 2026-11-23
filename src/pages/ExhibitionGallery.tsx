import { resolveImagePath } from '../utils/resolveImagePath'
import servicePreviewImages from '../data/servicePreviewImages.json'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroImage = resolveImagePath(servicePreviewImages['exhibition-gallery'])

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/008.webp'),
  idealFor: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_incoming/gallery/cyrus_riffs_An_artist_standing_inside_a_contemporary_art_gall_798e7cc7-ede5-44a9-a92e-5d0bf2ec3c30_1.webp'),
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
        title={t('common.meta.services.exhibition.title')}
        description={t('common.meta.services.exhibition.description')}
        ogTitle={t('common.meta.services.exhibition.title')}
        ogDescription={t('common.meta.services.exhibition.description')}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services/exhibition-gallery' : 'https://expose-u.com/services/exhibition-gallery'}
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
