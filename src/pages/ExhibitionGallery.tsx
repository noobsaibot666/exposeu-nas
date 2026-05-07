import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_thumb/9_16/2_GW_009.png'), title: 'Opening Night' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_037.png'), title: 'Light Studies' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_048.png'), title: 'Curated Flow' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_055.png'), title: 'Install Detail' },
]

function ExhibitionGallery() {
  return (
    <WorkPageLayout
      title="Exhibition & Gallery"
      heroCopy="Photo and film for exhibitions, openings, and gallery spaces."
      detail="Full spatial coverage — artworks, sequence, atmosphere, and opening night in one organized set."
      cards={heroCards}
      galleryTitle="What's included."
      galleryCopy="Delivered organized for press, archive, and partner distribution."
      gallery={[
        { title: 'Installation stills', subtitle: 'Wide rooms, key works, and clean sightlines.' },
        { title: 'Opening atmosphere', subtitle: 'Guest moments without staged scenes.' },
        { title: 'Detail frames', subtitle: 'Materials, labels, and installation close-ups.' },
        { title: 'Press-ready delivery', subtitle: 'Named folders sorted for immediate distribution.' },
      ]}
      extraGalleryTitle="Ideal for"
      extraGalleryCopy="Teams that need the full spatial and atmospheric story, not just highlights."
      extraGallery={[
        { title: 'Galleries and cultural institutions', subtitle: 'Shows with press, archive, and funder requirements.' },
        { title: 'Curators and artists', subtitle: 'Curatorial record, portfolio, and printed catalogue.' },
        { title: 'Opening nights', subtitle: 'Artworks and atmosphere covered in one session.' },
      ]}
      ctaText="Let's document your exhibition."
      ctaHref="/contact"
      ctaDetail="Berlin-based. Response within 24 hours."
      serviceSlug="exhibition-gallery"
    />
  )
}

export default ExhibitionGallery
