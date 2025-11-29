import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', title: 'Runway Light' },
  { image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg', title: 'Backstage' },
  { image: '/src/assets/images/PinonShowww.jpg', title: 'Final Walk' },
]

const galleryItems = [
  { image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg', title: 'Lookbook Pulls' },
  { image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg', title: 'Motion & Fabric' },
  { image: '/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg', title: 'Designer Details' },
  { image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg', title: 'Press Ready' },
]

function FashionShow() {
  return (
    <WorkPageLayout
      title="Fashion Show"
      heroCopy="Runway coverage with attitude—sharp angles, fabric motion, and the energy from backstage to finale."
      detail="For designers, producers, and PR teams who need quick-turn assets that feel editorial."
      cards={heroCards}
      galleryTitle="Why fashion teams hire us"
      galleryCopy="We sync with your show flow, capture looks cleanly, and deliver both hero shots and social cuts fast."
      gallery={galleryItems}
      ctaText="Line up your next fashion show coverage—let’s lock the brief and timing."
      ctaHref="/call-session"
    />
  )
}

export default FashionShow
