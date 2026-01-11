import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'
import './StatProjects.css'

type Project = {
  id: number
  title: string
  client_name: string | null
  service_type: string | null
  plan_tier: string | null
  status: string | null
  start_date: string | null
  due_date: string | null
  created_at: string
  tags?: string[]
  share_links?: Array<{ token: string; created_at: string; expires_at: string | null }>
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date)
}

const hasUrgentTag = (tags?: string[]) =>
  (tags ?? []).some((tag) => tag.trim().toLowerCase() === 'urgent')

const getFilterMeta = (type: string) => {
  switch (type) {
    case 'focus':
      return {
        title: 'Focus today',
        subtitle: 'Urgent projects that need attention right now.',
      }
    case 'due-soon':
      return {
        title: 'Due soon',
        subtitle: 'Projects with delivery dates in the next 5 days.',
      }
    case 'overdue':
      return {
        title: 'Overdue',
        subtitle: 'Projects with deadlines already passed.',
      }
    case 'shared':
      return {
        title: 'Shared links',
        subtitle: 'Projects currently in review mode.',
      }
    case 'active':
    default:
      return {
        title: 'Active projects',
        subtitle: 'All current projects excluding archive.',
      }
  }
}

export default function StatProjects() {
  const { type } = useParams()
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  useEffect(() => {
    if (!token) return
    apiRequest<Project[]>('/projects', {}, token)
      .then(setProjects)
      .catch(() => setError('Unable to load projects.'))
  }, [token])

  const filteredProjects = useMemo(() => {
    const withDue = projects.map((project) => ({
      ...project,
      due: project.due_date ? new Date(project.due_date) : null,
    }))
    const active = withDue.filter((project) => project.status !== 'archive')
    const currentType = type ?? 'active'

    switch (currentType) {
      case 'focus':
        return active.filter((project) => hasUrgentTag(project.tags))
      case 'due-soon':
        return active.filter((project) => {
          if (!project.due) return false
          const days = Math.ceil((project.due.getTime() - today.getTime()) / 86400000)
          return days >= 0 && days <= 5
        })
      case 'overdue':
        return active.filter((project) => project.due && project.due < today)
      case 'shared':
        return active.filter((project) => (project.share_links ?? []).length > 0)
      case 'active':
      default:
        return active
    }
  }, [projects, today, type])

  const meta = getFilterMeta(type ?? 'active')

  return (
    <Layout title={meta.title}>
      <div className="stats-page">
        <div className="stats-page__header">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>{meta.title}</h2>
            <p className="muted">{meta.subtitle}</p>
          </div>
          <Link to="/" className="button button--ghost">
            Back to dashboard
          </Link>
        </div>
        {error && <div className="form-error">{error}</div>}
        {type === 'shared' ? (
          <div className="shared-list">
            {filteredProjects.length === 0 && <p className="muted">No shared links yet.</p>}
            {filteredProjects.map((project) => (
              <div key={project.id} className="shared-card">
                <div className="shared-card__header">
                  <Link to={`/projects/${project.id}`} className="shared-card__title">
                    {project.title}
                  </Link>
                  <span className="shared-card__count">
                    {(project.share_links ?? []).length} link{(project.share_links ?? []).length === 1 ? '' : 's'}
                  </span>
                </div>
                <ul className="shared-card__links">
                  {(project.share_links ?? []).map((link) => (
                    <li key={link.token}>
                      <a href={`/share/${link.token}`} target="_blank" rel="noreferrer">
                        {window.location.origin}/share/{link.token}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="table">
            <div className="table__row table__row--header">
              <span>Project</span>
              <span>Client</span>
              <span>Service</span>
              <span>Status</span>
              <span>Due</span>
              <span>Tags</span>
            </div>
            {filteredProjects.length === 0 && <p className="muted">No projects found for this view.</p>}
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="table__row">
                <span data-label="Project">{project.title}</span>
                <span data-label="Client">{project.client_name ?? '—'}</span>
                <span data-label="Service">{project.service_type ?? '—'}</span>
                <span data-label="Status">{project.status ?? '—'}</span>
                <span data-label="Due">{formatDate(project.due_date)}</span>
                <span data-label="Tags">{project.tags && project.tags.length > 0 ? project.tags.join(', ') : '—'}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
