export type ServiceSlug =
  | 'documentation'
  | 'gallery-stories'
  | 'artist-sessions'
  | 'performance'
  | 'fashion-show'
  | 'atmospheric'

export type ServiceMeta = {
  slug: ServiceSlug
  label: string
  href: string
}

export const serviceMeta: Record<ServiceSlug, ServiceMeta> = {
  documentation: {
    slug: 'documentation',
    label: 'Exhibitions',
    href: '/documentation',
  },
  'gallery-stories': {
    slug: 'gallery-stories',
    label: 'Gallery Stories',
    href: '/gallery-stories',
  },
  'artist-sessions': {
    slug: 'artist-sessions',
    label: 'Artist Sessions',
    href: '/artist-sessions',
  },
  performance: {
    slug: 'performance',
    label: 'Performance',
    href: '/performance',
  },
  'fashion-show': {
    slug: 'fashion-show',
    label: 'Fashion Show',
    href: '/fashion-show',
  },
  atmospheric: {
    slug: 'atmospheric',
    label: 'Atmospheric Films',
    href: '/atmospheric',
  },
}

export const serviceList: ServiceMeta[] = [
  serviceMeta.documentation,
  serviceMeta['gallery-stories'],
  serviceMeta['artist-sessions'],
  serviceMeta.performance,
  serviceMeta['fashion-show'],
  serviceMeta.atmospheric,
]
