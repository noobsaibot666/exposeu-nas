import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/forms.css'

type WorkflowTemplate = {
  id: number
  name: string
  description: string | null
  tags?: string[]
}

type WorkflowStep = {
  id: number
  template_id: number
  name: string
  position: number
  default_offset_days?: number | string | null
  default_cost?: number | string | null
}

type ProjectStep = {
  id: number
  name: string
  position: number
}

type BuilderStep = {
  id: number
  name: string
  offsetDays: string
  cost: string
}

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

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
  const [projectColor, setProjectColor] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('briefing')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [workflowTemplateId, setWorkflowTemplateId] = useState<number | ''>('')
  const [error, setError] = useState('')
  const [builderName, setBuilderName] = useState('')
  const [builderDescription, setBuilderDescription] = useState('')
  const [builderTags, setBuilderTags] = useState('')
  const [builderStepName, setBuilderStepName] = useState('')
  const [builderStepOffset, setBuilderStepOffset] = useState('')
  const [builderStepCost, setBuilderStepCost] = useState('')
  const [builderSteps, setBuilderSteps] = useState<BuilderStep[]>([])
  const [builderError, setBuilderError] = useState('')
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [savingWorkflow, setSavingWorkflow] = useState(false)
  const [budgetEnabled, setBudgetEnabled] = useState(false)
  const [totalBudget, setTotalBudget] = useState('')
  const [productionBudget, setProductionBudget] = useState('')
  const [profitPercent, setProfitPercent] = useState('')
  const [profitBudget, setProfitBudget] = useState('')
  const [vatAmount, setVatAmount] = useState('')
  const [vatPercent, setVatPercent] = useState('')
  const [budgetNotes, setBudgetNotes] = useState('')
  const [stepCosts, setStepCosts] = useState<Record<number, string>>({})
  const [stepDueDates, setStepDueDates] = useState<Record<number, string>>({})

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
            tags: parseTags(tags),
            status,
            startDate,
            dueDate,
            notes,
            workflowTemplateId: workflowTemplateId || null,
            projectColor: projectColor || null,
            stepDueDates: selectedSteps.map((step) => ({
              templateStepId: step.id,
              dueDate: stepDueDates[step.id] || null,
            })),
          }),
        },
        token,
      )
      if (budgetEnabled) {
        try {
          const projectDetail = await apiRequest<{ steps: ProjectStep[] }>(`/projects/${project.id}`, {}, token)
          const costByPosition = new Map<number, string>()
          selectedSteps.forEach((step) => {
            costByPosition.set(step.position, stepCosts[step.id] ?? '')
          })
          await apiRequest(
            '/budgets',
            {
              method: 'POST',
              body: JSON.stringify({
                projectId: project.id,
                totalBudget,
                productionBudget,
                profitBudget,
                profitPercent,
                vatAmount,
                vatPercent,
                notes: budgetNotes.trim() || null,
                steps: projectDetail.steps.map((step) => ({
                  projectStepId: step.id,
                  stepName: step.name,
                  stepPosition: step.position,
                  costAmount: costByPosition.get(step.position) ?? '',
                })),
              }),
            },
            token,
          )
        } catch {
          // Budget creation is optional; project can still be created.
        }
      }
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
      { id: Date.now(), name: trimmed, offsetDays: builderStepOffset, cost: builderStepCost },
    ])
    setBuilderStepName('')
    setBuilderStepOffset('')
    setBuilderStepCost('')
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
            tags: parseTags(builderTags),
            steps: builderSteps.map((step, index) => ({
              name: step.name.trim(),
              position: index + 1,
              defaultOffsetDays: step.offsetDays ? Number(step.offsetDays) : 0,
              defaultCost: step.cost ? Number(step.cost) : 0,
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

  const selectedSteps = useMemo(
    () => steps.filter((step) => step.template_id === workflowTemplateId),
    [steps, workflowTemplateId],
  )

  useEffect(() => {
    const total = Number(totalBudget) || 0
    const profitPct = Number(profitPercent) || 0
    const vatPct = Number(vatPercent) || 0
    const profit = total * (profitPct / 100)
    const vat = total * (vatPct / 100)
    const production = Math.max(0, total - profit - vat)
    setVatAmount(vat ? vat.toFixed(2) : '')
    setProductionBudget(production ? production.toFixed(2) : '')
    setProfitBudget(profit ? profit.toFixed(2) : '')
  }, [profitPercent, totalBudget, vatPercent])

  useEffect(() => {
    if (!budgetEnabled) return
    setStepCosts((current) => {
      const next: Record<number, string> = {}
      for (const step of selectedSteps) {
        const rawDefault = step.default_cost
        const defaultValue =
          rawDefault === null || rawDefault === undefined || Number(rawDefault) <= 0
            ? ''
            : Number(rawDefault).toFixed(2)
        next[step.id] = current[step.id] ?? defaultValue
      }
      return next
    })
  }, [budgetEnabled, selectedSteps])

  useEffect(() => {
    setStepDueDates((current) => {
      const next: Record<number, string> = {}
      for (const step of selectedSteps) {
        next[step.id] = current[step.id] ?? ''
      }
      return next
    })
  }, [selectedSteps])

  const productionRemaining = useMemo(() => {
    const production = Number(productionBudget) || 0
    const allocated = selectedSteps.reduce((total, step) => total + (Number(stepCosts[step.id]) || 0), 0)
    return production - allocated
  }, [productionBudget, selectedSteps, stepCosts])

  const productionRemainingTone = useMemo(() => {
    const production = Number(productionBudget) || 0
    if (production <= 0) return 'neutral'
    const remaining = productionRemaining
    if (remaining <= 0) return 'danger'
    if (remaining <= production * 0.2) return 'warning'
    return 'ok'
  }, [productionBudget, productionRemaining])

  const formatOffset = (value?: number | string | null) => {
    if (value === null || value === undefined) return ''
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return ''
    return `${numeric % 1 === 0 ? numeric.toFixed(0) : numeric}d`
  }

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
          <div className="project-form__row">
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
                    Project color
                    <input
                      type="color"
                      value={projectColor || '#9ca3af'}
                      onChange={(event) => setProjectColor(event.target.value)}
                    />
                  </label>
                  <label>
                    Tags (comma separated)
                    <input value={tags} onChange={(event) => setTags(event.target.value)} />
                  </label>
                  <label className="grid-span">
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
                  <div className="grid grid-span">
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
              </div>
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
                  <label>
                    Tags (comma separated)
                    <input value={builderTags} onChange={(event) => setBuilderTags(event.target.value)} />
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
                      type="number"
                      step="0.5"
                      min="0"
                    />
                    <input
                      placeholder="Step value (EUR)"
                      value={builderStepCost}
                      onChange={(event) => setBuilderStepCost(event.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
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
                        <span className="muted">{step.cost ? `EUR ${step.cost}` : 'No value'}</span>
                        <button type="button" onClick={() => removeBuilderStep(step.id)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="workflow-assign">
                <div className="section-heading">
                  <p className="eyebrow">Workflow</p>
                  <h3>Assign a template</h3>
                  <p className="muted">Pick a proven sequence or build a new one above.</p>
                </div>
                <label>
                  Workflow template
                  <div className="workflow-template-row">
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
                    <button
                      type="button"
                      className="ghost-link ghost-link--compact"
                      disabled={!workflowTemplateId}
                      onClick={async () => {
                        if (!token || !workflowTemplateId) return
                        const template = templates.find((item) => item.id === workflowTemplateId)
                        const confirmed = window.confirm(
                          `Delete workflow template "${template?.name ?? 'this template'}"? This cannot be undone.`,
                        )
                        if (!confirmed) return
                        try {
                          await apiRequest(`/workflows/${workflowTemplateId}`, { method: 'DELETE' }, token)
                          setWorkflowTemplateId('')
                          loadWorkflows()
                        } catch {
                          setBuilderError('Unable to delete workflow template.')
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </label>
                {selectedSteps.length > 0 && (
                  <div className="workflow-preview">
                    <p>Workflow steps:</p>
                    <ul>
                      {selectedSteps.map((step) => (
                        <li key={step.id}>{step.position}. {step.name}</li>
                      ))}
                    </ul>
                    {templates.find((template) => template.id === workflowTemplateId)?.tags?.length ? (
                      <p className="muted">
                        Tags: {templates.find((template) => template.id === workflowTemplateId)?.tags?.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
                {selectedSteps.length > 0 && (
                  <div className="workflow-schedule">
                    <p className="muted">Set step due dates (calendar dates).</p>
                    {selectedSteps.map((step) => (
                      <label key={step.id} className="workflow-schedule__row">
                        <span>
                          {step.position}. {step.name}
                        </span>
                        <input
                          type="date"
                          value={stepDueDates[step.id] ?? ''}
                          onChange={(event) =>
                            setStepDueDates((current) => ({ ...current, [step.id]: event.target.value }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="budget-columns">
            <section className="project-form__section">
              <div className="section-heading">
                <p className="eyebrow">Budget</p>
                <h3>Budget control (optional)</h3>
                <p className="muted">Set production spend, profit target, and VAT for this project.</p>
              </div>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={budgetEnabled}
                  onChange={(event) => setBudgetEnabled(event.target.checked)}
                />
                Enable budget control
              </label>
              {budgetEnabled && (
                <div className="budget-section">
                  <div className="grid">
                    <label>
                      Project budget
                      <input
                        value={totalBudget}
                        onChange={(event) => setTotalBudget(event.target.value)}
                      />
                    </label>
                    <label>
                      Production budget
                      <input value={productionBudget} disabled />
                    </label>
                    <label>
                      Profit target (%)
                      <input
                        value={profitPercent}
                        onChange={(event) => setProfitPercent(event.target.value)}
                      />
                    </label>
                    <label>
                      Profit amount
                      <input value={profitBudget} disabled />
                    </label>
                    <label>
                      VAT (%)
                      <input
                        value={vatPercent}
                        onChange={(event) => setVatPercent(event.target.value)}
                      />
                    </label>
                    <label>
                      VAT amount
                      <input value={vatAmount} disabled />
                    </label>
                  </div>
                  <label className="notes-field">
                    Budget notes
                    <textarea
                      value={budgetNotes}
                      onChange={(event) => setBudgetNotes(event.target.value)}
                      rows={2}
                    />
                  </label>
                </div>
              )}
            </section>
            <section className="project-form__section">
              <div className="section-heading">
                <p className="eyebrow">Production</p>
                <h3>Allocate production costs</h3>
                <p className="muted">Allocate production costs by workflow step.</p>
              </div>
              {budgetEnabled && selectedSteps.length > 0 ? (
                <div className="budget-steps">
                  <div className={`budget-remaining budget-remaining--${productionRemainingTone}`}>
                    <span>Production remaining</span>
                    <strong>EUR {productionRemaining.toFixed(2)}</strong>
                  </div>
                  {selectedSteps.map((step) => (
                    <label key={step.id} className="budget-step-row">
                      <span>
                        {step.position}. {step.name}
                        {formatOffset(step.default_offset_days) && (
                          <em className="budget-step-meta">+{formatOffset(step.default_offset_days)}</em>
                        )}
                      </span>
                      <input
                        value={stepCosts[step.id] ?? ''}
                        onChange={(event) =>
                          setStepCosts((current) => ({ ...current, [step.id]: event.target.value }))
                        }
                        placeholder="0.00"
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <p className="muted">Enable budget control and select a workflow to allocate costs.</p>
              )}
            </section>
          </div>

          <aside className="project-form__sidebar">
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
