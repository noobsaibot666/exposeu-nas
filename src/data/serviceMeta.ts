export type ServiceSlug =
  | 'concerts-events'
  | 'exhibition-gallery'
  | 'artist-sessions'
  | 'brand-agency'

export type ServiceMeta = {
  slug: ServiceSlug
  label: string
  href: string
}

export const serviceMeta: Record<ServiceSlug, ServiceMeta> = {
  'concerts-events': {
    slug: 'concerts-events',
    label: 'Concert & Live Event Documentation',
    href: '/services/concerts-events',
  },
  'exhibition-gallery': {
    slug: 'exhibition-gallery',
    label: 'Exhibition & Gallery Documentation',
    href: '/services/exhibition-gallery',
  },
  'artist-sessions': {
    slug: 'artist-sessions',
    label: 'Artist Sessions & Portraits',
    href: '/services/artist-sessions',
  },
  'brand-agency': {
    slug: 'brand-agency',
    label: 'Brand & Agency Events',
    href: '/services/brand-agency',
  },
}

export const serviceList: ServiceMeta[] = [
  serviceMeta['concerts-events'],
  serviceMeta['exhibition-gallery'],
  serviceMeta['artist-sessions'],
  serviceMeta['brand-agency'],
]
