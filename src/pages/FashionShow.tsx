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
      galleryTitle="Why it matters"
      galleryCopy="Fashion coverage is time-sensitive. Each look needs clarity, and PR needs assets fast without losing runway discipline."
      gallery={[
        { title: 'Look-by-look precision', subtitle: 'Each look documented cleanly for PR and press.' },
        { title: 'Backstage discipline', subtitle: 'Focused coverage of prep without interrupting flow.' },
        { title: 'Runway consistency', subtitle: 'Angles that hold silhouette, fabric, and movement.' },
        { title: 'Press turnaround', subtitle: 'Assets delivered fast for same-day distribution.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Editorial coverage ready for press, socials, and brand archives."
      extraGallery={[
        { title: 'Runway set', subtitle: 'Isolated frames of each look for press kits.' },
        { title: 'Backstage set', subtitle: 'Prep, fittings, and final checks in clean sequences.' },
        { title: 'Same-day selects', subtitle: 'Priority frames delivered while the show is current.' },
        { title: 'Structured delivery', subtitle: 'Folders, naming, and usage notes for PR teams.' },
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
