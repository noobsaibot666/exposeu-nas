import { resolveImagePath } from '../utils/resolveImagePath'
import WorkPageLayout from './WorkPageLayout'

const heroCards = [
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_014.png'), title: 'Runway Light' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_015.png'), title: 'Backstage' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/_thumb/9_16/5_FS_017.png'), title: 'Final Walk' },
  { image: resolveImagePath('/src/assets/images/services/5_fashion_show/5_FS_041.png'), title: 'Fabric Motion' },
]

function BrandAgency() {
  return (
    <WorkPageLayout
      title="Brand & Agency Events"
      heroCopy="Brand, agency, runway, and activation coverage for PR, sponsors, and same-day selects."
      detail="Built for brand moments, guest energy, backstage context, and fast editorial delivery."
      cards={heroCards}
      galleryTitle="Editorial assets for the full event day."
      galleryCopy="Delivered for event recap, PR outreach, campaign updates, and sponsor follow-up."
      gallery={[
        { title: 'Hero frames', subtitle: 'Clean brand moments, guests, and atmosphere.' },
        { title: 'Behind-the-scenes selects', subtitle: 'Prep, production, and team moments.' },
        { title: 'Priority edits', subtitle: 'Fast selects for press and sponsor use.' },
        { title: 'Organized finals', subtitle: 'Folders sorted for PR, campaign, archive, and review.' },
      ]}
      extraGalleryTitle="Choose this when one brand moment needs multiple outputs fast."
      extraGalleryCopy="Best for agencies, PR teams, producers, designers, and sponsor-facing recap."
      extraGallery={[
        { title: 'Press pushes', subtitle: 'When same-day hero frames are non-negotiable.' },
        { title: 'Launch recaps', subtitle: 'When audience, product, and production all matter.' },
        { title: 'Brand archives', subtitle: 'When each activation needs a clean long-term record.' },
      ]}
      extraGallerySecondaryTitle="Brand & Agency Events is campaign-first. Concert & Live Event Documentation is live-first."
      extraGallerySecondaryCopy="Choose this when brand objectives, partner deliverables, and PR speed lead the brief."
      extraGallerySecondary={[
        { title: 'Choose Brand & Agency Events', subtitle: 'For launches, activations, PR events, and sponsor delivery.' },
        { title: 'Choose Concert & Live Event Documentation', subtitle: 'For stage action, audience energy, and live cue timing.' },
      ]}
      ctaText="Request availability for your brand or agency event."
      ctaHref="/contact"
      ctaDetail="Clear deliverables. Berlin-based. Simple proposal."
      serviceSlug="brand-agency"
    />
  )
}

export default BrandAgency
