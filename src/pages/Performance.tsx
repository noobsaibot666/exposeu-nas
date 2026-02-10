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
      galleryCopy="Live work is fragile. Coverage must be precise and unobtrusive."
      gallery={[
        { title: 'Low profile', subtitle: 'Small crew that stays out of sight.' },
        { title: 'Timing', subtitle: 'Key moments captured without delays.' },
        { title: 'Atmosphere', subtitle: 'Crowd energy preserved, not staged.' },
        { title: 'Hero moments', subtitle: 'Clean frames for posters and press.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Assets ready for immediate release and archive."
      extraGallery={[
        { title: 'Multi-format', subtitle: 'Vertical, wides, and stills together.' },
        { title: 'Live edit', subtitle: 'Short recap plus extended cut.' },
        { title: 'Backstage', subtitle: 'Selects that add context.' },
        { title: 'Handoff', subtitle: 'Clear naming for quick publishing.' },
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
