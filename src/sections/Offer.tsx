import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Offer.css'

type WorkCard = {
  id: string
  image: string
  title: string
  subtitle: string
  link: string
}

const works: WorkCard[] = [
  {
    id: 'w1',
    image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
    title: 'Exhibitions',
    subtitle: 'Atmospheric coverage for installs & openings',
    link: '/exhibitions',
  },
  {
    id: 'w2',
    image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg',
    title: 'Atmospheric',
    subtitle: 'Mood-first films and stills',
    link: '/atmospheric',
  },
  {
    id: 'w3',
    image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
    title: 'Performance',
    subtitle: 'Runway, sets, and live shows',
    link: '/performance',
  },
  {
    id: 'w4',
    image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
    title: 'Artist Sessions',
    subtitle: 'Portraits, talks, and BTS',
    link: '/artist-sessions',
  },
  {
    id: 'w5',
    image: '/src/assets/images/PinonShowww.jpg',
    title: 'Gallery Stories',
    subtitle: 'Curator walkthroughs & features',
    link: '/gallery-stories',
  },
  {
    id: 'w6',
    image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg',
    title: 'Fashion Show',
    subtitle: 'Editorial runway capture',
    link: '/fashion-show',
  },
]

function Offer() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.offer__card', {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="offer" id="offer" ref={sectionRef}>
      <div className="offer__headline">
        <h2>What we offer</h2>
        <p className="offer__subhead">
          Focused coverage for the real ones—artists, galleries, and stages that deserve to be seen.
        </p>
      </div>
      <div className="offer__grid">
        {works.map((work) => (
          <article
            key={work.id}
            className="offer__card"
          >
            <a className="offer__card-link" href={work.link}>
              <div className="offer__card-img" style={{ backgroundImage: `url(${work.image})` }} />
              <div className="offer__card-overlay">
                <h3>{work.title}</h3>
                <p>{work.subtitle}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
      
    </section>
  )
}

export default Offer
