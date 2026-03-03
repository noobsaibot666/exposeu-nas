import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_012.png'), title: 'Live Set' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_015.png'), title: 'Stage Glow' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/7_HERO_023.png'), title: 'Energy Capture' },
  { image: resolveImagePath('/src/assets/images/services/4_performance_doc/_thumb/9_16/4_PD_002.png'), title: 'Motion Freeze' },
]

function Performance() {
  return (
    <WorkPageLayout
      title="Performance"
      heroCopy="Live performance photo and film with fast timing and clean coverage."
      detail="Built for stage action, crowd energy, and fast post-show delivery."
      cards={heroCards}
      galleryTitle="Fast-turnaround assets for live sets, programs, and venue teams."
      galleryCopy="Captured with a low footprint and handed off for immediate use."
      gallery={[
        { title: 'Stage coverage', subtitle: 'Key cues, wide moments, and hero frames.' },
        { title: 'Crowd context', subtitle: 'Audience energy captured without blocking the room.' },
        { title: 'Recap assets', subtitle: 'Short edits and stills for next-day release.' },
        { title: 'Clean handoff', subtitle: 'Files named for quick publishing and archive.' },
      ]}
      extraGalleryTitle="Choose this when timing and live action matter most."
      extraGalleryCopy="Best for performances, club programs, and stage-based events."
      extraGallery={[
        { title: 'Stage productions', subtitle: 'When cues, light shifts, and timing drive the brief.' },
        { title: 'Venue marketing', subtitle: 'When recap assets need to land fast.' },
        { title: 'Touring artists', subtitle: 'When one show must convert into multiple outputs.' },
      ]}
      extraGallerySecondaryTitle="Performance is live-first. Artist Sessions is portrait-first."
      extraGallerySecondaryCopy="Choose this when motion, cues, and crowd atmosphere matter more than posed portraits."
      extraGallerySecondary={[
        { title: 'Choose Performance', subtitle: 'For live moments, crowd energy, and recap delivery.' },
        { title: 'Choose Artist Sessions', subtitle: 'For portraits, process, and controlled studio pacing.' },
      ]}
      ctaText="Request availability for your performance dates."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="performance"
    />
  )
}

export default Performance
