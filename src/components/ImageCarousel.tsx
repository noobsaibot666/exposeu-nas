import { useCallback, useRef, useState } from 'react'
import './ImageCarousel.css'

type ImageCarouselProps = {
  images: string[]
  alt?: string
  className?: string
}

export default function ImageCarousel({ images, alt = '', className = '' }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track || images.length === 0) return
      const wrapped = (next + images.length) % images.length
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      track.scrollTo({ left: track.clientWidth * wrapped, behavior: reduceMotion ? 'auto' : 'smooth' })
      setIndex(wrapped)
    },
    [images.length],
  )

  // Keeps the dots in sync with touch/trackpad swipes, not just button taps.
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    const next = Math.round(track.scrollLeft / track.clientWidth)
    setIndex((current) => (current === next ? current : next))
  }, [])

  if (images.length <= 1) {
    return <div className={`image-carousel image-carousel--single ${className}`} style={{ backgroundImage: images[0] ? `url(${images[0]})` : undefined }} />
  }

  return (
    <div className={`image-carousel ${className}`}>
      <div className="image-carousel__track" ref={trackRef} onScroll={handleScroll}>
        {images.map((src, i) => (
          <div
            className="image-carousel__slide"
            style={{ backgroundImage: `url(${src})` }}
            role="img"
            aria-label={alt ? `${alt} — image ${i + 1} of ${images.length}` : undefined}
            key={src}
          />
        ))}
      </div>
      <button type="button" className="image-carousel__nav image-carousel__nav--prev" onClick={() => goTo(index - 1)} aria-label="Previous image">
        ‹
      </button>
      <button type="button" className="image-carousel__nav image-carousel__nav--next" onClick={() => goTo(index + 1)} aria-label="Next image">
        ›
      </button>
      <div className="image-carousel__dots">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`image-carousel__dot${i === index ? ' image-carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
