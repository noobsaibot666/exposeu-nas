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
      galleryCopy="Atmospheric work relies on pacing and restraint. The images need space to breathe and a sound logic that supports the mood."
      gallery={[
        { title: 'Intentional pacing', subtitle: 'Long takes and quiet movement that let scenes unfold.' },
        { title: 'Cinematic restraint', subtitle: 'Composition and light that avoid excess and hold tone.' },
        { title: 'Mood continuity', subtitle: 'Consistent color and texture across frames.' },
        { title: 'Sound logic', subtitle: 'Ambient beds and sequence choices that deepen mood.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="A focused set of visuals built for teasers, lookbooks, and art films."
      extraGallery={[
        { title: 'Mood film', subtitle: 'A concise cut built to hold attention and tone.' },
        { title: 'Still pulls', subtitle: 'Frames extracted for web, press, and socials.' },
        { title: 'Grade package', subtitle: 'LUTs and finals that match your palette.' },
        { title: 'Sound bed', subtitle: 'Licensed or bespoke sound to support the edit.' },
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
