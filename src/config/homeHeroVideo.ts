const mediaBaseUrl = import.meta.env.VITE_HOME_HERO_VIDEO_BASE_URL?.trim().replace(/\/$/, '')

export const HOME_HERO_VIDEO_URLS: { desktop?: string; mobile?: string } = {
  ...(mediaBaseUrl ? {
    desktop: `${mediaBaseUrl}/home-hero-desktop-v1.mp4`,
    mobile: `${mediaBaseUrl}/home-hero-mobile-v1.mp4`,
  } : {}),
}
