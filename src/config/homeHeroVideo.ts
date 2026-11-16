// Self-hosted by default: public/assets/media/ ships with the site, and nginx
// serves /assets/ with a 30-day immutable cache (filenames are versioned).
// The env var can point at a CDN/R2 bucket instead. The MP4s are gitignored
// (*.mp4) and live in the NAS working copy, which deploy.sh copies into the
// build. See docs/media-hosting.md.
const mediaBaseUrl = (import.meta.env.VITE_HOME_HERO_VIDEO_BASE_URL?.trim() || '/assets/media').replace(/\/$/, '')

/** First-party hero MP4s (desktop landscape + mobile 9:16 crop). */
export const HOME_HERO_VIDEO_URLS: { desktop?: string; mobile?: string } = {
  ...(mediaBaseUrl ? {
    desktop: `${mediaBaseUrl}/home-hero-desktop-v2.mp4`,
    mobile: `${mediaBaseUrl}/home-hero-mobile-v2.mp4`,
  } : {}),
}

export const HOME_HERO_USES_NATIVE_VIDEO = Boolean(HOME_HERO_VIDEO_URLS.desktop && HOME_HERO_VIDEO_URLS.mobile)

/**
 * Fallback if the MP4s fail to load (e.g. a fresh checkout without
 * public/media/): the Vimeo background players used before V2.
 */
export const HOME_HERO_VIMEO_IDS = {
  desktop: '1228854165',
  mobile: '1228856768',
} as const

export const VIMEO_ORIGIN = 'https://player.vimeo.com'

export function buildHeroVimeoSrc(id: string): string {
  // background=1 → muted, looping, chrome-less autoplay; dnt=1 → no Vimeo
  // tracking cookies (the hero loads before any consent decision);
  // api=1 → postMessage control for pause/play and the early loop.
  return `${VIMEO_ORIGIN}/video/${id}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&dnt=1&api=1`
}
