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
      galleryCopy="Exhibitions live in space. Coverage must preserve sequence, scale, and intent."
      gallery={[
        {
          title: 'Sequence',
          subtitle: 'Rooms read in order, with clear sightlines.',
        },
        {
          title: 'Scale',
          subtitle: 'Works shown at true size and spacing.',
        },
        {
          title: 'Curatorial intent',
          subtitle: 'Angles reflect placement, light, and design.',
        },
        {
          title: 'Archive use',
          subtitle: 'Sets ready for press, catalog, and record.',
        },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Installation and opening captured as a complete visual set."
      extraGallery={[
        {
          title: 'Pre-walk',
          subtitle: 'Key works, light, and angles mapped in advance.',
        },
        {
          title: 'Stills set',
          subtitle: 'Wide rooms, details, and hero works.',
        },
        {
          title: 'Opening coverage',
          subtitle: 'Guest atmosphere without staging.',
        },
        {
          title: 'Delivery',
          subtitle: 'Named folders ready for press and archive.',
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
