import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg'), title: 'Portrait' },
  { image: resolveImagePath('/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg'), title: 'In Studio' },
  { image: resolveImagePath('/src/assets/images/Pinonsecrets.jpg'), title: 'Process' },
  { image: resolveImagePath('/src/assets/images/PinonShowww.jpg'), title: 'Live Moment' },
]

function ArtistSessions() {
  return (
    <WorkPageLayout
      title="Artist Sessions"
      heroCopy="Portraits and BTS for artists that feel honest, stylized, and ready to publish across releases."
      detail="You’ll get portraits, process, and studio moments that make your work feel personal."
      cards={heroCards}
      galleryTitle="Why artists work with us"
      galleryCopy="We align on tone, styling, and pacing so you leave with assets for press, socials, and partner decks."
      gallery={[
        {
          title: 'Personality first',
          subtitle: 'Portraits aligned to your aesthetic with lighting, styling, and pacing.',
        },
        {
          title: 'Process captured',
          subtitle: 'Hands, tools, and in-between moments that show how the work is made.',
        },
        {
          title: 'One session, full set',
          subtitle: 'BTS, live moments, and clean portraits in one shoot.',
        },
        {
          title: 'Press-ready delivery',
          subtitle: 'Edits and stills organized for media and partners.',
        },
      ]}
      extraGalleryTitle="What you get"
      extraGalleryCopy="A streamlined shoot that delivers portraits, process, and launch-ready assets without slowing you down."
      extraGallery={[
        {
          title: 'Shotlist and mood',
          subtitle: 'We align on looks, props, and beats before we roll.',
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
          subtitle: 'Fast turnaround on selects to tease the release.',
        },
      ]}
      extraGallerySecondaryTitle="How we work"
      extraGallerySecondaryCopy="Small crew, quick setup, and a calm set so you can stay in your flow."
      extraGallerySecondary={[
        { title: 'One producer', subtitle: 'Single contact for scheduling and approvals.' },
        { title: 'Lean footprint', subtitle: 'Minimal gear so your space stays clear.' },
        { title: 'On-set direction', subtitle: 'Light coaching to keep you relaxed and consistent.' },
        { title: 'Fast delivery', subtitle: 'Selects quickly; finals right after.' },
      ]}
      ctaText="Book an artist session. Share your date, location, and release goals."
      ctaHref="/contact"
      serviceSlug="artist-sessions"
    />
  )
}

export default ArtistSessions
