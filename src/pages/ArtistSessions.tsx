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
      galleryCopy="Artist sessions shape identity. The assets should work across releases, press kits, and web without feeling staged."
      gallery={[
        {
          title: 'Identity assets',
          subtitle: 'Portraits aligned to your aesthetic and release cycle.',
        },
        {
          title: 'Process context',
          subtitle: 'Hands, tools, and studio moments that show how work is made.',
        },
        {
          title: 'Release versatility',
          subtitle: 'Assets sized for web, socials, press, and partner decks.',
        },
        {
          title: 'Press-ready clarity',
          subtitle: 'Clean edits and structured delivery for fast use.',
        },
      ]}
      /* What you get */
      extraGalleryTitle="What you get"
      extraGalleryCopy="A streamlined shoot that delivers portraits, process, and launch-ready assets."
      extraGallery={[
        {
          title: 'Shotlist and mood',
          subtitle: 'Looks, props, and beats aligned before the session.',
        },
        {
          title: 'Portrait set',
          subtitle: 'Clean hero portraits in multiple framings.',
        },
        {
          title: 'Process coverage',
          subtitle: 'BTS and studio details that add context.',
        },
        {
          title: 'Delivery structure',
          subtitle: 'Organized folders and naming for immediate use.',
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
