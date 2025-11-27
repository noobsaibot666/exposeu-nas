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
    title: 'Art Show',
    subtitle: 'Brand Identity',
    link: '/project_01',
  },
  {
    id: 'w2',
    image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg',
    title: 'Acoustic Show',
    subtitle: 'Brand Identity',
    link: '/project_02',
  },
  {
    id: 'w3',
    image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
    title: 'Live Show',
    subtitle: 'Brand Identity',
    link: '/project_03',
  },
  {
    id: 'w4',
    image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
    title: 'No Show',
    subtitle: 'Brand Identity',
    link: '/project_04',
  },
  {
    id: 'w5',
    image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
    title: 'The Show',
    subtitle: 'Brand Identity',
    link: '/project_05',
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
      <div className="offer__grid">
        {works.map((work) => (
          <article
            key={work.id}
            className="offer__card"
            style={{ backgroundImage: `url(${work.image})` }}
          >
            <a className="offer__card-link" href={work.link}>
              <div className="offer__card-media" />
              <div className="offer__card-overlay">
                <h3>{work.title}</h3>
                <p>{work.subtitle}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
      <div className="offer__headline">
        <h2>WHAT WE HAVE DONE</h2>
        <p className="offer__subhead">
          Projection, immersive content, and brand experiences crafted for bold teams.
        </p>
      </div>
    </section>
  )
}

export default Offer
