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
      galleryTitle="Why it matters"
      galleryCopy="Atmospheric films rely on restraint, pacing, and continuity."
      gallery={[
        { title: 'Pacing', subtitle: 'Slow movement that lets scenes breathe.' },
        { title: 'Restraint', subtitle: 'Composed frames without excess.' },
        { title: 'Continuity', subtitle: 'Mood and color stay consistent.' },
        { title: 'Sound logic', subtitle: 'Ambient beds support the sequence.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Deliverables built for teasers, loops, and release."
      extraGallery={[
        { title: 'Mood cut', subtitle: 'Concise film that holds tone.' },
        { title: 'Loopable selects', subtitle: 'Short pieces for installation or web.' },
        { title: 'Still pulls', subtitle: 'Frames for press and social.' },
        { title: 'Grade pack', subtitle: 'Finals matched to your palette.' },
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
