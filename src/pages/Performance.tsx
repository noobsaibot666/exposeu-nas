import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', title: 'Live Set' },
  { image: '/src/assets/images/PinonShowww.jpg', title: 'Stage Glow' },
  { image: '/src/assets/images/Pinonnovelawalcyr.png', title: 'Energy Capture' },
]

const galleryItems = [
  { image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg', title: 'Crowd + Artist' },
  { image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg', title: 'Motion Freeze' },
  { image: '/src/assets/images/PinonTheWall.jpg', title: 'Lighting Story' },
  { image: '/src/assets/images/Pinonsecrets.jpg', title: 'Backstage' },
]

function Performance() {
  return (
    <WorkPageLayout
      title="Performance"
      heroCopy="High-impact coverage for live sets—fast instincts, clean angles, and lighting that tracks the beat."
      detail="From soundcheck to encore, we capture the energy without losing the artistry."
      cards={heroCards}
      galleryTitle="Why it works"
      galleryCopy="We balance crowd energy with artist focus, delivering assets you can share, sell, and archive right after the show."
      gallery={galleryItems}
      ctaText="Need your performance covered? Let’s lock in the brief and crew."
      ctaHref="/call-session"
    />
  )
}

export default Performance
