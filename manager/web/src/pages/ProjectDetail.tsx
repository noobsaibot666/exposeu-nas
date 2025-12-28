import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest, apiUpload, apiBase } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/forms.css'
import './ProjectDetail.css'

type Project = {
  id: number
  title: string
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  service_type: string | null
  plan_tier: string | null
  status: string | null
  start_date: string | null
  due_date: string | null
  notes: string | null
}

type FileItem = {
  id: number
  filename: string
  stored_path: string
  created_at: string
}

type Delivery = {
  id: number
  title: string
  url: string
  created_at: string
}

type TimeLog = {
  id: number
  minutes: number
  note: string | null
  logged_at: string
}

type Step = {
  id: number
  name: string
  position: number
  status: string
  due_date: string | null
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

function ProjectDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [shareToken, setShareToken] = useState('')
  const [status, setStatus] = useState('')
  const [newStepName, setNewStepName] = useState('')
  const [newStepDue, setNewStepDue] = useState('')
  const [deliveryTitle, setDeliveryTitle] = useState('')
  const [deliveryUrl, setDeliveryUrl] = useState('')
  const [minutes, setMinutes] = useState('')
  const [logNote, setLogNote] = useState('')
  const [error, setError] = useState('')

  const loadProject = () => {
    if (!token || !id) return
    apiRequest<{ project: Project; steps: Step[]; files: FileItem[]; deliveries: Delivery[]; timeLogs: TimeLog[] }>(
      `/projects/${id}`,
      {},
      token,
    )
      .then((data) => {
        setProject(data.project)
        setStatus(data.project.status ?? '')
        setSteps(data.steps ?? [])
        setFiles(data.files)
        setDeliveries(data.deliveries)
        setTimeLogs(data.timeLogs)
      })
      .catch(() => setError('Unable to load project.'))
  }

  useEffect(() => {
    loadProject()
  }, [token, id])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !id || !event.target.files?.[0]) return
    try {
      await apiUpload(`/projects/${id}/files`, event.target.files[0], token)
      loadProject()
    } catch {
      setError('Upload failed.')
    }
  }

  const handleAddDelivery = async () => {
    if (!token || !id || !deliveryTitle || !deliveryUrl) return
    await apiRequest(
      `/projects/${id}/deliveries`,
      {
        method: 'POST',
        body: JSON.stringify({ title: deliveryTitle, url: deliveryUrl }),
      },
      token,
    )
    setDeliveryTitle('')
    setDeliveryUrl('')
    loadProject()
  }

  const handleAddTime = async () => {
    if (!token || !id || !minutes) return
    await apiRequest(
      `/projects/${id}/time-logs`,
      {
        method: 'POST',
        body: JSON.stringify({ minutes: Number(minutes), note: logNote || null }),
      },
      token,
    )
    setMinutes('')
    setLogNote('')
    loadProject()
  }

  const handleShare = async () => {
    if (!token || !id) return
    const response = await apiRequest<{ token: string }>(
      `/projects/${id}/share`,
      { method: 'POST' },
      token,
    )
    setShareToken(response.token)
  }

  const handleStatusUpdate = async () => {
    if (!token || !id) return
    await apiRequest(
      `/projects/${id}`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      token,
    )
    loadProject()
  }

  const toggleStep = async (step: Step) => {
    if (!token || !id) return
    const nextStatus = step.status === 'done' ? 'pending' : 'done'
    await apiRequest(
      `/projects/${id}/steps/${step.id}`,
      { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) },
      token,
    )
    loadProject()
  }

  const addStep = async () => {
    if (!token || !id || !newStepName.trim()) return
    await apiRequest(
      `/projects/${id}/steps`,
      { method: 'POST', body: JSON.stringify({ name: newStepName.trim(), dueDate: newStepDue || null }) },
      token,
    )
    setNewStepName('')
    setNewStepDue('')
    loadProject()
  }

  const removeStep = async (stepId: number) => {
    if (!token || !id) return
    await apiRequest(`/projects/${id}/steps/${stepId}`, { method: 'DELETE' }, token)
    loadProject()
  }

  if (!project) {
    return (
      <Layout title="Project detail">
        {error && <div className="form-error">{error}</div>}
      </Layout>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = project.due_date ? new Date(project.due_date) : null
  const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / 86400000) : null
  const overdueSteps = steps.filter((step) => {
    if (!step.due_date || step.status === 'done') return false
    const stepDate = new Date(step.due_date)
    stepDate.setHours(0, 0, 0, 0)
    return stepDate < today
  })
  const totalMinutes = timeLogs.reduce((sum, log) => sum + log.minutes, 0)

  const alerts = [
    ...(dueDate && daysUntilDue !== null && daysUntilDue < 0
      ? [{
          tone: 'danger',
          title: 'Deadline missed',
          detail: `Project due ${formatDate(project.due_date)}.`,
        }]
      : []),
    ...(dueDate && daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 5
      ? [{
          tone: 'warning',
          title: 'Deadline approaching',
          detail: `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}.`,
        }]
      : []),
    ...(overdueSteps.length > 0
      ? [{
          tone: 'danger',
          title: 'Overdue steps',
          detail: `${overdueSteps.length} workflow step${overdueSteps.length === 1 ? '' : 's'} past due.`,
        }]
      : []),
    ...(totalMinutes > 360 && project.status !== 'delivery'
      ? [{
          tone: 'warning',
          title: 'Time burn alert',
          detail: `${totalMinutes} minutes logged before delivery.`,
        }]
      : []),
  ]

  if (alerts.length === 0) {
    if (!project.due_date) {
      alerts.push({
        tone: 'warning',
        title: 'No due date set',
        detail: 'Add a due date to track runway and risk.',
      })
    } else if (daysUntilDue !== null && daysUntilDue > 5) {
      alerts.push({
        tone: 'ok',
        title: 'On track',
        detail: `Plenty of runway — due in ${daysUntilDue} days.`,
      })
    } else {
      alerts.push({
        tone: 'ok',
        title: 'On track',
        detail: 'Timeline is healthy.',
      })
    }
  }

  return (
    <Layout title={project.title}>
      <div className="detail">
        <div className="detail__summary">
          <p><strong>Client:</strong> {project.client_name ?? '—'}</p>
          <p><strong>Email:</strong> {project.client_email ?? '—'}</p>
          <p><strong>Phone:</strong> {project.client_phone ?? '—'}</p>
          <p><strong>Service:</strong> {project.service_type ?? '—'}</p>
          <p><strong>Plan:</strong> {project.plan_tier ?? '—'}</p>
          <div className="detail__status">
            <strong>Status:</strong>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="briefing">Briefing</option>
              <option value="scheduled">Scheduled</option>
              <option value="shoot">Shoot</option>
              <option value="edit">Edit</option>
              <option value="review">Review</option>
              <option value="delivery">Delivery</option>
              <option value="archive">Archive</option>
            </select>
            <button type="button" onClick={handleStatusUpdate}>Update</button>
          </div>
          <p><strong>Start:</strong> {formatDate(project.start_date)}</p>
          <p><strong>Due:</strong> {formatDate(project.due_date)}</p>
        </div>
        <div className="detail__stack">
          <section className="panel panel--compact">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 7h10M7 12h6M7 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Notes</p>
                  <h3>Notes</h3>
                </div>
              </div>
            </div>
            <p>{project.notes ?? 'No notes yet.'}</p>
          </section>
          <section className="panel panel--compact">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4l8 14H4L12 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 10v4M12 16v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Alerts</p>
                  <h3>Alerts</h3>
                </div>
              </div>
            </div>
            <ul className="detail__alerts-list">
              {alerts.map((alert) => (
                <li key={alert.title} className={`alert alert--${alert.tone}`}>
                  <strong>{alert.title}</strong>
                  <span>{alert.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel__header">
            <div className="panel__title">
              <span className="panel__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h10M4 12h16M4 18h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="eyebrow">Sequence</p>
                <h3>Workflow</h3>
                <p className="panel__subtitle">Define the steps, dates, and progress for delivery.</p>
              </div>
            </div>
          </div>
          <ul>
            {steps.map((step) => (
              <li
                key={step.id}
                className={`step-row${step.status === 'done' ? ' step-row--done' : ''}${
                  step.due_date && step.status !== 'done' && new Date(step.due_date) < today ? ' step-row--late' : ''
                }`}
              >
                <div className="step-row__main">
                  <label>
                    <input
                      type="checkbox"
                      checked={step.status === 'done'}
                      onChange={() => toggleStep(step)}
                    />
                    <span>{step.position}. {step.name}</span>
                  </label>
                  <span className="step-row__date">{step.due_date ? formatDate(step.due_date) : 'No date'}</span>
                </div>
                <button type="button" onClick={() => removeStep(step.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="step-add">
            <input
              placeholder="New step name"
              value={newStepName}
              onChange={(event) => setNewStepName(event.target.value)}
            />
            <input
              type="date"
              value={newStepDue}
              onChange={(event) => setNewStepDue(event.target.value)}
            />
            <button type="button" onClick={addStep}>Add step</button>
          </div>
        </section>

        <div className="panel-stack">
          <section className="panel">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 7a2 2 0 0 1 2-2h5l3 3h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Repository</p>
                  <h3>Files</h3>
                  <p className="panel__subtitle">Collect briefs, assets, and final exports in one place.</p>
                </div>
              </div>
              <input type="file" onChange={handleUpload} />
            </div>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  {file.filename}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Milestones</p>
                  <h3>Deliveries</h3>
                  <p className="panel__subtitle">Track client-ready links and approvals.</p>
                </div>
              </div>
              <div className="panel__actions">
                <input
                  placeholder="Title"
                  value={deliveryTitle}
                  onChange={(event) => setDeliveryTitle(event.target.value)}
                />
                <input
                  placeholder="URL"
                  value={deliveryUrl}
                  onChange={(event) => setDeliveryUrl(event.target.value)}
                />
                <button type="button" onClick={handleAddDelivery}>
                  Add
                </button>
              </div>
            </div>
            <ul>
              {deliveries.map((delivery) => (
                <li key={delivery.id}>
                  <a href={delivery.url} target="_blank" rel="noreferrer">
                    {delivery.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v6l4 2M4 12a8 8 0 1 0 16 0a8 8 0 0 0-16 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Effort</p>
                  <h3>Time logs</h3>
                  <p className="panel__subtitle">Understand where the hours go and spot overruns.</p>
                </div>
              </div>
              <div className="panel__actions">
                <input
                  placeholder="Minutes"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                />
                <input
                  placeholder="Note"
                  value={logNote}
                  onChange={(event) => setLogNote(event.target.value)}
                />
                <button type="button" onClick={handleAddTime}>
                  Log
                </button>
              </div>
            </div>
            <ul>
              {timeLogs.map((log) => (
                <li key={log.id}>
                  {log.minutes} min {log.note ? `— ${log.note}` : ''}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Sharing</p>
                  <h3>Client share link</h3>
                  <p className="panel__subtitle">Send a clean review link with zero logins.</p>
                </div>
              </div>
              <button type="button" onClick={handleShare}>
                Generate link
              </button>
            </div>
            {shareToken && (
              <div className="share">
                <p>Share page:</p>
                <Link to={`/share/${shareToken}`}>{`${window.location.origin}/share/${shareToken}`}</Link>
                <p className="share__meta">API: {apiBase}/share/{shareToken}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default ProjectDetail
