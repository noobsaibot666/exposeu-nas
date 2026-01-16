import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/_thumb/9_16/6_AF_001.png'), title: 'Moody Portraits' },
  { image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/_thumb/9_16/6_AF_019.png'), title: 'Slow Motion' },
  { image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/_thumb/9_16/6_AF_013.png'), title: 'Ambient Scenes' },
  { image: resolveImagePath('/src/assets/images/services/6_atmospheric_film/_thumb/9_16/6_AF_023.png'), title: 'Stillness & Tone' },
]

function Atmospheric() {
  return (
    <WorkPageLayout
      /* Hero */
      title="Atmospheric"
      heroCopy="Tone-rich visuals built to set a mood with tight framing and patient movement."
      detail="For teaser films, lookbooks, and art pieces that need a lush, textural feel."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it works"
      galleryCopy="We design motion and stills that feel handcrafted with rich blacks, intentional grain, and pacing that lets the scene bloom."
      gallery={[
        { title: 'Mood boards to frames', subtitle: 'We translate your references into lighting setups and camera moves.' },
        { title: 'Texture and tone', subtitle: 'Rich blacks, intentional grain, and tactile color.' },
        { title: 'Pacing for feeling', subtitle: 'Slow camera, long takes, and breathing room.' },
        { title: 'Sound and motion', subtitle: 'Ambient soundbeds and subtle movement that feels immersive.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Atmospheric packages tuned for teasers, lookbooks, and art films ready to drop across channels."
      extraGallery={[
        { title: 'Deliverables set', subtitle: 'Vertical reels, widescreen cuts, and still pulls in one delivery.' },
        { title: 'Look and grade', subtitle: 'Custom LUTs and grading that match your palette.' },
        { title: 'Music beds', subtitle: 'Licensed tracks or bespoke soundbeds to hold the tone.' },
        { title: 'Usage clarity', subtitle: 'Organized folders with usage notes for partners and press.' },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we shoot"
      extraGallerySecondaryCopy="Lean crew, thoughtful prelight, and a calm set so the mood stays intact."
      extraGallerySecondary={[
        { title: 'Prelight and tests', subtitle: 'We dial light and color before talent arrives.' },
        { title: 'Small footprint', subtitle: 'Minimal gear to keep the set quiet and nimble.' },
        { title: 'On-set direction', subtitle: 'Clear cues to keep movement slow and intentional.' },
        { title: 'Swift handoff', subtitle: 'Selects and cuts fast so you can release while the buzz is fresh.' },
      ]}
      /* CTA */
      ctaText="Book an atmospheric shoot. Share your mood, date, and goals."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="atmospheric"
    />
  )
}

export default Atmospheric
