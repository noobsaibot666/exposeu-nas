import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/visualelectric-1755373701143.png'), title: 'Opening Night' },
  { image: resolveImagePath('/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg'), title: 'Light Studies' },
  { image: resolveImagePath('/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg'), title: 'Curated Flow' },
  { image: resolveImagePath('/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg'), title: 'Install Detail' },
]

function Exhibitions() {
  return (
    <WorkPageLayout
      title="Exhibitions"
      heroCopy="Exhibition photo and video that preserves your curation with controlled light and clean sightlines."
      detail="Installation coverage, guest atmosphere, and press-ready selects delivered fast and organized for teams and media."
      cards={heroCards}
      galleryTitle="Why galleries book us"
      galleryCopy="We plan angles with your curator, work quietly, and deliver assets that look as intentional online as on the walls."
      gallery={[
        {
          title: 'Curator-aligned angles',
          subtitle: 'Shot list built with the curator to preserve sightlines and intent.',
        },
        {
          title: 'Guest atmosphere',
          subtitle: 'Candid reactions and crowd flow that show the room’s energy.',
        },
        {
          title: 'Press-ready delivery',
          subtitle: 'Stills and cuts labeled and organized for press, socials, and partners.',
        },
        {
          title: 'Brand-matched edits',
          subtitle: 'Minimalist, bold, or intimate pacing to match your tone.',
        },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="We handle capture and delivery end to end so you can focus on artists, guests, and partners."
      extraGallery={[
        {
          title: 'Shotlist and schedule',
          subtitle: 'We map works, key moments, and timing before the opening.',
        },
        {
          title: 'Deliverables mapped',
          subtitle: 'Press stills, reels, and recap cuts with clear usage notes.',
        },
        {
          title: 'Flexible crew',
          subtitle: 'Solo, dual, or multi-cam depending on the space and run-of-show.',
        },
        {
          title: 'Fast turnaround',
          subtitle: 'Selects in 24 to 48 hours, finals on an agreed timeline.',
        },
      ]}
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
      ctaText="Book exhibition coverage. Share your date, venue, and goals."
      ctaHref="/contact"
    />
  )
}

export default Exhibitions
