import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/9_16/2_GW_024.png'), title: 'Curator Voice' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_013.png'), title: 'Install Details' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/9_16/7_HERO_015.png'), title: 'Space Flow' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_025.png'), title: 'Patron Moments' },
]

function GalleryStories() {
  return (
    <WorkPageLayout
      title="Gallery Stories"
      heroCopy="Social-first gallery coverage for openings, interviews, and program stories."
      detail="Short edits and stills built for release posts, press, and collector updates."
      cards={heroCards}
      galleryTitle="Publish-ready story assets for one program or release."
      galleryCopy="Built to move fast across social, press, and collector communication."
      gallery={[
        { title: 'Interview edits', subtitle: 'Short and long cuts with clean audio.' },
        { title: 'Story stills', subtitle: 'Frames for posts, releases, and web use.' },
        { title: 'B-roll selects', subtitle: 'Space, works, guests, and key moments.' },
        { title: 'Structured delivery', subtitle: 'Folders and timestamps ready to publish.' },
      ]}
      extraGalleryTitle="Choose this when you need a clear story, not only room views."
      extraGalleryCopy="Best for teams leading with voice, narrative, or social distribution."
      extraGallery={[
        { title: 'Opening campaigns', subtitle: 'When the story needs to travel across channels.' },
        { title: 'Collector updates', subtitle: 'When context matters as much as the work itself.' },
        { title: 'Program series', subtitle: 'When each release needs the same clear format.' },
      ]}
      extraGallerySecondaryTitle="Gallery Stories is social-first. Exhibitions is space-first."
      extraGallerySecondaryCopy="Choose this when interviews, narrative order, and post-ready edits lead the brief."
      extraGallerySecondary={[
        { title: 'Choose Gallery Stories', subtitle: 'For interviews, social edits, and release sequences.' },
        { title: 'Choose Exhibitions', subtitle: 'For full-room coverage, installation clarity, and archive use.' },
      ]}
      ctaText="Request availability for your next gallery story."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="gallery-stories"
    />
  )
}

export default GalleryStories
