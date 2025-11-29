import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', title: 'Portrait' },
  { image: '/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg', title: 'In Studio' },
  { image: '/src/assets/images/Pinonsecrets.jpg', title: 'Process' },
]

const galleryItems = [
  { image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', title: 'On Set' },
  { image: '/src/assets/images/PinonShowww.jpg', title: 'Live Moment' },
  { image: '/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg', title: 'Texture Study' },
  { image: '/src/assets/images/d3eef75d7c0616b67215308172bf30d5.jpg', title: 'Studio Still' },
]

function ArtistSessions() {
  return (
    <WorkPageLayout
      title="Artist Sessions"
      heroCopy="Portraits and BTS built for artists—honest, stylized, and fast to deploy across your drops."
      detail="We capture process, personality, and the little details that make your work yours."
      cards={heroCards}
      galleryTitle="Why artists book us"
      galleryCopy="We collaborate on tone, styling, and pacing so you leave with assets that feel like your voice—ready for press, socials, and partner decks."
      gallery={galleryItems}
      ctaText="Book an artist session—portraits, process, and BTS in one shoot."
      ctaHref="/call-session"
    />
  )
}

export default ArtistSessions
