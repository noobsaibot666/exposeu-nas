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
      heroCopy="Project documentation for immersive builds, installations, and spatial experiences."
      detail="For studios, agencies, and production teams that need clear visuals for websites, pitch decks, and presentations."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it matters"
      galleryCopy="Your work is physical and time-based. Documentation must explain both clearly."
      gallery={[
        { title: 'Spatial reading', subtitle: 'Camera movement explains scale and flow.' },
        { title: 'Interaction clarity', subtitle: 'Key user moments are documented cleanly.' },
        { title: 'Context capture', subtitle: 'Environment, audience, and intent are visible.' },
        { title: 'Narrative order', subtitle: 'Footage follows a clear project sequence.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Deliverables prepared for client communication and case-study use."
      extraGallery={[
        { title: 'Project film', subtitle: 'Short edit for website and presentations.' },
        { title: 'Still set', subtitle: 'Curated frames for decks and press pages.' },
        { title: 'Clip selects', subtitle: 'Modular cuts for social and proposal reuse.' },
        { title: 'Structured finals', subtitle: 'Organized files for teams and handoff.' },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we shoot"
      extraGallerySecondaryCopy="Low-friction production with planning aligned to your build schedule."
      extraGallerySecondary={[
        { title: 'Pre-shoot sync', subtitle: 'We map objectives, usage, and key moments.' },
        { title: 'On-site coverage', subtitle: 'We document setup, interaction, and final state.' },
        { title: 'Editorial pass', subtitle: 'We shape footage for external and internal use.' },
        { title: 'Delivery handoff', subtitle: 'Finals arrive ready for web, decks, and archives.' },
      ]}
      /* CTA */
      ctaText="Need project documentation? Share scope, timeline, and delivery needs."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="atmospheric"
    />
  )
}

export default Atmospheric
