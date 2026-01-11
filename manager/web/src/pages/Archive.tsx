import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'

type Review = {
  delivered_on_time: boolean | null
}

type Project = {
  id: number
  title: string
  client_name: string | null
  service_type: string | null
  status: string | null
  completed_at: string | null
  due_date: string | null
  review?: Review | null
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

const formatOnTime = (value: boolean | null | undefined) => {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return '—'
}

export default function Archive() {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [deleteStatus, setDeleteStatus] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest<Project[]>('/projects', {}, token)
      .then((data) => setProjects(data.filter((project) => project.status === 'archive')))
      .catch(() => setError('Unable to load archived projects.'))
  }, [token])

  const handleDelete = async (id: number) => {
    if (!token) return
    setDeleteStatus('')
    const confirmed = window.confirm('Delete this project and all related data?')
    if (!confirmed) return
    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' }, token)
      setProjects((prev) => prev.filter((project) => project.id !== id))
    } catch (err) {
      setDeleteStatus(err instanceof Error ? err.message : 'Unable to delete project.')
    }
  }

  return (
    <Layout title="Archive">
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <p className="eyebrow">Archive</p>
            <h2>Done projects</h2>
            <p className="muted">Open a project to capture the delivery review.</p>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        {deleteStatus && <div className="form-error">{deleteStatus}</div>}
        {projects.length === 0 && <p className="muted">No archived projects yet.</p>}
        {projects.length > 0 && (
          <div className="table table--archive">
            <div className="table__row table__row--header">
              <span>Project</span>
              <span>Client</span>
              <span>Service</span>
              <span>Completed</span>
              <span>On time</span>
              <span>Due</span>
              <span />
            </div>
            {projects.map((project) => (
              <div key={project.id} className="table__row">
                <span data-label="Project">
                  <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </span>
                <span data-label="Client">{project.client_name ?? '—'}</span>
                <span data-label="Service">{project.service_type ?? '—'}</span>
                <span data-label="Completed">{formatDate(project.completed_at)}</span>
                <span data-label="On time">{formatOnTime(project.review?.delivered_on_time)}</span>
                <span data-label="Due">{formatDate(project.due_date)}</span>
                <span data-label="Actions">
                  <button type="button" className="table__delete" onClick={() => handleDelete(project.id)}>
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
