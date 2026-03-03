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
      title="Atmospheric"
      heroCopy="Spatial project documentation for launches, decks, websites, and case studies."
      detail="Built for immersive builds, installations, and environments that need to read clearly."
      cards={heroCards}
      galleryTitle="A clear visual package for physical and time-based work."
      galleryCopy="Delivered to explain scale, interaction, and final atmosphere in one set."
      gallery={[
        { title: 'Spatial stills', subtitle: 'Wide views that explain build, flow, and scale.' },
        { title: 'Interaction clips', subtitle: 'Key audience or user moments captured cleanly.' },
        { title: 'Project film', subtitle: 'Short cut for websites, decks, and presentations.' },
        { title: 'Structured finals', subtitle: 'Assets grouped for handoff, reuse, and archive.' },
      ]}
      extraGalleryTitle="Choose this when the environment itself is the product."
      extraGalleryCopy="Best for installations, brand activations, and spatial case-study work."
      extraGallery={[
        { title: 'Client presentations', subtitle: 'When the work must read fast in decks and proposals.' },
        { title: 'Launch assets', subtitle: 'When one activation needs web, social, and recap output.' },
        { title: 'Case studies', subtitle: 'When the project needs long-term reference material.' },
      ]}
      extraGallerySecondaryTitle="Atmospheric explains the environment. Exhibitions explains the curated show."
      extraGallerySecondaryCopy="Choose this when audience interaction and spatial use matter more than wall-by-wall artwork coverage."
      extraGallerySecondary={[
        { title: 'Choose Atmospheric', subtitle: 'For builds, interaction, and spatial storytelling.' },
        { title: 'Choose Exhibitions', subtitle: 'For artwork, room sequence, and curatorial record.' },
      ]}
      ctaText="Request availability for your spatial project."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="atmospheric"
    />
  )
}

export default Atmospheric
