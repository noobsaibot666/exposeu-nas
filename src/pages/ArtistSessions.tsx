import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg', title: 'Portrait' },
  { image: '/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg', title: 'In Studio' },
  { image: '/src/assets/images/Pinonsecrets.jpg', title: 'Process' },
  { image: '/src/assets/images/PinonShowww.jpg', title: 'Live Moment' },
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
      gallery={[
        {
          title: 'Personality first',
          subtitle: 'Portraits that feel like you—lighting, styling, and pacing aligned to your aesthetic.',
        },
        {
          title: 'Process captured',
          subtitle: 'Hands, tools, and in-between moments that show how the work is made.',
        },
        {
          title: 'BTS + performance',
          subtitle: 'One session covers BTS, live moments, and clean portraits to anchor your drop.',
        },
        {
          title: 'Press-ready delivery',
          subtitle: 'Edits and stills organized for media, partners, and your own channels.',
        },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="A streamlined shoot that gives you portraits, process, and launch-ready assets without slowing you down."
      extraGallery={[
        {
          title: 'Shotlist + mood',
          subtitle: 'We align on looks, props, and story beats before we roll.',
        },
        {
          title: 'Mixed formats',
          subtitle: 'Portraits, vertical reels, and wide stills delivered together.',
        },
        {
          title: 'Usage clarity',
          subtitle: 'Clear file names and usage notes so you can publish fast.',
        },
        {
          title: 'Quick selects',
          subtitle: 'Fast turn on selects so you can tease the drop immediately.',
        },
      ]}
      extraGallerySecondaryTitle="How we work"
      extraGallerySecondaryCopy="Small crew, quick setup, and a calm set so you can stay in your flow."
      extraGallerySecondary={[
        { title: 'One producer', subtitle: 'Single contact for scheduling and approvals.' },
        { title: 'Lean footprint', subtitle: 'Minimal gear so your space stays clear and comfortable.' },
        { title: 'On-set direction', subtitle: 'Light coaching to keep you relaxed and consistent on camera.' },
        { title: 'Fast wrap + delivery', subtitle: 'We hand off selects quickly, with final edits right after.' },
      ]}
      ctaText="Book an artist session—portraits, process, and BTS in one shoot."
      ctaHref="/contact"
    />
  )
}

export default ArtistSessions
