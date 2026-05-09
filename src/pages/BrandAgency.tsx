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
    extraGalleryCopy: string
    extraGallery: Array<{ title: string; subtitle: string }>
  }>('services.pages.brand-agency')
  return (
    <>
      <SEOMeta
        title="Brand & Agency Events"
        description="Brand and agency event documentation in Berlin. Editorial photo and video coverage with fast turnaround."
        ogTitle="Brand Event Documentation Berlin — expose.u"
        ogDescription="Editorial coverage for brand events, launches, and activations in Berlin. Clean, sharp, on deadline."
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
        extraGalleryTitle={t('services.shared.idealFor')}
        extraGalleryCopy={page.extraGalleryCopy}
        extraGallery={page.extraGallery}
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
