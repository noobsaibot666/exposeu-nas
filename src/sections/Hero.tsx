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
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Lifestyle',
    tone: '#10b981',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Studios',
    tone: '#2563eb',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Editorial',
    tone: '#e11d48',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Partners',
    tone: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'On Set',
    tone: '#22c55e',
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Campaigns',
    tone: '#0ea5e9',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Launches',
    tone: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Fashion',
    tone: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1496747611180-206a5c8c4f47?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Travel',
    tone: '#14b8a6',
    image: 'https://images.unsplash.com/photo-1500530855697-0f3c5f5e0ba4?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Product',
    tone: '#eab308',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80',
  },
  {
    label: 'Behind the Scenes',
    tone: '#ec4899',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80',
  },
]

const orbitDuration = 60 // seconds for a full orbit
const ringSizeVW = 20 // diameter in vw units
const orbitRadius = 480 // radius in px units
const cardSize = 120 // size in px units


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
          <div className="hero__nav-logo" aria-hidden="true" />
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
                      transform: `translate(${x}px, ${y}px)`,
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
              <h1>We tailor visuals that speak your story.</h1>
              <p>
                From concept to creation, we craft content that amplifies your artistic voice and
                keeps momentum for your launch.
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
