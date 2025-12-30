import { useCallback, useEffect, useState } from 'react'
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

type BuilderStep = {
  id: number
  name: string
  offsetDays: string
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
  const [builderName, setBuilderName] = useState('')
  const [builderDescription, setBuilderDescription] = useState('')
  const [builderStepName, setBuilderStepName] = useState('')
  const [builderStepOffset, setBuilderStepOffset] = useState('')
  const [builderSteps, setBuilderSteps] = useState<BuilderStep[]>([])
  const [builderError, setBuilderError] = useState('')
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [savingWorkflow, setSavingWorkflow] = useState(false)

  const loadWorkflows = useCallback(() => {
    if (!token) return
    apiRequest<{ templates: WorkflowTemplate[]; steps: WorkflowStep[] }>('/workflows', {}, token)
      .then((data) => {
        setTemplates(data.templates)
        setSteps(data.steps)
        if (data.templates[0]) setWorkflowTemplateId(data.templates[0].id)
      })
      .catch(() => setError('Unable to load workflows.'))
  }, [token])

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

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

  const addBuilderStep = () => {
    const trimmed = builderStepName.trim()
    if (!trimmed) return
    setBuilderSteps((current) => [
      ...current,
      { id: Date.now(), name: trimmed, offsetDays: builderStepOffset },
    ])
    setBuilderStepName('')
    setBuilderStepOffset('')
  }

  const removeBuilderStep = (id: number) => {
    setBuilderSteps((current) => current.filter((step) => step.id !== id))
  }

  const moveBuilderStep = (targetId: number) => {
    if (draggingId === null || draggingId === targetId) return
    setBuilderSteps((current) => {
      const draggedIndex = current.findIndex((step) => step.id === draggingId)
      const targetIndex = current.findIndex((step) => step.id === targetId)
      if (draggedIndex === -1 || targetIndex === -1) return current
      const updated = [...current]
      const [dragged] = updated.splice(draggedIndex, 1)
      updated.splice(targetIndex, 0, dragged)
      return updated
    })
    setDraggingId(null)
  }

  const saveWorkflowTemplate = async () => {
    if (!token) return
    if (!builderName.trim() || builderSteps.length === 0) {
      setBuilderError('Add a name and at least one step to save.')
      return
    }
    setSavingWorkflow(true)
    setBuilderError('')
    try {
      await apiRequest(
        '/workflows',
        {
          method: 'POST',
          body: JSON.stringify({
            name: builderName.trim(),
            description: builderDescription.trim() || null,
            steps: builderSteps.map((step, index) => ({
              name: step.name.trim(),
              position: index + 1,
              defaultOffsetDays: step.offsetDays ? Number(step.offsetDays) : 0,
            })),
          }),
        },
        token,
      )
      setBuilderName('')
      setBuilderDescription('')
      setBuilderSteps([])
      loadWorkflows()
    } catch {
      setBuilderError('Unable to save workflow.')
    } finally {
      setSavingWorkflow(false)
    }
  }

  const selectedSteps = steps.filter((step) => step.template_id === workflowTemplateId)

  return (
    <Layout title="Start new project">
      <form className="project-form" onSubmit={handleSubmit}>
        <header className="project-form__header">
          <div>
            <p className="eyebrow">Project setup</p>
            <h2>Start new project</h2>
            <p className="muted">Define the client, scope, and workflow before work begins.</p>
          </div>
        </header>
        {error && <div className="form-error">{error}</div>}
        <div className="project-form__body">
          <section className="project-form__section">
            <div className="section-heading">
              <p className="eyebrow">Essentials</p>
              <h3>Project information</h3>
              <p className="muted">Make sure the client and scope details are accurate.</p>
            </div>
            <div className="project-form__fields">
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
            </div>
          </section>

          <aside className="project-form__sidebar">
            <div className="workflow-row">
              <section className="project-form__section">
                <div className="section-heading">
                  <p className="eyebrow">Workflow</p>
                  <h3>Assign a template</h3>
                  <p className="muted">Pick a proven sequence or build a new one below.</p>
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
              </section>

              <section className="project-form__section">
                <div className="workflow-builder">
                  <div className="workflow-builder__header">
                    <div>
                      <p className="eyebrow">Workflow builder</p>
                      <h3>Personalize your steps</h3>
                      <p className="muted">
                        Drag steps into a sequence, save the template, and reuse it across projects.
                      </p>
                    </div>
                    <button type="button" onClick={saveWorkflowTemplate} disabled={savingWorkflow}>
                      {savingWorkflow ? 'Saving...' : 'Save workflow'}
                    </button>
                  </div>
                  {builderError && <div className="form-error">{builderError}</div>}
                  <div className="grid">
                    <label>
                      Workflow name
                      <input value={builderName} onChange={(event) => setBuilderName(event.target.value)} />
                    </label>
                    <label>
                      Short description
                      <input
                        value={builderDescription}
                        onChange={(event) => setBuilderDescription(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="workflow-builder__steps">
                    <div className="workflow-builder__add">
                      <input
                        placeholder="Step name"
                        value={builderStepName}
                        onChange={(event) => setBuilderStepName(event.target.value)}
                      />
                      <input
                        placeholder="Offset days"
                        value={builderStepOffset}
                        onChange={(event) => setBuilderStepOffset(event.target.value)}
                      />
                      <button type="button" onClick={addBuilderStep}>
                        Add step
                      </button>
                    </div>
                    <ul>
                      {builderSteps.map((step, index) => (
                        <li
                          key={step.id}
                          draggable
                          onDragStart={() => setDraggingId(step.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => moveBuilderStep(step.id)}
                        >
                          <span className="drag-handle" aria-hidden="true">⋮⋮</span>
                          <span>{index + 1}. {step.name}</span>
                          <span className="muted">{step.offsetDays ? `+${step.offsetDays}d` : 'No offset'}</span>
                          <button type="button" onClick={() => removeBuilderStep(step.id)}>
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <section className="project-form__section">
              <div className="section-heading">
                <p className="eyebrow">Notes</p>
                <h3>Context</h3>
                <p className="muted">Optional background or client requirements.</p>
              </div>
              <label className="notes-field">
                Notes
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
              </label>
            </section>
          </aside>
        </div>
        <div className="project-form__footer">
          <button type="submit">Create project</button>
        </div>
      </form>
    </Layout>
  )
}

export default CreateProject
