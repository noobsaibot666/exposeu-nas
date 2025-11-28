import type { CSSProperties } from 'react'
import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './Hero.css'

type OrbitItem = {
  label: string
  tone: string
  image?: string
}

type ThumbStyle = CSSProperties & {
  '--thumb-color'?: string
}

const orbitItems: OrbitItem[] = [
  {
    label: 'Portraits',
    tone: '#f97316',
    image: '/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg',
  },
  {
    label: 'Lifestyle',
    tone: '#10b981',
    image: '/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg',
  },
  {
    label: 'Studios',
    tone: '#2563eb',
    image: '/src/assets/images/5bcdeb6c6e929fdb9f16ed10665ca5e0.jpg',
  },
  {
    label: 'Editorial',
    tone: '#e11d48',
    image: '/src/assets/images/5ca58a0696b1a8655c92ae3ed107c5e8.jpg',
  },
  {
    label: 'Partners',
    tone: '#8b5cf6',
    image: '/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg',
  },
  {
    label: 'On Set',
    tone: '#22c55e',
    image: '/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg',
  },
  {
    label: 'Campaigns',
    tone: '#0ea5e9',
    image: '/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg',
  },
  {
    label: 'Launches',
    tone: '#f59e0b',
    image: '/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg',
  },
  {
    label: 'Fashion',
    tone: '#7c3aed',
    image: '/src/assets/images/bg01.jpg',
  },
  {
    label: 'Travel',
    tone: '#14b8a6',
    image: '/src/assets/images/cfcb07dd865328849ba617c98ae71eb3.jpg',
  },
  {
    label: 'Product',
    tone: '#eab308',
    image: '/src/assets/images/d3eef75d7c0616b67215308172bf30d5.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/Daydream.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/FuturisticInterior-RomanPrytuliak.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/Pinonsecrets.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/Pinonnovelawalcyr.png',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/PinonShowww.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: '/src/assets/images/PinonTheWall.jpg',
  },
  {
    label: 'Behind the Scenes',
    tone: '#5848ecff',
    image: '/src/assets/images/f2905fd98e2710a6e4b42098b9836c5c.jpg',
  },
  
]

const orbitDuration = 36 // seconds for a full orbit
const ringSizeVW = 36 // diameter in vw units
const orbitRadius = 656 // radius in px units
const cardSize = 152 // size in px units


function Hero() {
  const angleStep = (2 * Math.PI) / orbitItems.length
  const navigate = useNavigate()

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
  }, [])

  const handleScrollTo = useCallback((selector: string) => {
    const target = document.querySelector(selector)
    if (!target) return
    gsap.to(window, {
      duration: 1.4,
      ease: 'power2.inOut',
      scrollTo: { y: target, offsetY: 24 },
    })
  }, [])

  return (
    <section className="section hero" id="hero">
      <div className="hero__canvas">
        <div className="hero__top-links" aria-label="Quick navigation">
          <nav className="hero__nav hero__nav--left">
            <button type="button" onClick={() => handleScrollTo('#hero')}>
              Home
            </button>
            <button type="button" onClick={() => handleScrollTo('#proposal')}>
              Proposal
            </button>
            <button type="button" onClick={() => handleScrollTo('#claim')}>
              Claim
            </button>
            <button type="button" onClick={() => handleScrollTo('#offer')}>
              Offer
            </button>
          </nav>
          <div className="hero__nav_center" >
            expose.u
            </div>
          <nav className="hero__nav hero__nav--right">
            <button type="button" onClick={() => navigate('/about')}>
              About
            </button>
            <button type="button" onClick={() => navigate('/contact')}>
              Contact
            </button>
          </nav>
        </div>

        <div className="hero__orbit-shell">
          <div
            className="hero__ring-shell"
            style={{
              width: `${ringSizeVW}vw`,
              height: `${ringSizeVW}vw`,
              minWidth: 360,
              minHeight: 360,
              maxWidth: 1080,
              maxHeight: 1080,
            }}
          >
            <motion.div
              className="hero__ring"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: orbitDuration }}
            >
              {orbitItems.map((item, index) => {
                const angle = angleStep * index
                const x = Math.cos(angle) * orbitRadius
                const y = Math.sin(angle) * orbitRadius

                const backgroundStyles: ThumbStyle = {
                  '--thumb-color': item.tone,
                  backgroundImage: item.image ? `url(${item.image})` : undefined,
                }

                return (
                  <motion.div
                    key={item.label}
                    className="hero__card"
                    style={{
                      width: cardSize,
                      height: cardSize,
                      // combine center offset with orbital position to keep the anchor in the middle
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    }}
                    whileHover={{ scale: 1.1, zIndex: 2 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  >
                    <motion.div
                      className="hero__thumb"
                      style={backgroundStyles}
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, ease: 'linear', duration: orbitDuration }}
                    >
                      {!item.image && <span>{item.label}</span>}
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          <div className="hero__center">
            <div className="hero__center-content">
              <h1>We film art the way it feels.</h1>
              <p>
                Photo + video for exhibitions, performances, and galleries—crafted with taste, tuned
                to your voice, and built to move real audiences.
              </p>
              <button className="hero__cta" type="button" onClick={() => handleScrollTo('#proposal')}>
                Discover More ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
