import { useEffect, type RefObject } from 'react'

const NAV_HEIGHT = 72

/**
 * Sets `data-nav-over-media` on <html> while the fixed top nav sits over the
 * page's dark hero photo/video (hero bottom still below the nav bar). In light
 * mode the nav, theme toggle and language switcher stay white-on-dark there and
 * switch to dark text on a subtle light bar once the light content is under
 * them (see the dark-island rules in index.css). No effect on dark mode.
 */
export function useNavOverMedia(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const update = () => {
      frame = 0
      const hero = heroRef.current
      const over = !!hero && hero.getBoundingClientRect().bottom > NAV_HEIGHT
      if (over) root.dataset.navOverMedia = ''
      else delete root.dataset.navOverMedia
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      delete root.dataset.navOverMedia
    }
  }, [heroRef])
}
