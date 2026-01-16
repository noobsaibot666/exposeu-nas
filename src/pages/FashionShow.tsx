import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_014.png'), title: 'Runway Light' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_015.png'), title: 'Backstage' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_017.png'), title: 'Final Walk' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_041.png'), title: 'Fabric Motion' },
]

function FashionShow() {
  return (
    <WorkPageLayout
      /* Hero */
      title="Fashion Show"
      heroCopy="Runway photo and video with attitude, sharp angles, and fabric motion from backstage to finale."
      detail="For designers, producers, and PR teams who need fast editorial assets."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why fashion teams book us"
      galleryCopy="We sync with your show flow, capture every look cleanly, and deliver hero shots and social cuts fast."
      gallery={[
        { title: 'Runway clarity', subtitle: 'Clean documentation of each look for designers and PR.' },
        { title: 'Backstage energy', subtitle: 'Candid prep, fittings, and final moments.' },
        { title: 'Fabric and motion', subtitle: 'Angles and shutter choices that show texture and flow.' },
        { title: 'Press-ready delivery', subtitle: 'Hero images and reels ready for media and socials.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Editorial documentation and fast delivery so your collection hits every channel on time."
      extraGallery={[
        { title: 'Lookbook pulls', subtitle: 'Isolated frames of each look for press kits.' },
        { title: 'Vertical and horizontal', subtitle: 'Reels, wides, and detail stills for every platform.' },
        { title: 'Designer features', subtitle: 'Selects spotlighting craft and signature elements.' },
        { title: 'Usage notes', subtitle: 'Organized folders with naming and delivery checklists.' },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we cover shows"
      extraGallerySecondaryCopy="We plan with production, lock sightlines, and stay agile so we never miss a look."
      extraGallerySecondary={[
        { title: 'Show flow sync', subtitle: 'Coordinate cues, walk order, and key beats with your team.' },
        { title: 'Pit and roaming', subtitle: 'Primary angle and roaming documentation for varied perspectives.' },
        { title: 'Low footprint', subtitle: 'Minimal rigging to keep aisles clear and timelines tight.' },
        { title: 'Same-day selects', subtitle: 'Priority frames the day of; full delivery follows quickly.' },
      ]}
      /* CTA */
      ctaText="Book fashion show documentation. Share your date, venue, and show timing."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="fashion-show"
    />
  )
}

export default FashionShow
