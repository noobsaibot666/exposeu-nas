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
      heroCopy="Exhibition coverage that mirrors your curation—polished frames, controlled light, and the mood your viewers feel in the room."
      detail="We blend documentation and storytelling so every install, detail, and guest moment lands exactly as intended."
      cards={heroCards}
      galleryTitle="Why bring us in"
      galleryCopy="We move quietly through the space, shaping light and angles that honor the work and the curator’s vision. Your show looks as intentional on screen as it does on the walls."
      gallery={[
        {
          title: 'Art-first angles',
          subtitle: 'We plan shots with curators to respect sightlines, lighting, and the narrative of the install.',
        },
        {
          title: 'Guest experience',
          subtitle: 'Candid reactions and atmosphere so patrons, press, and partners feel the room from afar.',
        },
        {
          title: 'Deliverables that work',
          subtitle: 'Press-ready stills, social cuts, and full recaps—organized and delivered fast.',
        },
        {
          title: 'On-brand pacing',
          subtitle: 'Edits that match your tone—minimalist, bold, or intimate—so every output feels like you.',
        },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="We handle the capture and delivery end-to-end so you can focus on your artists, guests, and partners."
      extraGallery={[
        {
          title: 'Shotlist alignment',
          subtitle: 'We pre-plan must-have angles, key works, and people to feature so nothing is missed.',
        },
        {
          title: 'Deliverables mapped',
          subtitle: 'Press-ready stills, reels, and long-form recaps delivered in organized folders with usage notes.',
        },
        {
          title: 'Flexible coverage',
          subtitle: 'From installs to openings to talks—we staff for your needs and scale crew up or down.',
        },
        {
          title: 'Post built for speed',
          subtitle: 'Color, sound, and edits tuned to your brand; quick-turn selects so you can post while the buzz is live.',
        },
      ]}
      extraGallerySecondaryTitle="How we work with you"
      extraGallerySecondaryCopy="Clear communication, lean crews, and fast delivery—so you can focus on the show while we handle the capture."
      extraGallerySecondary={[
        {
          title: 'Single point of contact',
          subtitle: 'One producer to align schedules, approvals, and delivery.',
        },
        {
          title: 'Flexible crews',
          subtitle: 'Scale from solo to multi-cam depending on your space and run-of-show.',
        },
        {
          title: 'Permits & logistics',
          subtitle: 'We handle house rules, gear approvals, and access needs before the shoot.',
        },
        {
          title: 'Editing cadence',
          subtitle: 'Daily selects, weekly cuts, and final masters timed to your announcements.',
        },
      ]}
      ctaText="Need an exhibition filmed or photographed? Let’s plan the shot list and delivery."
      ctaHref="/contact"
    />
  )
}

export default Exhibitions
