import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'

type Project = {
  id: number
  title: string
  client_name: string | null
  service_type: string | null
  plan_tier: string | null
  status: string | null
  due_date: string | null
  created_at: string
}

function Dashboard() {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest<Project[]>('/projects', {}, token)
      .then(setProjects)
      .catch(() => setError('Unable to load projects.'))
  }, [token])

  return (
    <Layout title="Projects overview">
      <div className="dashboard">
        <div className="dashboard__header">
          <p>Track active and upcoming projects without extra admin overhead.</p>
          <Link to="/projects/new" className="button">
            New project
          </Link>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="table">
          <div className="table__row table__row--header">
            <span>Project</span>
            <span>Client</span>
            <span>Service</span>
            <span>Status</span>
            <span>Due</span>
          </div>
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="table__row">
              <span>{project.title}</span>
              <span>{project.client_name ?? '—'}</span>
              <span>{project.service_type ?? '—'}</span>
              <span>{project.status ?? '—'}</span>
              <span>{project.due_date ?? '—'}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
