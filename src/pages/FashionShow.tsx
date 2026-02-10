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
      galleryCopy="Runway coverage must be exact, fast, and consistent."
      gallery={[
        { title: 'Look accuracy', subtitle: 'Each look captured cleanly.' },
        { title: 'Fabric motion', subtitle: 'Movement and texture remain sharp.' },
        { title: 'Runway discipline', subtitle: 'Angles stay consistent by look.' },
        { title: 'PR speed', subtitle: 'Selects ready for same-day use.' },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Editorial delivery built for press, socials, and archive."
      extraGallery={[
        { title: 'Runway set', subtitle: 'Look-by-look frames for PR.' },
        { title: 'Backstage', subtitle: 'Prep and fittings without disruption.' },
        { title: 'Same-day selects', subtitle: 'Priority frames within hours.' },
        { title: 'Delivery', subtitle: 'Named folders and usage notes.' },
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
