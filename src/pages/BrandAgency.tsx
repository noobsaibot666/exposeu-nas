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
      heroCopy="Brand and agency event coverage for launches, activations, and same-day delivery."
      detail="Hero frames, editorial selects, and organized finals — built for PR speed and sponsor review."
      cards={heroCards}
      galleryTitle="What's included."
      galleryCopy="Delivered for event recap, PR outreach, and campaign follow-up."
      gallery={[
        { title: 'Hero brand moments', subtitle: 'Clean frames of product, guests, and atmosphere.' },
        { title: 'Behind-the-scenes selects', subtitle: 'Prep, production, and team context.' },
        { title: 'Priority selects', subtitle: 'Same-day frames for press and sponsor review.' },
        { title: 'Organized full delivery', subtitle: 'Folders sorted for PR, campaign, and archive.' },
      ]}
      extraGalleryTitle="Ideal for"
      extraGalleryCopy="Agencies and brand teams that need fast, editorial-quality assets with clear output."
      extraGallery={[
        { title: 'PR and launch events', subtitle: 'Same-day hero frames for press outreach.' },
        { title: 'Brand activations', subtitle: 'Audience, product, and production covered in one shoot.' },
        { title: 'Ongoing brand archives', subtitle: 'Each activation documented consistently for long-term use.' },
      ]}
      ctaText="Let's cover your event."
      ctaHref="/contact"
      ctaDetail="Berlin-based. Response within 24 hours."
      serviceSlug="brand-agency"
    />
  )
}

export default BrandAgency
