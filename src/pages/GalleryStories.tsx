import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/visualelectric-1755373701143.png', title: 'Curator Voice' },
  { image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg', title: 'Install Details' },
  { image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg', title: 'Space Flow' },
]

const galleryItems = [
  { image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', title: 'Artist Spotlight' },
  { image: '/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg', title: 'Studio Texture' },
  { image: '/src/assets/images/FuturisticInterior-RomanPrytuliak.jpg', title: 'Environment' },
  { image: '/src/assets/images/PinonTheWall.jpg', title: 'Framed Narrative' },
]

function GalleryStories() {
  return (
    <WorkPageLayout
      title="Gallery Stories"
      heroCopy="Short films and photo essays that tell the story behind the space—curator intent, artist voice, and the feel of the room."
      detail="Perfect for socials, press kits, and collector previews."
      cards={heroCards}
      galleryTitle="Why galleries call us"
      galleryCopy="We script light, pacing, and interview beats to deliver a narrative that feels honest and elevated—ready for your patrons and partners."
      gallery={galleryItems}
      ctaText="Let’s craft your next gallery story. We’ll tailor the shoot to your audience."
      ctaHref="/call-session"
    />
  )
}

export default GalleryStories
