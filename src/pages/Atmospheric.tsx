import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', title: 'Moody Portraits' },
  { image: '/src/assets/images/Daydream.jpg', title: 'Slow Motion' },
  { image: '/src/assets/images/bg01.jpg', title: 'Ambient Scenes' },
]

const galleryItems = [
  { image: '/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg', title: 'Studio Texture' },
  { image: '/src/assets/images/f2905fd98e2710a6e4b42098b9836c5c.jpg', title: 'Smoke + Light' },
  { image: '/src/assets/images/cfcb07dd865328849ba617c98ae71eb3.jpg', title: 'Color Fields' },
  { image: '/src/assets/images/PinonTheWall.jpg', title: 'Stillness & Tone' },
]

function Atmospheric() {
  return (
    <WorkPageLayout
      title="Atmospheric"
      heroCopy="Tone-heavy visuals built to set a mood—tight framing, patient movement, and lighting that breathes."
      detail="For teaser films, lookbooks, and art pieces that need a lush, textural feel."
      cards={heroCards}
      galleryTitle="Why it lands"
      galleryCopy="We design motion and stills that feel handcrafted—rich blacks, intentional grain, and pacing that lets the scene bloom."
      gallery={galleryItems}
      ctaText="Let’s craft your next atmospheric shoot. Tell us the mood and we’ll handle the rest."
      ctaHref="/call-session"
    />
  )
}

export default Atmospheric
