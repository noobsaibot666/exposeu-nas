import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/visualelectric-1755373701143.png', title: 'Opening Night' },
  { image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg', title: 'Light Studies' },
  { image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg', title: 'Curated Flow' },
]

const galleryItems = [
  { image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg', title: 'Immersive Room' },
  { image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg', title: 'Ambient Motion' },
  { image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', title: 'Art Walkthrough' },
  { image: '/src/assets/images/PinonShowww.jpg', title: 'Vernissage' },
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
      gallery={galleryItems}
      ctaText="Need an exhibition filmed or photographed? Let’s plan the shot list and delivery."
      ctaHref="/call-session"
    />
  )
}

export default Exhibitions
