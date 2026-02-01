import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import './Roadmap.css'

type RoadmapListItem = {
  id: number
  project_id: number
  project_title: string
  title: string
  auto_schedule: boolean
  created_at: string
}

function Roadmaps() {
  const { token } = useAuth()
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest<RoadmapListItem[]>('/roadmaps', {}, token)
      .then(setRoadmaps)
      .catch(() => setError('Unable to load roadmaps.'))
  }, [token])

  return (
    <Layout title="Roadmaps">
      {error && <div className="form-error">{error}</div>}
      <motion.div
        className="roadmaps-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {roadmaps.map((roadmap) => (
          <motion.div
            key={roadmap.id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Link to={`/roadmaps/${roadmap.id}`} className="roadmap-card">
            <div className="roadmap-card__header">
              <span className="roadmap-card__eyebrow">Project</span>
              <h3>{roadmap.project_title}</h3>
            </div>
            <div className="roadmap-card__body">
              <p className="roadmap-card__title">{roadmap.title}</p>
              <span className="roadmap-card__meta">
                {roadmap.auto_schedule ? 'Auto scheduled' : 'Manual schedule'}
              </span>
            </div>
            </Link>
          </motion.div>
        ))}
        {roadmaps.length === 0 && <p className="muted">No roadmaps yet. Create one when starting a project.</p>}
      </motion.div>
    </Layout>
  )
}

export default Roadmaps
