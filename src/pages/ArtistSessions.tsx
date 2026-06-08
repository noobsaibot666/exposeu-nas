import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import { SEOMeta } from '../components/SEOMeta'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0022.jpeg'), title: 'Portrait' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/024.jpg'), title: 'In Studio' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0016.jpg'), title: 'Process' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0014.jpg'), title: 'Live Moment' },
]

const sectionImages = {
  gallery: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/0021.jpeg'),
  idealFor: resolveImagePath('/src/assets/images/services/3_artist_sessions/_incoming/gallery/DSC_4950.jpg'),
}

function ArtistSessions() {
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
    pricing: { title?: string; body: string; cta: string }
  }>('services.pages.artist-sessions')
  return (
    <>
      <SEOMeta
        title={locale === 'de' ? 'Artist Sessions Berlin — Editoriale Inhalte für Künstler:innen — expose.u' : 'Artist Sessions Berlin — Editorial Content for Artists — expose.u'}
        description={locale === 'de' ? 'Foto- und Videosessions für Künstler:innen, Releases und kreative Kampagnen in Berlin. Presseportraits, Vertical Content, Kampagnen-Visuals. 400–700 €.' : 'Photo and video sessions for artists, releases and creative campaigns in Berlin. Press portraits, vertical content, campaign visuals. €400–700.'}
        ogTitle={locale === 'de' ? 'Artist Sessions Berlin — expose.u' : 'Artist Sessions Berlin — expose.u'}
        ogDescription={locale === 'de' ? 'Foto- und Videosessions für Künstler:innen, Releases und kreative Kampagnen in Berlin. Presseportraits, Vertical Content, Kampagnen-Visuals. 400–700 €.' : 'Studio and location sessions for musicians and visual artists. Press-ready results, fast.'}
        canonical={locale === 'de' ? 'https://expose-u.com/de/services/artist-sessions' : 'https://expose-u.com/services/artist-sessions'}
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
        editorialPricingTitle={page.pricing.title}
        editorialPricingBody={page.pricing.body}
        editorialPricingCta={page.pricing.cta}
        editorialPricingCtaHref="/contact?service=artist-sessions"
        ctaText={page.ctaText}
        ctaLabel={page.footerCtaLabel}
        ctaHref="/contact"
        ctaDetail={t('services.shared.responseTime')}
        serviceSlug="artist-sessions"
      />
    </>
  )
}

export default ArtistSessions
