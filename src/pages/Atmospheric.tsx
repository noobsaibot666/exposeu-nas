import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'), title: 'Moody Portraits' },
  { image: resolveImagePath('/src/assets/images/Daydream.jpg'), title: 'Slow Motion' },
  { image: resolveImagePath('/src/assets/images/bg01.jpg'), title: 'Ambient Scenes' },
  { image: resolveImagePath('/src/assets/images/PinonTheWall.jpg'), title: 'Stillness & Tone' },
]

function Atmospheric() {
  return (
    <WorkPageLayout
      title="Atmospheric"
      heroCopy="Tone-heavy visuals built to set a mood—tight framing, patient movement, and lighting that breathes."
      detail="For teaser films, lookbooks, and art pieces that need a lush, textural feel."
      cards={heroCards}
      galleryTitle="Why it lands"
      galleryCopy="We design motion and stills that feel handcrafted—rich blacks, intentional grain, and pacing that lets the scene bloom."
      gallery={[
        { title: 'Mood boards to frames', subtitle: 'We translate your references into lighting setups and camera moves that hold the vibe.' },
        { title: 'Texture + tone', subtitle: 'Rich blacks, intentional grain, and color that feels tactile, not over-processed.' },
        { title: 'Pacing for feeling', subtitle: 'Slow camera, long takes, and breathing room so scenes bloom on their own.' },
        { title: 'Sound + motion', subtitle: 'Ambient soundbeds and subtle moves that make short pieces feel immersive.' },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="Atmospheric packages tuned for teasers, lookbooks, and art films—ready to drop across channels."
      extraGallery={[
        { title: 'Deliverables set', subtitle: 'Vertical reels, widescreen cuts, and still pulls in one delivery.' },
        { title: 'Look & grade', subtitle: 'Custom LUTs and grading that match your palette.' },
        { title: 'Music beds', subtitle: 'Licensed tracks or bespoke soundbeds to hold the tone.' },
        { title: 'Usage clarity', subtitle: 'Organized folders with usage notes for partners and press.' },
      ]}
      extraGallerySecondaryTitle="How we shoot"
      extraGallerySecondaryCopy="Lean crew, thoughtful prelight, and a calm set so the mood stays intact."
      extraGallerySecondary={[
        { title: 'Prelight + tests', subtitle: 'We dial light and color before talent arrives.' },
        { title: 'Small footprint', subtitle: 'Minimal gear to keep the set quiet and nimble.' },
        { title: 'On-set direction', subtitle: 'Clear cues to keep movement slow and intentional.' },
        { title: 'Swift handoff', subtitle: 'Selects and cuts fast so you can release while the buzz is fresh.' },
      ]}
      ctaText="Let’s craft your next atmospheric shoot. Tell us the mood and we’ll handle the rest."
      ctaHref="/contact"
    />
  )
}

export default Atmospheric
