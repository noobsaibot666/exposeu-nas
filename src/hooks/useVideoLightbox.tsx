import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import gsap from 'gsap'
import { useTranslation } from '../i18n/LocaleProvider'

export type LightboxVideo = {
  id: string
  title: string
  description: string
  year: string
  location: string
  thumb: string
  videoSrc?: string
  slideshowImages?: string[]
}

function getEmbedSrc(src: string) {
  const youTubeMatch = src.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^?&/]+)/i,
  )
  if (youTubeMatch) {
    return `https://www.youtube-nocookie.com/embed/${youTubeMatch[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`
  }

  const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`
  }

  return null
}

// Reusable video/slideshow lightbox — shared by Portfolio.tsx (its own grid)
// and any other page that wants to open the same popup for a project card
// (e.g. HomeV2's "Last Projects"). Styling comes from Portfolio.css
// (.portfolio__overlay / .portfolio__modal / .portfolio__player / ...);
// import that stylesheet in any page that renders this modal.
//
// `scopeRef` (optional) scopes the entrance-animation's selector queries to
// the caller's own page root, same as the original Portfolio.tsx implementation
// did with `gsap.context(fn, rootRef)` — pass the page's root ref so this
// hook's `.portfolio__overlay/.modal/.player` queries can't ever pick up an
// unrelated match elsewhere in the document.
export function useVideoLightbox(scopeRef?: RefObject<HTMLElement | null>) {
  const { t } = useTranslation()
  const [activeVideo, setActiveVideo] = useState<LightboxVideo | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)
  const openerRef = useRef<HTMLElement | null>(null)
  const slideSwipeState = useRef({ active: false, startX: 0, pointerId: 0 })
  const navRef = useRef<{
    activeVideo: LightboxVideo | null
    goNext: () => void
    goPrev: () => void
  }>({ activeVideo: null, goNext: () => {}, goPrev: () => {} })

  const openVideo = useCallback((video: LightboxVideo) => {
    openerRef.current = document.activeElement as HTMLElement
    setSlideIndex(0)
    setSlideDirection(1)
    setActiveVideo(video)
  }, [])

  const closeVideo = useCallback(() => setActiveVideo(null), [])

  const goToPreviousSlide = useCallback(() => {
    if (!activeVideo?.slideshowImages?.length) return
    const total = activeVideo.slideshowImages.length
    setSlideDirection(-1)
    setSlideIndex((prev) => (prev - 1 + total) % total)
  }, [activeVideo])

  const goToNextSlide = useCallback(() => {
    if (!activeVideo?.slideshowImages?.length) return
    const total = activeVideo.slideshowImages.length
    setSlideDirection(1)
    setSlideIndex((prev) => (prev + 1) % total)
  }, [activeVideo])

  useEffect(() => {
    if (!activeVideo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.portfolio__overlay', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        '.portfolio__modal',
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.portfolio__player',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 },
      )
    }, scopeRef)

    return () => ctx.revert()
  }, [activeVideo, scopeRef])

  useEffect(() => {
    if (!activeVideo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      const closeBtn = document.querySelector<HTMLElement>('.portfolio__close')
      closeBtn?.focus()
    })
    return () => {
      document.body.style.overflow = previousOverflow
      requestAnimationFrame(() => openerRef.current?.focus())
    }
  }, [activeVideo])

  // Keep navRef current after every render — runs before paint so the keyboard
  // handler always reads live values without holding stale closures.
  useLayoutEffect(() => {
    navRef.current.activeVideo = activeVideo
    navRef.current.goNext = goToNextSlide
    navRef.current.goPrev = goToPreviousSlide
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { activeVideo: av, goNext, goPrev } = navRef.current

      if (e.key === 'Escape') {
        if (av) setActiveVideo(null)
        return
      }

      if (!av?.slideshowImages?.length) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, []) // stable — registered once, reads live values via navRef

  // Focus trap: cycle Tab within the modal overlay
  useEffect(() => {
    if (!activeVideo) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const overlay = document.querySelector<HTMLElement>('.portfolio__overlay')
      if (!overlay) return
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [activeVideo])

  const handleSlidePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!activeVideo?.slideshowImages || activeVideo.slideshowImages.length < 2) return
    if ((event.target as HTMLElement).closest('button')) return
    slideSwipeState.current = { active: true, startX: event.clientX, pointerId: event.pointerId }
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const handleSlidePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!slideSwipeState.current.active) return
    const deltaX = event.clientX - slideSwipeState.current.startX
    slideSwipeState.current.active = false
    if (event.currentTarget.hasPointerCapture(slideSwipeState.current.pointerId)) {
      event.currentTarget.releasePointerCapture(slideSwipeState.current.pointerId)
    }

    if (Math.abs(deltaX) < 42) return
    if (deltaX > 0) {
      goToPreviousSlide()
    } else {
      goToNextSlide()
    }
  }

  const handleSlidePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (!slideSwipeState.current.active) return
    slideSwipeState.current.active = false
    if (event.currentTarget.hasPointerCapture(slideSwipeState.current.pointerId)) {
      event.currentTarget.releasePointerCapture(slideSwipeState.current.pointerId)
    }
  }

  const modal = activeVideo && (
    <div
      className="portfolio__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
      onClick={closeVideo}
    >
      <div className="portfolio__modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="portfolio__close" aria-label={t('portfolio.modal.close')} onClick={closeVideo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="portfolio__player">
          {(() => {
            if (activeVideo.slideshowImages && activeVideo.slideshowImages.length > 0) {
              const total = activeVideo.slideshowImages.length
              const current = activeVideo.slideshowImages[slideIndex] ?? activeVideo.slideshowImages[0]
              return (
                <div className="portfolio__slideshow">
                  <div
                    className="portfolio__slideshow-frame"
                    onPointerDown={handleSlidePointerDown}
                    onPointerUp={handleSlidePointerUp}
                    onPointerCancel={handleSlidePointerCancel}
                  >
                    {total > 1 && (
                      <>
                        <button
                          type="button"
                          className="portfolio__slideshow-arrow portfolio__slideshow-arrow--left"
                          aria-label={t('portfolio.modal.previousSlide')}
                          onClick={goToPreviousSlide}
                        >
                          <span aria-hidden="true">‹</span>
                        </button>
                        <button
                          type="button"
                          className="portfolio__slideshow-arrow portfolio__slideshow-arrow--right"
                          aria-label={t('portfolio.modal.nextSlide')}
                          onClick={goToNextSlide}
                        >
                          <span aria-hidden="true">›</span>
                        </button>
                      </>
                    )}
                    <img
                      key={`${activeVideo.id}-slide-${slideIndex}`}
                      className={`portfolio__slideshow-image ${slideDirection === -1 ? 'portfolio__slideshow-image--prev' : 'portfolio__slideshow-image--next'}`}
                      src={current}
                      alt={`${activeVideo.title} slide ${slideIndex + 1}`}
                    />
                  </div>
                  {total > 1 && (
                    <div className="portfolio__slideshow-dots" aria-hidden="true">
                      {activeVideo.slideshowImages.map((_, index) => (
                        <span
                          key={`slide-${activeVideo.id}-${index}`}
                          className={`portfolio__slideshow-dot ${index === slideIndex ? 'is-active' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            if (!activeVideo.videoSrc) return null
            const embedSrc = getEmbedSrc(activeVideo.videoSrc)
            if (embedSrc) {
              return (
                <iframe
                  key={activeVideo.id}
                  title={activeVideo.title}
                  src={embedSrc}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )
            }

            return (
              <video key={activeVideo.id} controls autoPlay playsInline poster={activeVideo.thumb} src={activeVideo.videoSrc} />
            )
          })()}
          <div className="portfolio__player-meta">
            <div className="portfolio__eyebrow">
              <span>{activeVideo.year}</span>
              <span className="portfolio__dot">•</span>
              <span>{activeVideo.location}</span>
            </div>
            <p className="portfolio__title" id="portfolio-modal-title">{activeVideo.title}</p>
            <p className="portfolio__description">{activeVideo.description}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return { activeVideo, openVideo, closeVideo, modal }
}
