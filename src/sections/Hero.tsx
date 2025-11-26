import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
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

const orbitDuration = 30
const ringSize = 560
const orbitRadius = 260
const cardSize = 118

function Hero() {
  const angleStep = (2 * Math.PI) / orbitItems.length

  return (
    <section className="section hero" id="hero">
      <div className="hero__canvas">
        <div className="hero__top-links" aria-label="Quick navigation">
          <nav className="hero__nav hero__nav--left">
            <a href="/#hero">Home</a>
            <a href="/#proposal">Proposal</a>
            <a href="/#claim">Claim</a>
            <a href="/#offer">Offer</a>
          </nav>
          <div className="hero__nav-logo" aria-hidden="true" />
          <nav className="hero__nav hero__nav--right">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>

        <div className="hero__orbit-shell">
          <div
            className="hero__ring-shell"
            style={{ width: ringSize, height: ringSize, maxWidth: '96vw', maxHeight: '96vw' }}
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
            <h1>We tailor visuals that speak your story.</h1>
            <p>
              From concept to creation, we craft content that amplifies your artistic voice and
              keeps momentum for your launch.
            </p>
            <a className="hero__cta" href="/#proposal">
              Discover More ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
