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
      title="Exhibition & Gallery Documentation"
      heroCopy="Exhibition and gallery photo and film for press, archive, and curatorial record."
      detail="Clean spatial coverage that shows sequence, scale, artworks, and opening atmosphere."
      cards={heroCards}
      galleryTitle="Press-ready coverage for the full show."
      galleryCopy="Delivered to read clearly across press, archive, and partner use."
      gallery={[
        { title: 'Installation stills', subtitle: 'Wide rooms, key works, and clean sightlines.' },
        { title: 'Opening selects', subtitle: 'Guest atmosphere without staged moments.' },
        { title: 'Detail frames', subtitle: 'Materials, labels, and installation decisions.' },
        { title: 'Organized finals', subtitle: 'Named folders ready for press and archive.' },
      ]}
      extraGalleryTitle="Choose this when the whole exhibition needs to read clearly."
      extraGalleryCopy="Best for teams that need the full spatial story, not just highlights."
      extraGallery={[
        { title: 'Gallery exhibitions', subtitle: 'Shows where sequence and room flow matter.' },
        { title: 'Institutional installs', subtitle: 'Programs that need archive and partner-ready sets.' },
        { title: 'Opening nights', subtitle: 'Events needing both artwork and audience coverage.' },
      ]}
      extraGallerySecondaryTitle="Exhibition & Gallery Documentation explains the full space and story."
      extraGallerySecondaryCopy="Use this when spatial clarity, opening atmosphere, and gallery communication need one coherent set."
      extraGallerySecondary={[
        { title: 'Choose Exhibition & Gallery Documentation', subtitle: 'For rooms, works, openings, and curatorial flow.' },
        { title: 'Choose Artist Sessions', subtitle: 'For portrait-led releases, studio work, and profile assets.' },
      ]}
      ctaText="Request availability for your exhibition dates."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="exhibition-gallery"
    />
  )
}

export default ExhibitionGallery
