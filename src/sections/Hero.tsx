import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import TopNav from '../components/TopNav'
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
const cardSize = 160 // orbit thumbnail size in px


function Hero() {
  const angleStep = (2 * Math.PI) / orbitItems.length
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const [orbitRadiusPx, setOrbitRadiusPx] = useState(orbitRadius)
  const [orbitCardSize, setOrbitCardSize] = useState(cardSize)

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
  }, [])

  useEffect(() => {
    const updateOrbit = () => {
      const width = window.innerWidth || orbitRadius
      const radius = Math.max(220, Math.min(orbitRadius, width * 0.55))
      const thumb = Math.max(100, Math.min(cardSize, width * 0.26))
      setOrbitRadiusPx(radius)
      setOrbitCardSize(thumb)
    }

    updateOrbit()
    window.addEventListener('resize', updateOrbit)
    return () => window.removeEventListener('resize', updateOrbit)
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

  const leftLinks = useMemo(
    () => [
      { label: 'Home', onClick: () => handleScrollTo('#hero') },
      { label: 'Proposal', onClick: () => handleScrollTo('#proposal') },
      { label: 'Claim', onClick: () => handleScrollTo('#claim') },
      { label: 'Offer', onClick: () => handleScrollTo('#offer') },
    ],
    [handleScrollTo],
  )

  const rightLinks = useMemo(
    () => [
      { label: 'About', onClick: () => navigate('/about') },
      { label: 'Contact', onClick: () => navigate('/contact') },
    ],
    [navigate],
  )

  return (
    <section className="section hero" id="hero">
      <div className="hero__canvas">
        <div className="hero__nav-shell" aria-label="Quick navigation">
          <TopNav
            leftLinks={leftLinks}
            rightLinks={rightLinks}
            onBrandClick={() => handleScrollTo('#hero')}
            brandLabel="expose.u"
            className="top-nav--hero"
          />
        </div>

        <div className="hero__orbit-shell">
          <motion.div
            className="hero__ring-shell"
            style={{
              width: `${ringSizeVW}vw`,
              height: `${ringSizeVW}vw`,
              minWidth: 360,
              minHeight: 360,
              maxWidth: 1080,
              maxHeight: 1080,
            }}
            initial={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, scale: 1.12, y: 120 }
            }
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 0.9, ease: 'easeOut' }
            }
          >
            <motion.div
              className="hero__ring"
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { repeat: Infinity, ease: 'linear', duration: orbitDuration }
              }
            >
              {orbitItems.map((item, index) => {
                const angle = angleStep * index
                const x = Math.cos(angle) * orbitRadiusPx
                const y = Math.sin(angle) * orbitRadiusPx

                const backgroundStyles: ThumbStyle = {
                  '--thumb-color': item.tone,
                  backgroundImage: item.image ? `url(${item.image})` : undefined,
                }

                return (
                  <motion.div
                    key={item.label}
                    className="hero__card"
                    style={{
                      width: orbitCardSize,
                      height: orbitCardSize,
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    }}
                  >
                    <motion.div
                      className="hero__thumb"
                      style={backgroundStyles}
                      animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                      transition={
                        prefersReducedMotion
                          ? undefined
                          : { repeat: Infinity, ease: 'linear', duration: orbitDuration }
                      }
                    >
                      {!item.image && <span>{item.label}</span>}
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

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
