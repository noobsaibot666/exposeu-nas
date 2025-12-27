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
          <p><strong>Start:</strong> {project.start_date ?? '—'}</p>
          <p><strong>Due:</strong> {project.due_date ?? '—'}</p>
        </div>
        <div className="detail__notes">
          <h3>Notes</h3>
          <p>{project.notes ?? 'No notes yet.'}</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel__header">
          <h3>Workflow</h3>
        </div>
        <ul>
          {steps.map((step) => (
            <li key={step.id} className="step-row">
              <label>
                <input
                  type="checkbox"
                  checked={step.status === 'done'}
                  onChange={() => toggleStep(step)}
                />
                <span>{step.position}. {step.name}</span>
              </label>
              <span>{step.due_date ? `· ${step.due_date}` : ''}</span>
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

      <section className="panel">
        <div className="panel__header">
          <h3>Files</h3>
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
          <h3>Deliveries</h3>
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
          <h3>Time logs</h3>
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
          <h3>Client share link</h3>
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
    </Layout>
  )
}

export default ProjectDetail
