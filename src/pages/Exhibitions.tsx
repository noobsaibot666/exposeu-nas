import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/_thumb/9_16/2_GW_009.png'), title: 'Opening Night' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_037.png'), title: 'Light Studies' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_048.png'), title: 'Curated Flow' },
  { image: resolveImagePath('/src/assets/images/services/1_exhibition_doc/1_ED_055.png'), title: 'Install Detail' },
]

function Exhibitions() {
  return (
    <WorkPageLayout
      /* Hero */
      title="Exhibitions"
      heroCopy="Exhibition photo and video that preserves your curation with controlled light and clean sightlines."
      detail="Installation documentation, guest atmosphere, and press-ready selects delivered fast and organized for teams and media."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it matters"
      galleryCopy="Exhibitions are spatial works. Documentation should preserve sequence, scale, and curatorial intent without distortion."
      gallery={[
        {
          title: 'Spatial reading',
          subtitle: 'Wide frames that hold sightlines, spacing, and viewer flow.',
        },
        {
          title: 'Curator-aligned angles',
          subtitle: 'Shot list aligned to intent and installation logic.',
        },
        {
          title: 'Install and opening coverage',
          subtitle: 'Quiet install stills plus opening-night atmosphere.',
        },
        {
          title: 'Archive-ready delivery',
          subtitle: 'Consistent naming for press, collectors, and records.',
        },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="A complete capture of installation and opening, delivered as usable stills and motion."
      extraGallery={[
        {
          title: 'Pre-visit plan',
          subtitle: 'We map works, light, and camera positions in advance.',
        },
        {
          title: 'Stills set',
          subtitle: 'Hi-res details, wide rooms, and hero works.',
        },
        {
          title: 'Motion recap',
          subtitle: 'Short social cuts plus a longer archive edit.',
        },
        {
          title: 'Delivery structure',
          subtitle: 'Folders and captions aligned to your comms needs.',
        },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we work with you"
      extraGallerySecondaryCopy="Clear communication, lean crews, and fast delivery so you can focus on the show."
      extraGallerySecondary={[
        {
          title: 'One producer',
          subtitle: 'Single contact for scheduling, approvals, and delivery.',
        },
        {
          title: 'Crew scale',
          subtitle: 'Add a second shooter or sound as needed.',
        },
        {
          title: 'Venue coordination',
          subtitle: 'We handle house rules, access, and gear approvals.',
        },
        {
          title: 'Delivery cadence',
          subtitle: 'Selects, reels, and masters aligned to your comms calendar.',
        },
      ]}
      /* CTA */
      ctaText="Book exhibition documentation. Share your date, venue, and goals."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="exhibitions"
    />
  )
}

export default Exhibitions
