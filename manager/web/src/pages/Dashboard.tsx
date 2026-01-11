import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  start_date: string | null
  due_date: string | null
  created_at: string
  tags?: string[]
  share_links?: Array<{ token: string; created_at: string; expires_at: string | null }>
}

const hasUrgentTag = (tags?: string[]) =>
  (tags ?? []).some((tag) => tag.trim().toLowerCase() === 'urgent')

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date)
}

function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [timelineOffsets, setTimelineOffsets] = useState<Record<number, number>>({})
  const draggingRef = useRef<{
    id: number | null
    startX: number
    offset: number
    mode: 'move' | 'resize-left' | 'resize-right'
  }>({
    id: null,
    startX: 0,
    offset: 0,
    mode: 'move',
  })
  const draggedRef = useRef<{ id: number | null; moved: boolean }>({ id: null, moved: false })

  useEffect(() => {
    if (!token) return
    apiRequest<Project[]>('/projects', {}, token)
      .then(setProjects)
      .catch(() => setError('Unable to load projects.'))
  }, [token])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const projectsWithDue = projects
    .map((project) => ({
      ...project,
      due: project.due_date ? new Date(project.due_date) : null,
    }))
    .map((project) => {
      if (project.due) {
        project.due.setHours(0, 0, 0, 0)
      }
      return project
    })

  const overdue = projectsWithDue.filter((project) => project.status !== 'archive' && project.due && project.due < today)
  const dueSoon = projectsWithDue.filter((project) => {
    if (project.status === 'archive') return false
    if (!project.due) return false
    const days = Math.ceil((project.due.getTime() - today.getTime()) / 86400000)
    return days >= 0 && days <= 5
  })
  const activeProjects = projectsWithDue.filter((project) => project.status !== 'archive')
  const urgentProjects = activeProjects
    .filter((project) => hasUrgentTag(project.tags))
    .sort((a, b) => {
      const aDue = a.due?.getTime() ?? Infinity
      const bDue = b.due?.getTime() ?? Infinity
      if (aDue !== bDue) return aDue - bDue
      return a.created_at.localeCompare(b.created_at)
    })
  const timelineProjects = projectsWithDue
    .filter((project) => project.due && project.status !== 'archive')
    .map((project) => {
      const start = project.start_date ? new Date(project.start_date) : new Date(project.created_at)
      start.setHours(0, 0, 0, 0)
      const end = project.due ?? start
      return { ...project, start, end }
    })
    .sort((a, b) => {
      const tagA = (a.tags ?? []).slice().sort()[0]?.toLowerCase() ?? ''
      const tagB = (b.tags ?? []).slice().sort()[0]?.toLowerCase() ?? ''
      if (tagA && tagB && tagA !== tagB) return tagA.localeCompare(tagB)
      if (tagA && !tagB) return -1
      if (!tagA && tagB) return 1
      return a.start.getTime() - b.start.getTime()
    })

  const dayMs = 86400000
  const timelineStart = timelineProjects.reduce<Date | null>((min, project) => {
    if (!min || project.start < min) return project.start
    return min
  }, null)
  const timelineEnd = timelineProjects.reduce<Date | null>((max, project) => {
    if (!max || project.end > max) return project.end
    return max
  }, null)
  const baseStart = timelineStart ?? today
  const baseEnd = timelineEnd ?? new Date(today.getTime() + dayMs * 13)
  const minEnd = new Date(baseStart.getTime() + dayMs * 13)
  const rangeEnd = baseEnd < minEnd ? minEnd : baseEnd
  const daysCount = Math.max(1, Math.round((rangeEnd.getTime() - baseStart.getTime()) / dayMs) + 1)
  const days = Array.from({ length: daysCount }, (_, index) => new Date(baseStart.getTime() + index * dayMs))

  const getTone = (project: { end: Date }) => {
    const daysLeft = Math.ceil((project.end.getTime() - today.getTime()) / dayMs)
    if (daysLeft < 0) return 'danger'
    if (daysLeft <= 5) return 'warning'
    return 'ok'
  }

  const handleMarkDone = async (id: number) => {
    if (!token) return
    try {
      await apiRequest(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'archive' }) }, token)
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? { ...project, status: 'archive' } : project)),
      )
    } catch {
      setError('Unable to mark project done.')
    }
  }

  const handlePointerDown = (
    id: number,
    mode: 'move' | 'resize-left' | 'resize-right',
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const currentOffset = timelineOffsets[id] ?? 0
    draggingRef.current = { id, startX: event.clientX, offset: currentOffset, mode }
    draggedRef.current = { id, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (id: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current.id !== id) return
    const delta = event.clientX - draggingRef.current.startX
    const offsetDays = Math.round(delta / 72)
    if (Math.abs(delta) > 4) draggedRef.current.moved = true
    setTimelineOffsets((prev) => ({ ...prev, [id]: draggingRef.current.offset + offsetDays }))
  }

  const handlePointerUp = async (
    id: number,
    event: React.PointerEvent<HTMLDivElement>,
    start: Date,
    end: Date,
  ) => {
    if (draggingRef.current.id !== id) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    const offsetDays = timelineOffsets[id] ?? 0
    const moved = draggedRef.current.id === id && draggedRef.current.moved
    const mode = draggingRef.current.mode
    draggingRef.current = { id: null, startX: 0, offset: 0, mode: 'move' }
    draggedRef.current = { id: null, moved: false }

    if (!moved && mode === 'move') {
      navigate(`/projects/${id}`)
      return
    }

    if (offsetDays === 0 || !token) return

    const nextStart =
      mode === 'resize-left'
        ? new Date(start.getTime() + offsetDays * dayMs)
        : new Date(start.getTime() + (mode === 'move' ? offsetDays : 0) * dayMs)
    const nextEnd =
      mode === 'resize-right'
        ? new Date(end.getTime() + offsetDays * dayMs)
        : new Date(end.getTime() + (mode === 'move' ? offsetDays : 0) * dayMs)

    if (nextEnd < nextStart) return
    const startDate = nextStart.toISOString().slice(0, 10)
    const dueDate = nextEnd.toISOString().slice(0, 10)

    try {
      await apiRequest(
        `/projects/${id}`,
        { method: 'PATCH', body: JSON.stringify({ startDate, dueDate }) },
        token,
      )
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, start_date: startDate, due_date: dueDate } : project,
        ),
      )
      setTimelineOffsets((prev) => ({ ...prev, [id]: 0 }))
    } catch {
      setError('Unable to update timeline.')
    }
  }

  return (
    <Layout title="Projects overview" headerClassName="layout__header--hero" hideDashboardLink>
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <p className="eyebrow">Planning</p>
            <h2>Command center</h2>
            <p className="muted">Track deadlines, spot risk, and keep delivery momentum on one screen.</p>
          </div>
          <div className="dashboard__actions">
            <Link to="/projects/new" className="button">
              New project
            </Link>
            <Link to="/budgets" className="button button--ghost">
              Budget control
            </Link>
            <Link to="/archive" className="button button--ghost">
              Archive
            </Link>
          </div>
        </div>
        <div className="dashboard__stats">
          <Link to="/stats/active" className="stat-card">
            <p className="stat-card__label">Active projects</p>
            <div className="stat-card__value">{activeProjects.length}</div>
            <p className="stat-card__meta">Total: {projects.length}</p>
          </Link>
          <Link to="/stats/focus" className="stat-card stat-card--focus">
            <p className="stat-card__label">Focus today</p>
            <div className="stat-card__value">{urgentProjects.length}</div>
            <p className="stat-card__meta">Tagged urgent</p>
          </Link>
          <Link to="/stats/due-soon" className="stat-card stat-card--warning">
            <p className="stat-card__label">Due soon</p>
            <div className="stat-card__value">{dueSoon.length}</div>
            <p className="stat-card__meta">Next 5 days</p>
          </Link>
          <Link to="/stats/overdue" className="stat-card stat-card--danger">
            <p className="stat-card__label">Overdue</p>
            <div className="stat-card__value">{overdue.length}</div>
            <p className="stat-card__meta">Needs attention</p>
          </Link>
          <Link to="/stats/shared" className="stat-card stat-card--accent">
            <p className="stat-card__label">Shared links</p>
            <div className="stat-card__value">
              {projects.filter((project) => (project.share_links ?? []).length > 0).length}
            </div>
            <p className="stat-card__meta">Active shares</p>
          </Link>
        </div>
        <div className="dashboard__timeline">
          <div className="timeline__header">
            <div>
              <p className="eyebrow">Timeline</p>
              <h3>Delivery timeline</h3>
              <p className="muted">Drag projects to adjust start/end dates in the schedule.</p>
            </div>
            <span className="timeline__legend">Urgent • Late • Soon • On track</span>
          </div>
          {timelineProjects.length === 0 && <p className="muted">Add due dates to see the timeline.</p>}
          {timelineProjects.length > 0 && (
            <div className="timeline-board">
              <div className="timeline-board__days" style={{ '--days': daysCount } as CSSProperties}>
                <div className="timeline-board__spacer" />
                <div className="timeline-board__grid">
                  {days.map((day) => (
                    <div key={day.toISOString()} className="timeline-board__day">
                      <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <strong>{day.getDate()}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="timeline-board__rows" style={{ '--days': daysCount } as CSSProperties}>
                {timelineProjects.map((project) => {
                  const offset = timelineOffsets[project.id] ?? 0
                  const shiftedStart = new Date(project.start.getTime() + offset * dayMs)
                  const shiftedEnd = new Date(project.end.getTime() + offset * dayMs)
                  const rawStartIndex = Math.round((shiftedStart.getTime() - baseStart.getTime()) / dayMs)
                  const rawEndIndex = Math.round((shiftedEnd.getTime() - baseStart.getTime()) / dayMs)
                  const startIndex = Math.max(0, Math.min(daysCount - 1, rawStartIndex))
                  const endIndex = Math.max(startIndex, Math.min(daysCount - 1, rawEndIndex))
                  const spanDays = endIndex - startIndex + 1
                  const width = spanDays * 72
                  const tone = getTone({ end: shiftedEnd })
                  const urgent = hasUrgentTag(project.tags)
                  const compactClass =
                    spanDays <= 1 ? 'timeline-chip--compact-1'
                      : spanDays === 2
                        ? 'timeline-chip--compact-2'
                        : spanDays === 3
                          ? 'timeline-chip--compact-3'
                          : spanDays === 4
                            ? 'timeline-chip--compact-4'
                            : ''

                  return (
                    <div key={project.id} className="timeline-row">
                      <div className="timeline-row__label">
                        <span className="timeline-row__title">{project.title}</span>
                        <span className="timeline-row__meta">{project.client_name ?? 'No client'}</span>
                        {project.tags && project.tags.length > 0 && (
                          <span className="timeline-row__tag">{[...project.tags].sort()[0]}</span>
                        )}
                      </div>
                      <div className="timeline-row__track timeline-project">
                        <div
                          className={`timeline-chip timeline-chip--${tone}${compactClass ? ` ${compactClass}` : ''}${
                            urgent ? ' timeline-chip--urgent' : ''
                          }`}
                          style={{ width, transform: `translateX(${startIndex * 72}px)` }}
                          role="button"
                          tabIndex={0}
                          onPointerDown={(event) => handlePointerDown(project.id, 'move', event)}
                          onPointerMove={(event) => handlePointerMove(project.id, event)}
                          onPointerUp={(event) => handlePointerUp(project.id, event, project.start, project.end)}
                        >
                          <span
                            className="timeline-chip__handle timeline-chip__handle--left"
                            onPointerDown={(event) => {
                              event.stopPropagation()
                              handlePointerDown(project.id, 'resize-left', event)
                            }}
                            onPointerMove={(event) => handlePointerMove(project.id, event)}
                            onPointerUp={(event) => handlePointerUp(project.id, event, project.start, project.end)}
                          />
                          <span
                            className="timeline-chip__handle timeline-chip__handle--right"
                            onPointerDown={(event) => {
                              event.stopPropagation()
                              handlePointerDown(project.id, 'resize-right', event)
                            }}
                            onPointerMove={(event) => handlePointerMove(project.id, event)}
                            onPointerUp={(event) => handlePointerUp(project.id, event, project.start, project.end)}
                          />
                          <div className="timeline-chip__title">{project.service_type ?? project.status ?? 'Project'}</div>
                          <div className="timeline-chip__client">{project.client_name ?? 'No client'}</div>
                          <div className="timeline-chip__meta">
                            {formatDate(shiftedStart.toISOString())} – {formatDate(shiftedEnd.toISOString())}
                          </div>
                          {project.tags && project.tags.length > 0 && (
                            <div className="timeline-chip__tag">{[...project.tags].sort().join(' · ')}</div>
                          )}
                        </div>
                      </div>
                      <div className="timeline-row__actions">
                        <Link to={`/projects/${project.id}`} className="timeline-row__link">
                          View
                        </Link>
                        <button
                          type="button"
                          className="timeline-row__done"
                          onClick={() => handleMarkDone(project.id)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="table">
          <div className="table__row table__row--header">
            <span>Project</span>
            <span>Client</span>
            <span>Service</span>
            <span>Status</span>
            <span>Due</span>
            <span>Tags</span>
          </div>
          {projects
            .filter((project) => project.status !== 'archive')
            .map((project) => (
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
      </div>
    </Layout>
  )
}

export default Dashboard
