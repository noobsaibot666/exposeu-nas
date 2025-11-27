import { useEffect, useRef } from 'react'
import './Proposal.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CSSProperties } from 'react'

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
  {
    id: 'c1',
    image: 'src/assets/images/visualelectric-1755373701143.png',
    rotate: -12, // individual rotation
    offsetX: -380, // horizontal offset for arc spacing
    offsetY: 60, // vertical offset for arc spacing
    scale: 0.58, // individual size
    blur: 6, // individual blur for depth of field
    depth: -40, // z-depth (used for stacking and transform)
  },
  {
    id: 'c2',
    image: 'src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg',
    rotate: -6, // individual rotation
    offsetX: -220, // horizontal offset for arc spacing
    offsetY: 18, // vertical offset for arc spacing
    scale: 0.9, // individual size
    blur: 4, // individual blur for depth of field
    depth: -10, // z-depth (used for stacking and transform)
  },
  {
    id: 'c3',
    image: 'src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
    rotate: 0, // individual rotation
    offsetX: 0, // horizontal offset for arc spacing
    offsetY: -20, // vertical offset for arc spacing
    scale: 1.12, // individual size
    blur: 0, // individual blur for depth of field
    depth: 60, // z-depth (used for stacking and transform)
  },
  {
    id: 'c4',
    image: 'src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
    rotate: 8, // individual rotation
    offsetX: 220, // horizontal offset for arc spacing
    offsetY: 18, // vertical offset for arc spacing
    scale: 0.9, // individual size
    blur: 4, // individual blur for depth of field
    depth: -10, // z-depth (used for stacking and transform)
  },
  {
    id: 'c5',
    image: 'src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
    rotate: 14, // individual rotation
    offsetX: 380, // horizontal offset for arc spacing
    offsetY: 60, // vertical offset for arc spacing
    scale: 0.8, // individual size
    blur: 6, // individual blur for depth of field
    depth: -40, // z-depth (used for stacking and transform)
  },
]

function Proposal() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.proposal__card',
        {
          y: 40,
          opacity: 0,
          rotateX: -10,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: 'power3.out',
          immediateRender: false, // keep initial visibility until animation starts
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true, // run animation once
          },
        },
      )
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
          <h2>Eyewear That Stands Out</h2>
          <button className="proposal__cta" type="button" >
            Enter Store
          </button>
        </div>
      </div>
    </section>
  )
}

export default Proposal
