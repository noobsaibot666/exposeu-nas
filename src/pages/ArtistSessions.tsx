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
      title="Artist Sessions & Portraits"
      heroCopy="Portrait sessions and studio stills for artists, musicians, and creatives."
      detail="A focused session with selects built for press kits, release campaigns, and profiles."
      cards={heroCards}
      galleryTitle="What's included."
      galleryCopy="Built to feel honest, current, and ready to publish."
      gallery={[
        { title: 'Portrait set', subtitle: 'Multiple framings — press, web, and album art.' },
        { title: 'Studio and process stills', subtitle: 'Workspace, tools, and making context.' },
        { title: 'Short motion clips', subtitle: 'Optional BTS assets for posts and teasers.' },
        { title: 'Organized delivery', subtitle: 'Finals grouped for fast publishing and reuse.' },
      ]}
      extraGalleryTitle="Ideal for"
      extraGalleryCopy="Artists who need a clean, current asset set to support a release or project."
      extraGallery={[
        { title: 'Release campaigns', subtitle: 'Portraits and process shots for albums and singles.' },
        { title: 'Press and profile updates', subtitle: 'New images for booking, PR, and platform profiles.' },
        { title: 'Ongoing studio work', subtitle: 'Regular sessions without needing a full event shoot.' },
      ]}
      ctaText="Let's plan your session."
      ctaHref="/contact"
      ctaDetail="Berlin-based. Response within 24 hours."
      serviceSlug="artist-sessions"
    />
  )
}

export default ArtistSessions
