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
      title="Artist Sessions"
      heroCopy="Portrait and process coverage for artists, releases, and press kits."
      detail="A focused session for portraits, studio details, and launch-ready selects."
      cards={heroCards}
      galleryTitle="A clean asset set for launches, profiles, and ongoing use."
      galleryCopy="Built to feel honest, current, and ready to publish."
      gallery={[
        { title: 'Portrait set', subtitle: 'Multiple framings for press, web, and releases.' },
        { title: 'Process stills', subtitle: 'Hands, tools, studio, and making context.' },
        { title: 'Short motion clips', subtitle: 'Optional BTS assets for posts and teasers.' },
        { title: 'Organized delivery', subtitle: 'Finals grouped for fast publishing and reuse.' },
      ]}
      extraGalleryTitle="Choose this when the artist needs to be front and center."
      extraGalleryCopy="Best for portraits, release campaigns, profiles, and studio communication."
      extraGallery={[
        { title: 'Album and release visuals', subtitle: 'When portraits lead the campaign.' },
        { title: 'Artist profiles', subtitle: 'When personality and process both matter.' },
        { title: 'Studio updates', subtitle: 'When you need ongoing assets without a full event shoot.' },
      ]}
      extraGallerySecondaryTitle="Artist Sessions centers the person. Performance centers the live moment."
      extraGallerySecondaryCopy="Choose this when portrait, process, and controlled pacing matter most."
      extraGallerySecondary={[
        { title: 'Choose Artist Sessions', subtitle: 'For portrait-led releases, studio work, and profile assets.' },
        { title: 'Choose Performance', subtitle: 'For live action, timing, crowd energy, and stage cues.' },
      ]}
      ctaText="Request availability for your artist session."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="artist-sessions"
    />
  )
}

export default ArtistSessions
