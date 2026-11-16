const mediaBaseUrl = import.meta.env.VITE_HOME_HERO_VIDEO_BASE_URL?.trim().replace(/\/$/, '')

/**
 * First-party MP4s (Cloudflare R2). Used when VITE_HOME_HERO_VIDEO_BASE_URL is
 * set at build time — see .env.example for the expected object names.
 */
export const HOME_HERO_VIDEO_URLS: { desktop?: string; mobile?: string } = {
  ...(mediaBaseUrl ? {
    desktop: `${mediaBaseUrl}/home-hero-desktop-v1.mp4`,
    mobile: `${mediaBaseUrl}/home-hero-mobile-v1.mp4`,
  } : {}),
}

export const HOME_HERO_USES_NATIVE_VIDEO = Boolean(HOME_HERO_VIDEO_URLS.desktop && HOME_HERO_VIDEO_URLS.mobile)

/**
 * Fallback while the R2 media is not provisioned: the Vimeo background players
 * the homepage used before the V2 audit. Without this the hero renders an empty
 * black box (no <source> elements), which is what production showed.
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
