import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/forms.css'

type WorkflowTemplate = {
  id: number
  name: string
  description: string | null
}

type WorkflowStep = {
  id: number
  template_id: number
  name: string
  position: number
}

function CreateProject() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [planTier, setPlanTier] = useState('')
  const [status, setStatus] = useState('briefing')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [workflowTemplateId, setWorkflowTemplateId] = useState<number | ''>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest<{ templates: WorkflowTemplate[]; steps: WorkflowStep[] }>('/workflows', {}, token)
      .then((data) => {
        setTemplates(data.templates)
        setSteps(data.steps)
        if (data.templates[0]) setWorkflowTemplateId(data.templates[0].id)
      })
      .catch(() => setError('Unable to load workflows.'))
  }, [token])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return

    try {
      const project = await apiRequest<{ id: number }>(
        '/projects',
        {
          method: 'POST',
          body: JSON.stringify({
            title,
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            planTier,
            status,
            startDate,
            dueDate,
            notes,
            workflowTemplateId: workflowTemplateId || null,
          }),
        },
        token,
      )
      navigate(`/projects/${project.id}`)
    } catch {
      setError('Unable to create project.')
    }
  }

  const selectedSteps = steps.filter((step) => step.template_id === workflowTemplateId)

  return (
    <Layout title="Start new project">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Project setup</h2>
        {error && <div className="form-error">{error}</div>}
        <label>
          Project title
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <div className="grid">
          <label>
            Client name
            <input value={clientName} onChange={(event) => setClientName(event.target.value)} />
          </label>
          <label>
            Client email
            <input value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} />
          </label>
          <label>
            Client phone
            <input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} />
          </label>
          <label>
            Service type
            <input value={serviceType} onChange={(event) => setServiceType(event.target.value)} />
          </label>
          <label>
            Plan tier
            <input value={planTier} onChange={(event) => setPlanTier(event.target.value)} />
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="briefing">Briefing</option>
              <option value="scheduled">Scheduled</option>
              <option value="shoot">Shoot</option>
              <option value="edit">Edit</option>
              <option value="review">Review</option>
              <option value="delivery">Delivery</option>
              <option value="archive">Archive</option>
            </select>
          </label>
          <label>
            Start date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>
            Due date
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </label>
        </div>
        <label>
          Workflow template
          <select
            value={workflowTemplateId}
            onChange={(event) => setWorkflowTemplateId(Number(event.target.value))}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
        {selectedSteps.length > 0 && (
          <div className="workflow-preview">
            <p>Workflow steps:</p>
            <ul>
              {selectedSteps.map((step) => (
                <li key={step.id}>{step.position}. {step.name}</li>
              ))}
            </ul>
          </div>
        )}
        <label>
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </label>
        <button type="submit">Create project</button>
      </form>
    </Layout>
  )
}

export default CreateProject
