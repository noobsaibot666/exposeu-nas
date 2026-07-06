export type ServiceSlug =
  | 'concerts-events'
  | 'exhibition-gallery'
  | 'artist-sessions'
  | 'brand-agency'
  | 'release-content-kit'
  | 'popups'
  | 'gallery-museum'
  | 'artist-musician'

export type ServiceMeta = {
  slug: ServiceSlug
  label: string
  labelKey: string
  shortLabelKey: string
  href: string
}

export const serviceMeta: Record<ServiceSlug, ServiceMeta> = {
  'concerts-events': {
    slug: 'concerts-events',
    label: 'Concert & Live Event Documentation',
    labelKey: 'services.labels.concerts-events',
    shortLabelKey: 'services.labels.concerts-events-short',
    href: '/services/concerts-events',
  },
  'exhibition-gallery': {
    slug: 'exhibition-gallery',
    label: 'Exhibition & Gallery Documentation',
    labelKey: 'services.labels.exhibition-gallery',
    shortLabelKey: 'services.labels.exhibition-gallery-short',
    href: '/services/exhibition-gallery',
  },
  'artist-sessions': {
    slug: 'artist-sessions',
    label: 'Artist Sessions & Portraits',
    labelKey: 'services.labels.artist-sessions',
    shortLabelKey: 'services.labels.artist-sessions-short',
    href: '/services/artist-sessions',
  },
  'brand-agency': {
    slug: 'brand-agency',
    label: 'Brand & Agency Events',
    labelKey: 'services.labels.brand-agency',
    shortLabelKey: 'services.labels.brand-agency-short',
    href: '/services/brand-agency',
  },
  'release-content-kit': {
    slug: 'release-content-kit',
    label: 'Release Content Kit',
    labelKey: 'services.labels.release-content-kit',
    shortLabelKey: 'services.labels.release-content-kit-short',
    href: '/release-content-kit',
  },
  popups: {
    slug: 'popups',
    label: 'Pop-ups',
    labelKey: 'services.labels.popups',
    shortLabelKey: 'services.labels.popups-short',
    href: '/popups',
  },
  'gallery-museum': {
    slug: 'gallery-museum',
    label: 'Gallery & Museum Documentation',
    labelKey: 'services.labels.gallery-museum',
    shortLabelKey: 'services.labels.gallery-museum-short',
    href: '/gallery-museum-documentation',
  },
  'artist-musician': {
    slug: 'artist-musician',
    label: 'Artist & Musician Documentation',
    labelKey: 'services.labels.artist-musician',
    shortLabelKey: 'services.labels.artist-musician-short',
    href: '/artist-musician-documentation',
  },
}

export const serviceList: ServiceMeta[] = [
  serviceMeta['exhibition-gallery'],
  serviceMeta['brand-agency'],
  serviceMeta['concerts-events'],
  serviceMeta['artist-sessions'],
]
