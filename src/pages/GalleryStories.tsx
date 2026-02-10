import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/9_16/2_GW_024.png'), title: 'Curator Voice' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_013.png'), title: 'Install Details' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/_thumb/9_16/7_HERO_015.png'), title: 'Space FLow' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_025.png'), title: 'Patron Moments' },
]

function GalleryStories() {
  return (
    <WorkPageLayout
      /* Hero */
      title="Gallery Stories"
      heroCopy="Short films and photo essays that translate the space with curator intent and artist voice."
      detail="Built for socials, press kits, and collector previews with clear deliverables and fast turnaround."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it matters"
      galleryCopy="Gallery stories turn a program into a clear narrative for press and collectors."
      gallery={[
        { title: 'Narrative', subtitle: 'Story beats connect works, artists, and program.' },
        { title: 'Context', subtitle: 'Curator voice anchors the release.' },
        { title: 'Translation', subtitle: 'Assets formatted for media and social.' },
        { title: 'Continuity', subtitle: 'Reusable structure for series and seasons.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="A publish-ready story package built for web and press."
      extraGallery={[
        { title: 'Interview cuts', subtitle: 'Short and long edits with clean audio.' },
        { title: 'B-roll set', subtitle: 'Space, works, and audience moments grouped.' },
        { title: 'Press stills', subtitle: 'Hi-res frames for releases and catalogues.' },
        { title: 'Delivery', subtitle: 'Structured folders and timestamps.' },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we produce"
      extraGallerySecondaryCopy="Tight schedules, lean crews, and pre-pro that keeps you focused on guests."
      extraGallerySecondary={[
        { title: 'Pre-pro call', subtitle: 'Align on story beats, key works, and voices.' },
        { title: 'Lean crew', subtitle: 'Small footprint to stay discreet during tours and events.' },
        { title: 'Run-of-show sync', subtitle: 'We align with your agenda to capture key moments.' },
        { title: 'Fast edits', subtitle: 'Selects in 48h; finals on an agreed schedule.' },
      ]}
      /* CTA */
      ctaText="Book a gallery story. Share your date, venue, and goals."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="gallery-stories"
    />
  )
}

export default GalleryStories
