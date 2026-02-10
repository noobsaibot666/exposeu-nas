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
      galleryCopy="Gallery stories give context to a program. The structure needs to serve collectors, press, and public audiences."
      gallery={[
        { title: 'Narrative spine', subtitle: 'Clear sequencing that connects works, artists, and program intent.' },
        { title: 'Press framing', subtitle: 'Quotes and visuals that translate cleanly for media use.' },
        { title: 'Interview clarity', subtitle: 'Guided prompts with clean audio and concise delivery.' },
        { title: 'Program continuity', subtitle: 'Assets that support recurring drops and seasonal cycles.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="A story package built for publishing across web, socials, and press kits."
      extraGallery={[
        { title: 'Interview edits', subtitle: 'Short and long cuts with clean audio and captions.' },
        { title: 'B-roll library', subtitle: 'Space, works, and audience moments grouped by theme.' },
        { title: 'Press stills', subtitle: 'Hi-res frames ready for catalogues and releases.' },
        { title: 'Structured delivery', subtitle: 'Naming, folders, and timestamps for quick handoff.' },
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
