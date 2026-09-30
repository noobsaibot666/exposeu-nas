import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from 'react'
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
  // Short loop clips: autoplay muted on repeat with every player control
  // and Vimeo/YouTube overlay hidden.
  ambientVideo?: boolean
  slideshowImages?: string[]
}

function getEmbedSrc(src: string, ambient = false) {
  const youTubeMatch = src.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^?&/]+)/i,
  )
  if (youTubeMatch) {
    const id = youTubeMatch[1]
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`
  }

  const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeoMatch) {
    const params = ambient
      ? 'background=1&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&badge=0&dnt=1&autopause=0'
      : 'autoplay=1&title=0&byline=0&portrait=0'
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?${params}`
  }

  return null
}

// YouTube offers no way to switch its branding off, so its films always play
// as ambient loops (no hover/pause/end-screen UI) behind a veil that covers the
// title overlay YouTube shows for the first few seconds.
const isYouTube = (src?: string) => Boolean(src && /youtu\.?be/i.test(src))

function renderVideo(video: LightboxVideo) {
  if (!video.videoSrc) return null
  const embedSrc = getEmbedSrc(video.videoSrc, video.ambientVideo)
  if (embedSrc) {
    return (
      <iframe
        key={video.id}
        title={video.title}
        src={embedSrc}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return <video key={video.id} controls autoPlay playsInline poster={video.thumb} src={video.videoSrc} />
}

const pad = (n: number) => String(n).padStart(2, '0')

// Reusable project lightbox — shared by Portfolio.tsx (its own grid) and any
// other page that opens the same popup for a project card (e.g. HomeV2's
// "Last Projects"). Styling comes from Portfolio.css (.portfolio__overlay /
// .portfolio__modal / .portfolio__player / ...); import that stylesheet in any
// page that renders this modal.
//
// Layout: the film (if any) on top, then the project text, then the stills as
// a presentation — a cross-fading stage with a counter and a thumbnail strip.
// A stills-only project leads with the stage; a film-only one is just the film.
//
// `scopeRef` (optional) scopes the entrance-animation's selector queries to
// the caller's own page root (same as `gsap.context(fn, rootRef)`), so this
// hook's `.portfolio__overlay/.modal/.player` queries can't pick up an
// unrelated match elsewhere in the document.
export function useVideoLightbox(scopeRef?: RefObject<HTMLElement | null>) {
  const { t } = useTranslation()
  const [activeVideo, setActiveVideo] = useState<LightboxVideo | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  // The slide being faded out underneath the incoming one (null = none).
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState(1)
  const openerRef = useRef<HTMLElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)
  const slideSwipeState = useRef({ active: false, startX: 0, pointerId: 0 })
  const navRef = useRef<{
    activeVideo: LightboxVideo | null
    goNext: () => void
    goPrev: () => void
  }>({ activeVideo: null, goNext: () => {}, goPrev: () => {} })

  const images = useMemo(() => activeVideo?.slideshowImages ?? [], [activeVideo])
  const total = images.length

  const openVideo = useCallback((video: LightboxVideo) => {
    openerRef.current = document.activeElement as HTMLElement
    setSlideIndex(0)
    setLeavingIndex(null)
    setSlideDirection(1)
    setActiveVideo(video)
  }, [])

  const closeVideo = useCallback(() => setActiveVideo(null), [])

  const goToSlide = useCallback(
    (next: number, direction: number) => {
      if (!total) return
      const target = (next + total) % total
      if (target === slideIndex) return
      setSlideDirection(direction)
      setLeavingIndex(slideIndex)
      setSlideIndex(target)
    },
    [slideIndex, total],
  )

  const goToPreviousSlide = useCallback(() => goToSlide(slideIndex - 1, -1), [goToSlide, slideIndex])
  const goToNextSlide = useCallback(() => goToSlide(slideIndex + 1, 1), [goToSlide, slideIndex])

  useEffect(() => {
    if (!activeVideo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.portfolio__overlay', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        '.portfolio__modal',
        { opacity: 0, y: 24, scale: 0.98 },
        // clearProps: a leftover transform would make this the containing block
        // for the position:fixed close button, so it would scroll away.
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform' },
      )
      gsap.fromTo(
        '.portfolio__player > *',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.05, stagger: 0.08, clearProps: 'transform' },
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

  // Keep the active thumbnail centred in the strip. Scrolls the strip itself
  // (not scrollIntoView), so the overlay never jumps vertically.
  useEffect(() => {
    const strip = stripRef.current
    const thumb = strip?.children[slideIndex] as HTMLElement | undefined
    if (!strip || !thumb) return
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    strip.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
  }, [slideIndex, activeVideo])

  // Warm the neighbours so the next/previous still is decoded before it's asked for.
  useEffect(() => {
    if (total < 2) return
    ;[slideIndex + 1, slideIndex - 1].forEach((i) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = images[(i + total) % total]
    })
  }, [images, slideIndex, total])

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
    if (total < 2) return
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

  const renderStills = (video: LightboxVideo) => (
    <section className="portfolio__stills" aria-label={video.title}>
      <div
        className="portfolio__stage"
        onPointerDown={handleSlidePointerDown}
        onPointerUp={handleSlidePointerUp}
        onPointerCancel={handleSlidePointerCancel}
      >
        {leavingIndex !== null && leavingIndex !== slideIndex && (
          <img
            key={`${video.id}-leaving-${leavingIndex}-${slideIndex}`}
            className="portfolio__stage-image portfolio__stage-image--leaving"
            src={images[leavingIndex]}
            alt=""
            aria-hidden="true"
          />
        )}
        <img
          key={`${video.id}-slide-${slideIndex}`}
          className={`portfolio__stage-image ${
            leavingIndex === null
              ? ''
              : slideDirection === -1
                ? 'portfolio__stage-image--from-left'
                : 'portfolio__stage-image--from-right'
          }`}
          src={images[slideIndex] ?? images[0]}
          alt={`${video.title}, ${slideIndex + 1} / ${total}`}
          decoding="async"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className="portfolio__stage-arrow portfolio__stage-arrow--left"
              aria-label={t('portfolio.modal.previousSlide')}
              onClick={goToPreviousSlide}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="portfolio__stage-arrow portfolio__stage-arrow--right"
              aria-label={t('portfolio.modal.nextSlide')}
              onClick={goToNextSlide}
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="portfolio__stills-bar">
          <p className="portfolio__counter" aria-live="polite">
            <span className="portfolio__counter-current">{pad(slideIndex + 1)}</span>
            <span className="portfolio__counter-sep" aria-hidden="true" />
            <span>{pad(total)}</span>
          </p>
          <div className="portfolio__strip" ref={stripRef}>
            {images.map((src, index) => (
              <button
                key={`${video.id}-thumb-${index}`}
                type="button"
                className={`portfolio__strip-thumb ${index === slideIndex ? 'is-active' : ''}`}
                aria-label={t('portfolio.modal.showSlide', { n: index + 1 })}
                aria-current={index === slideIndex ? 'true' : undefined}
                onClick={() => goToSlide(index, index > slideIndex ? 1 : -1)}
              >
                <img src={src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )

  const renderMeta = (video: LightboxVideo) => (
    <div className="portfolio__player-meta">
      <div className="portfolio__eyebrow">
        <span>{video.year}</span>
        <span className="portfolio__dot">•</span>
        <span>{video.location}</span>
      </div>
      <p className="portfolio__title" id="portfolio-modal-title">{video.title}</p>
      <p className="portfolio__description">{video.description}</p>
    </div>
  )

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
        <div className={`portfolio__player ${activeVideo.videoSrc ? 'has-film' : ''} ${total ? 'has-stills' : ''}`}>
          {activeVideo.videoSrc ? (
            <>
              <div
                className={`portfolio__film ${
                  activeVideo.ambientVideo || isYouTube(activeVideo.videoSrc) ? 'portfolio__film--ambient' : ''
                }`}
              >
                {renderVideo(activeVideo)}
                {isYouTube(activeVideo.videoSrc) && <div className="portfolio__film-veil" aria-hidden="true" />}
              </div>
              {renderMeta(activeVideo)}
              {total > 0 && renderStills(activeVideo)}
            </>
          ) : (
            <>
              {total > 0 && renderStills(activeVideo)}
              {renderMeta(activeVideo)}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return { activeVideo, openVideo, closeVideo, modal }
}
