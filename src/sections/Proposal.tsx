import { useEffect, useRef } from 'react'
import './Proposal.css'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type FrameCard = {
  id: string
  image: string
  rotate: number
  offsetX: number
  offsetY: number
  scale: number
  blur: number
  depth: number
}

const cards: FrameCard[] = [
  // Arc layout: tweak offsets/rotate/scale to reshape the stack horizontally.
  {
    id: 'c1',
    image: '/src/assets/images/visualelectric-1755373701143.png',
    rotate: -10,
    offsetX: -420,
    offsetY: 60,
    scale: 0.54,
    blur: 4,
    depth: -25,
  },
  {
    id: 'c2',
    image: '/src/assets/images/64b261efa17b3bc8eb2edc58d9f810ee.jpg',
    rotate: -5,
    offsetX: -260,
    offsetY: 24,
    scale: 0.82,
    blur: 2,
    depth: 8,
  },
  {
    id: 'c3',
    image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
    rotate: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1.05,
    blur: 0,
    depth: 40,
  },
  {
    id: 'c4',
    image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
    rotate: 5,
    offsetX: 260,
    offsetY: 24,
    scale: 0.82,
    blur: 2,
    depth: 8,
  },
  {
    id: 'c5',
    image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
    rotate: 10,
    offsetX: 420,
    offsetY: 60,
    scale: 0.54,
    blur: 4,
    depth: -25,
  },
]

function Proposal() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.proposal__card', {
        x: -50,
        y: 30,
        opacity: 1, // keep images visible to avoid empty cards on load
        filter: 'blur(10px)',
        rotateX: -4,
        rotateY: -3,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 0.35,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section proposal" id="proposal" ref={sectionRef}>
      <div className="proposal__glass">
        <div className="proposal__halo" aria-hidden />
        <div className="proposal__stack">
          {cards.map((card) => (
            <div
              key={card.id}
              className="proposal__card"
              style={
                {
                  '--card-image': `url(${card.image})`,
                  // Compose position/scale/rotation per card to keep the arc visually balanced.
                  transform: `translateX(${card.offsetX}px) translateY(${card.offsetY}px) rotate(${card.rotate}deg) scale(${card.scale}) translateZ(${card.depth}px)`,
                  filter: `blur(${card.blur}px)`,
                  zIndex: card.depth,
                  '--card-tilt': `${card.rotate}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="proposal__copy">
          <h2>Bring us in as your creative unit.</h2>
          <p>
            We storyboard, shoot, and deliver exhibition-ready photo and video that carries your
            tone. Hire us as your content partners—from moodboards to final exports—so your work
            launches with visuals that feel intentional.
          </p>
          <button className="proposal__cta" type="button" onClick={() => navigate('/portfolio')}>
            View our work
          </button>
        </div>
      </div>
    </section>
  )
}

export default Proposal
