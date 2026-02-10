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
      /* Hero */
      title="Performance"
      heroCopy="Live performance photo and video with fast instincts and clean angles."
      detail="From soundcheck to encore, you get artist focus, crowd energy, and usable assets fast."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it matters"
      galleryCopy="Live work is time-sensitive. Coverage has to be precise, low-intrusion, and faithful to the atmosphere."
      gallery={[
        { title: 'Low intrusion', subtitle: 'Lean footprint that respects performers and audience.' },
        { title: 'Timing discipline', subtitle: 'Cues and moments captured without missing beats.' },
        { title: 'Movement clarity', subtitle: 'Angles that hold motion without blur or chaos.' },
        { title: 'Atmosphere preserved', subtitle: 'Crowd energy captured without overt staging.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Coverage designed for immediate release and long-term archive."
      extraGallery={[
        { title: 'Multi-format delivery', subtitle: 'Vertical reels, wides, and stills together.' },
        { title: 'Live cuts', subtitle: 'Short and extended edits for socials and partners.' },
        { title: 'Backstage texture', subtitle: 'Selects that complete the story beyond the stage.' },
        { title: 'Organized handoff', subtitle: 'Clear naming and structure for fast publishing.' },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we run shows"
      extraGallerySecondaryCopy="We sync with your run-of-show, keep gear lean, and hand off selects quickly."
      extraGallerySecondary={[
        { title: 'Run-through prep', subtitle: 'Align on cues, blackouts, and lighting changes.' },
        { title: 'Lean crew', subtitle: 'Minimal footprint to stay out of sight and on time.' },
        { title: 'Audio coordination', subtitle: 'Board feeds or patch options when available.' },
        { title: 'Rapid delivery', subtitle: 'Same-night or next-day selects; finals right after.' },
      ]}
      /* CTA */
      ctaText="Book performance documentation. Share your date, venue, and run-of-show."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="performance"
    />
  )
}

export default Performance
