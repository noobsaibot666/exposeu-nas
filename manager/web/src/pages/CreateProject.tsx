import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import { parseRoadmapInput } from '../utils/roadmapParser'
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

type RoadmapPhase = {
  title: string
  goal?: string
  startDay?: number | null
  endDay?: number | null
  steps: string[]
  checkpoints: string[]
}

type RoadmapPayload = {
  title: string
  phases: RoadmapPhase[]
  metrics: string[]
  rules: string[]
  sourceType: 'markdown' | 'json'
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
  const [roadmapEnabled, setRoadmapEnabled] = useState(false)
  const [roadmapAutoSchedule, setRoadmapAutoSchedule] = useState(true)
  const [roadmapInput, setRoadmapInput] = useState('')
  const [roadmapParsed, setRoadmapParsed] = useState<RoadmapPayload | null>(null)
  const [roadmapError, setRoadmapError] = useState('')
  const [roadmapFileName, setRoadmapFileName] = useState('')
  const [roadmapSourceType, setRoadmapSourceType] = useState<'markdown' | 'json'>('markdown')
  const [stepDueDates, setStepDueDates] = useState<Record<number, string>>({})
  const [stepNameOverrides, setStepNameOverrides] = useState<Record<number, string>>({})
  const [excludedTemplateStepIds, setExcludedTemplateStepIds] = useState<number[]>([])

  const loadWorkflows = useCallback(() => {
    if (!token) return
    apiRequest<{ templates: WorkflowTemplate[]; steps: WorkflowStep[] }>('/workflows', {}, token)
      .then((data) => {
        setTemplates(data.templates)
        setSteps(data.steps)
        const preferred = data.templates.find((template) =>
          template.name.toLowerCase().includes('standard workflow'),
        )
        if (preferred) {
          setWorkflowTemplateId(preferred.id)
        } else if (data.templates[0]) {
          setWorkflowTemplateId(data.templates[0].id)
        }
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
            excludedTemplateStepIds,
            stepNameOverrides: Object.entries(stepNameOverrides).map(([templateStepId, name]) => ({
              templateStepId: Number(templateStepId),
              name: name.trim(),
            })),
            stepDueDates: selectedSteps.map((step) => ({
              templateStepId: step.id,
              dueDate: stepDueDates[step.id] || null,
            })),
          }),
        },
        token,
      )
      if (roadmapEnabled && roadmapParsed) {
        try {
          const roadmapPayload = buildRoadmapPayload(roadmapParsed, startDate, roadmapAutoSchedule)
          await apiRequest(
            '/roadmaps',
            {
              method: 'POST',
              body: JSON.stringify({
                projectId: project.id,
                title: roadmapPayload.title,
                sourceType: roadmapPayload.sourceType,
                autoSchedule: roadmapAutoSchedule,
                phases: roadmapPayload.phases.map((phase, index) => ({
                  title: phase.title,
                  goal: phase.goal || null,
                  position: index + 1,
                  startDay: phase.startDay ?? null,
                  endDay: phase.endDay ?? null,
                  steps: phase.steps.map((step, stepIndex) => ({
                    title: step.title,
                    position: stepIndex + 1,
                    dueDate: step.dueDate,
                    status: 'pending',
                  })),
                  checkpoints: phase.checkpoints.map((checkpoint, checkpointIndex) => ({
                    title: checkpoint,
                    position: checkpointIndex + 1,
                  })),
                })),
                metrics: roadmapPayload.metrics.map((metric, index) => ({
                  title: metric,
                  position: index + 1,
                })),
                rules: roadmapPayload.rules.map((rule, index) => ({
                  title: rule,
                  position: index + 1,
                })),
              }),
            },
            token,
          )
        } catch {
          // Roadmap creation is optional.
        }
      }
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

  const buildRoadmapPayload = (
    roadmap: RoadmapPayload,
    start: string,
    autoSchedule: boolean,
  ): {
    title: string
    sourceType: 'markdown' | 'json'
    phases: Array<{
      title: string
      goal?: string
      startDay?: number | null
      endDay?: number | null
      steps: Array<{ title: string; dueDate?: string | null }>
      checkpoints: string[]
    }>
    metrics: string[]
    rules: string[]
  } => {
    const startDate = start ? new Date(start) : null
    return {
      title: roadmap.title,
      sourceType: roadmap.sourceType,
      phases: roadmap.phases.map((phase) => {
        const steps = phase.steps.map((step, index) => ({ title: step, dueDate: null }))
        if (autoSchedule && startDate && phase.startDay !== null && phase.endDay !== null && steps.length > 0) {
          const span = Math.max(phase.endDay - phase.startDay, 0)
          steps.forEach((step, index) => {
            const offset = steps.length === 1 ? phase.endDay : phase.startDay + Math.round((span * index) / (steps.length - 1))
            const due = new Date(startDate.getTime() + offset * 86400000)
            step.dueDate = due.toISOString().slice(0, 10)
          })
        }
        return {
          title: phase.title,
          goal: phase.goal,
          startDay: phase.startDay,
          endDay: phase.endDay,
          steps,
          checkpoints: phase.checkpoints,
        }
      }),
      metrics: roadmap.metrics,
      rules: roadmap.rules,
    }
  }

  const handleRoadmapParse = (value: string, sourceType: 'markdown' | 'json') => {
    setRoadmapError('')
    if (!value.trim()) {
      setRoadmapParsed(null)
      return
    }
    try {
      const parsed = parseRoadmapInput(value, sourceType, 'Roadmap')
      setRoadmapParsed(parsed)
    } catch {
      setRoadmapParsed(null)
      setRoadmapError('Unable to parse roadmap input. Check the format.')
    }
  }

  const handleRoadmapFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const nextSource = extension === 'json' ? 'json' : 'markdown'
    setRoadmapSourceType(nextSource)
    setRoadmapFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result || '')
      setRoadmapInput(value)
      handleRoadmapParse(value, nextSource)
    }
    reader.readAsText(file)
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
    () =>
      steps.filter(
        (step) => step.template_id === workflowTemplateId && !excludedTemplateStepIds.includes(step.id),
      ),
    [steps, workflowTemplateId, excludedTemplateStepIds],
  )

  useEffect(() => {
    setExcludedTemplateStepIds([])
  }, [workflowTemplateId])

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

  useEffect(() => {
    setStepNameOverrides((current) => {
      const next: Record<number, string> = {}
      for (const step of selectedSteps) {
        next[step.id] = current[step.id] ?? step.name
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

  const removeTemplateStep = (stepId: number) => {
    setExcludedTemplateStepIds((current) => (current.includes(stepId) ? current : [...current, stepId]))
    setStepDueDates((current) => {
      const next = { ...current }
      delete next[stepId]
      return next
    })
    setStepCosts((current) => {
      const next = { ...current }
      delete next[stepId]
      return next
    })
    setStepNameOverrides((current) => {
      const next = { ...current }
      delete next[stepId]
      return next
    })
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
            <div className="project-form__col">
              <section className="project-form__section">
                <div className="section-heading section-heading--numbered">
                  <span className="section-number">1</span>
                  <span className="section-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="eyebrow">Essentials</p>
                    <h3>Project info</h3>
                    <p className="muted">Client, scope, dates.</p>
                  </div>
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
                        <option value="briefing">Backlog</option>
                        <option value="scheduled">Planned</option>
                        <option value="shoot">In progress</option>
                        <option value="edit">Execution</option>
                        <option value="review">In review</option>
                        <option value="delivery">Completed</option>
                        <option value="archive">Archived</option>
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
                <div className="section-heading section-heading--numbered">
                  <span className="section-number">3</span>
                  <span className="section-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 7h14M5 12h10M5 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="eyebrow">Roadmap</p>
                    <h3>Attach roadmap</h3>
                    <p className="muted">Upload .md / .json or paste.</p>
                  </div>
                </div>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={roadmapEnabled}
                    onChange={(event) => setRoadmapEnabled(event.target.checked)}
                  />
                  Enable roadmap
                </label>
                {roadmapEnabled && (
                  <div className="roadmap-input">
                    <div className="roadmap-input__actions">
                      <label
                        className="roadmap-input__drop"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault()
                          const file = event.dataTransfer.files?.[0]
                          if (file) handleRoadmapFile(file)
                        }}
                      >
                        <input
                          type="file"
                          accept=".md,.markdown,.json"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) handleRoadmapFile(file)
                          }}
                        />
                        <span>Drop file or choose</span>
                        {roadmapFileName && <em>{roadmapFileName}</em>}
                      </label>
                      <label>
                        Input format
                        <select
                          value={roadmapSourceType}
                          onChange={(event) => {
                            const next = event.target.value === 'json' ? 'json' : 'markdown'
                            setRoadmapSourceType(next)
                            handleRoadmapParse(roadmapInput, next)
                          }}
                        >
                          <option value="markdown">Markdown</option>
                          <option value="json">JSON</option>
                        </select>
                      </label>
                      <label className="toggle-row">
                        <input
                          type="checkbox"
                          checked={roadmapAutoSchedule}
                          onChange={(event) => setRoadmapAutoSchedule(event.target.checked)}
                        />
                        Auto-schedule dates
                      </label>
                    </div>
                    <label className="roadmap-input__field">
                      Paste roadmap
                      <textarea
                        rows={6}
                        value={roadmapInput}
                        onChange={(event) => {
                          const value = event.target.value
                          setRoadmapInput(value)
                          handleRoadmapParse(value, roadmapSourceType)
                        }}
                        placeholder="Paste Markdown or JSON roadmap..."
                      />
                    </label>
                    {roadmapError && <div className="form-error">{roadmapError}</div>}
                    {roadmapParsed && (
                      <div className="roadmap-preview">
                        <p className="muted">Preview</p>
                        <strong>{roadmapParsed.title}</strong>
                        <div className="roadmap-preview__grid">
                          {roadmapParsed.phases.map((phase, index) => (
                            <div key={`${phase.title}-${index}`} className="roadmap-preview__card">
                              <h4>{phase.title}</h4>
                              {phase.goal && <p className="muted">{phase.goal}</p>}
                              <p className="muted">{phase.steps.length} steps • {phase.checkpoints.length} checkpoints</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
            <div className="project-form__col">
              <section className="project-form__section">
                <div className="section-heading section-heading--numbered">
                  <span className="section-number">2</span>
                  <span className="section-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 7h10M7 12h6M7 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="eyebrow">Workflow</p>
                    <h3>Build workflow</h3>
                    <p className="muted">Create steps or assign a template.</p>
                  </div>
                </div>
                <div className="workflow-builder">
                  <div className="workflow-builder__header">
                    <div>
                      <p className="eyebrow">Builder</p>
                      <h3>Personalize steps</h3>
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
                  <p className="eyebrow">Template</p>
                  <h3>Assign a template</h3>
                  <p className="muted">Pick a proven sequence.</p>
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
                          {step.position}.
                          <input
                            className="workflow-schedule__name"
                            value={stepNameOverrides[step.id] ?? step.name}
                            onChange={(event) =>
                              setStepNameOverrides((current) => ({ ...current, [step.id]: event.target.value }))
                            }
                          />
                        </span>
                        <input
                          type="date"
                          value={stepDueDates[step.id] ?? ''}
                          onChange={(event) =>
                            setStepDueDates((current) => ({ ...current, [step.id]: event.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="ghost-link ghost-link--compact"
                          onClick={() => removeTemplateStep(step.id)}
                        >
                          Remove
                        </button>
                      </label>
                    ))}
                  </div>
                )}
                {excludedTemplateStepIds.length > 0 && (
                  <div className="workflow-schedule workflow-schedule--removed">
                    <p className="muted">Removed steps (undo to restore).</p>
                    {steps
                      .filter((step) => step.template_id === workflowTemplateId && excludedTemplateStepIds.includes(step.id))
                      .map((step) => (
                        <div key={step.id} className="workflow-schedule__row workflow-schedule__row--removed">
                          <span>
                            {step.position}. {step.name}
                          </span>
                          <button
                            type="button"
                            className="ghost-link ghost-link--compact"
                            onClick={() =>
                              setExcludedTemplateStepIds((current) => current.filter((id) => id !== step.id))
                            }
                          >
                            Undo
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          </div>
          <div className="project-form__row">
            <section className="project-form__section">
              <div className="section-heading section-heading--numbered">
                <span className="section-number">4</span>
                <span className="section-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Budget</p>
                  <h3>Budget (optional)</h3>
                  <p className="muted">Set totals, profit, VAT.</p>
                </div>
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
              <div className="section-heading section-heading--numbered">
                <span className="section-number">5</span>
                <span className="section-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 7h12M6 12h8M6 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Production</p>
                  <h3>Allocate costs</h3>
                  <p className="muted">Map costs to workflow steps.</p>
                </div>
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
