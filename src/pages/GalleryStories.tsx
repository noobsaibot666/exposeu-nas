import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/visualelectric-1755373701143.png'), title: 'Curator Voice' },
  { image: resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'), title: 'Install Details' },
  { image: resolveImagePath('/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg'), title: 'Space Flow' },
  { image: resolveImagePath('/src/assets/images/PinonTheWall.jpg'), title: 'Patron Moments' },
]

function GalleryStories() {
  return (
    <WorkPageLayout
      title="Gallery Stories"
      heroCopy="Short films and photo essays that tell the story behind the space—curator intent, artist voice, and the feel of the room."
      detail="Perfect for socials, press kits, and collector previews."
      cards={heroCards}
      galleryTitle="Why galleries call us"
      galleryCopy="We script light, pacing, and interview beats to deliver a narrative that feels honest and elevated—ready for your patrons and partners."
      gallery={[
        { title: 'Story architecture', subtitle: 'We map curator intent, artist voice, and patron experience into a clear narrative.' },
        { title: 'Interviews that land', subtitle: 'Guided prompts so speakers sound natural and concise.' },
        { title: 'Space + detail', subtitle: 'Wide establishing frames and close details that feel intentional.' },
        { title: 'For patrons + press', subtitle: 'Cuts sized for socials, websites, and media kits.' },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="A complete story package—interviews, b-roll, and stills—delivered in formats ready to share."
      extraGallery={[
        { title: 'Interview cuts', subtitle: 'Clean audio, captions, and multiple lengths per platform.' },
        { title: 'B-roll library', subtitle: 'Organized clips of the space, works, and interactions.' },
        { title: 'Press stills', subtitle: 'Hi-res frames for catalogues and media drops.' },
        { title: 'Usage clarity', subtitle: 'Folders with permissions and suggested pairings.' },
      ]}
      extraGallerySecondaryTitle="How we produce"
      extraGallerySecondaryCopy="Tight schedules, lean crews, and pre-pro that keeps you focused on guests."
      extraGallerySecondary={[
        { title: 'Pre-pro calls', subtitle: 'Outline story beats, must-capture works, and voices.' },
        { title: 'Lean crew', subtitle: 'Small footprint to stay discreet during tours and events.' },
        { title: 'Run-of-show sync', subtitle: 'We align with your agenda to capture key moments.' },
        { title: 'Fast edits', subtitle: 'Selects and finished cuts delivered on a clear timeline.' },
      ]}
      ctaText="Let’s craft your next gallery story. We’ll tailor the shoot to your audience."
      ctaHref="/contact"
    />
  )
}

export default GalleryStories
