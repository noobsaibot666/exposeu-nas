import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_010.png'), title: 'Curator Voice' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_013.png'), title: 'Install Details' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_020.png'), title: 'Space Flow' },
  { image: resolveImagePath('/src/assets/images/services/2_gallery_work/2_GW_025.png'), title: 'Patron Moments' },
]

function GalleryStories() {
  return (
    <WorkPageLayout
      title="Gallery Stories"
      heroCopy="Short films and photo essays that translate the space with curator intent and artist voice."
      detail="Built for socials, press kits, and collector previews with clear deliverables and fast turnaround."
      cards={heroCards}
      galleryTitle="Why gallery teams choose us"
      galleryCopy="We structure the story, guide interviews, and deliver a package ready for patrons, press, and partners."
      gallery={[
        { title: 'Story architecture', subtitle: 'We map curator intent, artist voice, and visitor experience into a clear narrative.' },
        { title: 'Interviews that land', subtitle: 'Guided prompts so speakers sound natural and concise.' },
        { title: 'Space and detail', subtitle: 'Wide establishing frames and close details that show the work clearly.' },
        { title: 'Multi-use cuts', subtitle: 'Versions sized for socials, web, and media kits.' },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="A complete story package with interviews, b-roll, and stills ready to share."
      extraGallery={[
        { title: 'Interview cuts', subtitle: 'Clean audio, captions, and multiple lengths per platform.' },
        { title: 'B-roll library', subtitle: 'Organized clips of the space, works, and interactions.' },
        { title: 'Press stills', subtitle: 'Hi-res frames for catalogues and media drops.' },
        { title: 'Usage clarity', subtitle: 'Folder structure and naming for fast publishing.' },
      ]}
      extraGallerySecondaryTitle="How we produce"
      extraGallerySecondaryCopy="Tight schedules, lean crews, and pre-pro that keeps you focused on guests."
      extraGallerySecondary={[
        { title: 'Pre-pro call', subtitle: 'Align on story beats, key works, and voices.' },
        { title: 'Lean crew', subtitle: 'Small footprint to stay discreet during tours and events.' },
        { title: 'Run-of-show sync', subtitle: 'We align with your agenda to capture key moments.' },
        { title: 'Fast edits', subtitle: 'Selects in 48h; finals on an agreed schedule.' },
      ]}
      ctaText="Book a gallery story. Share your date, venue, and goals."
      ctaHref="/contact"
      serviceSlug="gallery-stories"
    />
  )
}

export default GalleryStories
