export type ServiceSlug =
  | 'concerts-events'
  | 'exhibition-gallery'
  | 'artist-sessions'
  | 'brand-agency'

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
}

export const serviceList: ServiceMeta[] = [
  serviceMeta['concerts-events'],
  serviceMeta['exhibition-gallery'],
  serviceMeta['artist-sessions'],
  serviceMeta['brand-agency'],
]
