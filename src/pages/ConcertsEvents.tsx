import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_012.png'), title: 'Live Set' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_015.png'), title: 'Stage Glow' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/7_HERO_023.png'), title: 'Energy Capture' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_002.png'), title: 'Motion Freeze' },
]

function ConcertsEvents() {
  return (
    <WorkPageLayout
      title="Concert & Live Events"
      heroCopy="Cinematic photo and film for concerts, live sets, and stage events."
      detail="Captured live. Delivered same night or next morning, ready to publish."
      cards={heroCards}
      galleryTitle="What's included."
      galleryCopy="Organized files delivered fast — built for immediate use."
      gallery={[
        { title: 'Stage coverage', subtitle: 'Key cues, wide moments, and hero frames.' },
        { title: 'Crowd & atmosphere', subtitle: 'Energy and context without obstructing the room.' },
        { title: 'Same-night selects', subtitle: 'Priority frames for press and social, delivered fast.' },
        { title: 'Full organized set', subtitle: 'Named files ready for publishing and archive.' },
      ]}
      extraGalleryTitle="Ideal for"
      extraGalleryCopy="Anyone who needs live moments captured cleanly and turned around fast."
      extraGallery={[
        { title: 'Venue and festival teams', subtitle: 'Season recaps, event coverage, and press assets.' },
        { title: 'Touring artists', subtitle: 'One show, multiple outputs — social, press, and archive.' },
        { title: 'Club and promoter programs', subtitle: 'Recurring shoots with consistent visual style.' },
      ]}
      ctaText="Let's cover your next show."
      ctaHref="/contact"
      ctaDetail="Berlin-based. Response within 24 hours."
      serviceSlug="concerts-events"
    />
  )
}

export default ConcertsEvents
