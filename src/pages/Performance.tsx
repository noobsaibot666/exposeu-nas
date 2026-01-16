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
      galleryTitle="Why producers book us"
      galleryCopy="We balance crowd energy and artist focus, then deliver edits you can share, sell, and archive quickly."
      gallery={[
        { title: 'Energy and detail', subtitle: 'Crowd and artist documentation without losing the vibe.' },
        { title: 'Clean sightlines', subtitle: 'Angles planned so every key moment is usable.' },
        { title: 'Audio-aware shooting', subtitle: 'Footage paced to the beat with clean sound pulls.' },
        { title: 'Shareable fast', subtitle: 'Selects and reels ready while the show is still hot.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Performance packages that give you hype reels and archival quality documentation."
      extraGallery={[
        { title: 'Multi-format delivery', subtitle: 'Vertical reels, wides, and stills in one drop.' },
        { title: 'Hero edits', subtitle: 'Short and long cuts tailored for socials and partners.' },
        { title: 'Backstage and crowd', subtitle: 'Texture shots beyond the stage.' },
        { title: 'Usage notes', subtitle: 'Organized files with naming and clearance guidance.' },
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
