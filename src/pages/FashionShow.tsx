import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'), title: 'Runway Light' },
  { image: resolveImagePath('/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg'), title: 'Backstage' },
  { image: resolveImagePath('/src/assets/images/PinonShowww.jpg'), title: 'Final Walk' },
  { image: resolveImagePath('/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg'), title: 'Fabric Motion' },
]

function FashionShow() {
  return (
    <WorkPageLayout
      title="Fashion Show"
      heroCopy="Runway coverage with attitude—sharp angles, fabric motion, and the energy from backstage to finale."
      detail="For designers, producers, and PR teams who need quick-turn assets that feel editorial."
      cards={heroCards}
      galleryTitle="Why fashion teams hire us"
      galleryCopy="We sync with your show flow, capture looks cleanly, and deliver both hero shots and social cuts fast."
      gallery={[
        { title: 'Runway clarity', subtitle: 'Clean, flattering coverage of each look for designers and PR.' },
        { title: 'Backstage energy', subtitle: 'Candid prep, fittings, and final moments that tell the story.' },
        { title: 'Fabric + motion', subtitle: 'Angles and shutter choices that show texture and flow.' },
        { title: 'Press-ready delivery', subtitle: 'Hero images and reels ready for media and socials within days.' },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="Editorial-grade coverage plus fast delivery so your collection hits every channel on time."
      extraGallery={[
        { title: 'Lookbook pulls', subtitle: 'Isolated frames of each look, ready for e-comm or press kits.' },
        { title: 'Vertical + horizontal', subtitle: 'Reels, wides, and detail stills sized for every platform.' },
        { title: 'Designer features', subtitle: 'Selects spotlighting craft, details, and signature elements.' },
        { title: 'Usage notes', subtitle: 'Organized folders with naming, permissions, and delivery checklists.' },
      ]}
      extraGallerySecondaryTitle="How we cover shows"
      extraGallerySecondaryCopy="We plan with production, lock sightlines, and stay agile so we never miss a look."
      extraGallerySecondary={[
        { title: 'Show flow sync', subtitle: 'Coordinate cues, walk order, and key beats with your team.' },
        { title: 'Pit + roaming', subtitle: 'Primary angle plus roaming coverage for varied perspectives.' },
        { title: 'Low footprint', subtitle: 'Minimal rigging to keep aisles clear and timelines tight.' },
        { title: 'Same-day selects', subtitle: 'Priority frames day-of; full delivery follows quickly.' },
      ]}
      ctaText="Line up your next fashion show coverage—let’s lock the brief and timing."
      ctaHref="/contact"
    />
  )
}

export default FashionShow
