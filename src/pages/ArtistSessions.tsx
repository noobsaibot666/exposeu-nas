import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_thumb/9_16/3_AS_017.png'), title: 'Portrait' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_015.png'), title: 'In Studio' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/3_AS_045.png'), title: 'Process' },
  { image: resolveImagePath('/src/assets/images/services/3_artist_sessions/_thumb/9_16/3_AS_012.png'), title: 'Live Moment' },
]

function ArtistSessions() {
  return (
    <WorkPageLayout
      /* Hero */
      title="Artist Sessions"
      heroCopy="Portraits and BTS for artists that feel honest, stylized, and ready to publish across releases."
      detail="You’ll get portraits, process, and studio moments that make your work feel personal."
      cards={heroCards}
      /* Primary gallery */
      galleryTitle="Why it matters"
      galleryCopy="Artist sessions define identity and release visuals without staging."
      gallery={[
        {
          title: 'Portrait truth',
          subtitle: 'Images that feel honest and current.',
        },
        {
          title: 'Process',
          subtitle: 'Hands, tools, and studio context.',
        },
        {
          title: 'Release kit',
          subtitle: 'Formats for web, press, and socials.',
        },
        {
          title: 'Consistency',
          subtitle: 'Cohesive set for ongoing use.',
        },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="Portraits and process delivered as a clean launch kit."
      extraGallery={[
        {
          title: 'Prep',
          subtitle: 'Mood and looks aligned ahead of shoot.',
        },
        {
          title: 'Portrait set',
          subtitle: 'Multiple framings for selection.',
        },
        {
          title: 'Studio set',
          subtitle: 'Details and BTS with context.',
        },
        {
          title: 'Delivery',
          subtitle: 'Organized folders ready to publish.',
        },
      ]}
      /* How we work */
      extraGallerySecondaryTitle="How we work"
      extraGallerySecondaryCopy="Small crew, quick setup, and a calm set so you can stay in your flow."
      extraGallerySecondary={[
        { title: 'One producer', subtitle: 'Single contact for scheduling and approvals.' },
        { title: 'Lean footprint', subtitle: 'Minimal gear so your space stays clear.' },
        { title: 'On-set direction', subtitle: 'Light coaching to keep you relaxed and consistent.' },
        { title: 'Fast delivery', subtitle: 'Selects quickly; finals right after.' },
      ]}
      /* CTA */
      ctaText="Book an artist session. Share your date, location, and release goals."
      ctaHref="/contact"
      /* Pricing overrides */
      serviceSlug="artist-sessions"
    />
  )
}

export default ArtistSessions
