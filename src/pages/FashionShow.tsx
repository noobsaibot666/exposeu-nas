import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_014.png'), title: 'Runway Light' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_015.png'), title: 'Backstage' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_017.png'), title: 'Final Walk' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_041.png'), title: 'Fabric Motion' },
]

function FashionShow() {
  return (
    <WorkPageLayout
      title="Fashion Show"
      heroCopy="Runway and backstage coverage for PR, sponsors, and same-day selects."
      detail="Built for look-by-look clarity, backstage context, and fast editorial delivery."
      cards={heroCards}
      galleryTitle="Editorial assets for the full show day."
      galleryCopy="Delivered for runway recap, PR outreach, and sponsor follow-up."
      gallery={[
        { title: 'Runway frames', subtitle: 'Look-by-look stills with clean sightlines.' },
        { title: 'Backstage selects', subtitle: 'Prep, fittings, and team moments.' },
        { title: 'Priority edits', subtitle: 'Fast selects for press and sponsor use.' },
        { title: 'Organized finals', subtitle: 'Folders sorted for PR, archive, and review.' },
      ]}
      extraGalleryTitle="Choose this when one show needs multiple outputs fast."
      extraGalleryCopy="Best for designers, PR teams, producers, and sponsor-facing recap."
      extraGallery={[
        { title: 'Press pushes', subtitle: 'When same-day hero frames are non-negotiable.' },
        { title: 'Show recaps', subtitle: 'When runway and backstage both matter.' },
        { title: 'Brand archives', subtitle: 'When each look needs a clean long-term record.' },
      ]}
      extraGallerySecondaryTitle="Fashion Show is runway-first. Performance is cue-first."
      extraGallerySecondaryCopy="Choose this when look order, backstage access, and PR speed lead the brief."
      extraGallerySecondary={[
        { title: 'Choose Fashion Show', subtitle: 'For runway accuracy, backstage access, and look-by-look delivery.' },
        { title: 'Choose Performance', subtitle: 'For stage action, audience energy, and live cue timing.' },
      ]}
      ctaText="Request availability for your show dates."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="fashion-show"
    />
  )
}

export default FashionShow
