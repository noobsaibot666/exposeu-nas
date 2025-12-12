import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'), title: 'Live Set' },
  { image: resolveImagePath('/src/assets/images/PinonShowww.jpg'), title: 'Stage Glow' },
  { image: resolveImagePath('/src/assets/images/Pinonnovelawalcyr.png'), title: 'Energy Capture' },
  { image: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'), title: 'Motion Freeze' },
]

function Performance() {
  return (
    <WorkPageLayout
      title="Performance"
      heroCopy="High-impact coverage for live sets—fast instincts, clean angles, and lighting that tracks the beat."
      detail="From soundcheck to encore, we capture the energy without losing the artistry."
      cards={heroCards}
      galleryTitle="Why it works"
      galleryCopy="We balance crowd energy with artist focus, delivering assets you can share, sell, and archive right after the show."
      gallery={[
        { title: 'Energy + detail', subtitle: 'Crowd, artist, and stage captured without losing the vibe.' },
        { title: 'Clean sightlines', subtitle: 'Angles planned so every key moment is covered and usable.' },
        { title: 'Audio-aware shooting', subtitle: 'Footage paced to the beat, with sound pulls for edits.' },
        { title: 'Shareable fast', subtitle: 'Selects and reels ready quickly so you can post while it’s hot.' },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="Performance packages that give you both hype reels and archival quality coverage."
      extraGallery={[
        { title: 'Multi-format delivery', subtitle: 'Vertical reels, wides, and stills delivered together.' },
        { title: 'Hero edits', subtitle: 'Short and long cuts tailored for socials and partners.' },
        { title: 'Backstage + crowd', subtitle: 'Texture shots that show the atmosphere beyond the stage.' },
        { title: 'Usage notes', subtitle: 'Organized files with naming and clearance guidance.' },
      ]}
      extraGallerySecondaryTitle="How we run shows"
      extraGallerySecondaryCopy="We sync with your run-of-show, keep gear lean, and hand off selects quickly."
      extraGallerySecondary={[
        { title: 'Run-through prep', subtitle: 'Align on cues, blackout moments, and lighting changes.' },
        { title: 'Lean crew', subtitle: 'Minimal footprint to stay out of sight and on-time.' },
        { title: 'Audio coordination', subtitle: 'Patch options or board feeds when available for cleaner sound.' },
        { title: 'Rapid delivery', subtitle: 'Same-night or next-day selects; finals right after.' },
      ]}
      ctaText="Need your performance covered? Let’s lock in the brief and crew."
      ctaHref="/contact"
    />
  )
}

export default Performance
