import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import './Roadmap.css'

type Roadmap = {
  id: number
  project_id: number
  title: string
  auto_schedule: boolean
  source_type: string
}

type RoadmapPhase = {
  id?: number
  title: string
  goal?: string | null
  position: number
  start_day?: number | null
  end_day?: number | null
  steps: RoadmapStep[]
  checkpoints: RoadmapCheckpoint[]
}

type RoadmapStep = {
  id?: number
  title: string
  position: number
  due_date?: string | null
  status?: string
  notes?: string | null
}

type RoadmapCheckpoint = {
  id?: number
  title: string
  position: number
}

type RoadmapDetailResponse = {
  roadmap: Roadmap
  phases: RoadmapPhase[]
  metrics: Array<{ id?: number; title: string; position: number }>
  rules: Array<{ id?: number; title: string; position: number }>
}

const today = new Date()
today.setHours(0, 0, 0, 0)

const isOverdueStep = (dueDate?: string | null, status?: string) => {
  if (!dueDate || status === 'done') return false
  const date = new Date(dueDate)
  date.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

const getStepTone = (dueDate?: string | null, status?: string) => {
  if (status === 'done') return 'done'
  if (!dueDate) return 'neutral'
  const date = new Date(dueDate)
  date.setHours(0, 0, 0, 0)
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'danger'
  if (diff <= 5) return 'warning'
  return 'ok'
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const MIN_PHASE_WIDTH = 340
const MAX_PHASE_WIDTH = 920
const DEFAULT_PHASE_WIDTH = 420
const CHECKPOINT_DONE_PREFIX = '[x] '
const stripCheckpointDonePrefix = (value: string) => value.replace(/^\[x\]\s*/i, '')
const isCheckpointMarkedDone = (value: string) => /^\[x\]\s*/i.test(value)
const withCheckpointDonePrefix = (value: string, done: boolean) => {
  const clean = stripCheckpointDonePrefix(value).trim()
  return done ? `${CHECKPOINT_DONE_PREFIX}${clean}` : clean
}
const isCheckpointRelatedToDoneStep = (phase: RoadmapPhase, checkpointTitle: string) => {
  const checkpoint = stripCheckpointDonePrefix(checkpointTitle).trim().toLowerCase()
  if (!checkpoint) return false
  return phase.steps.some((step) => {
    if (step.status !== 'done') return false
    const title = (step.title || '').trim().toLowerCase()
    return title.includes(checkpoint) || checkpoint.includes(title)
  })
}

const getStepDeadlineMeta = (dueDate?: string | null, status?: string) => {
  if (status === 'done') {
    return { label: 'Done', progress: 1, color: '#6fe6b5', daysLeft: null }
  }
  if (!dueDate) {
    return { label: 'No due', progress: 0.2, color: 'rgba(255,255,255,0.35)', daysLeft: null }
  }
  const date = new Date(dueDate)
  date.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((date.getTime() - today.getTime()) / 86400000)
  const progress = clamp(1 - daysLeft / 14, 0.2, 1)
  if (daysLeft < 0) return { label: `${Math.abs(daysLeft)}d late`, progress: 1, color: '#ff5f5f', daysLeft }
  if (daysLeft <= 2) return { label: `${daysLeft}d left`, progress, color: '#ff7a47', daysLeft }
  if (daysLeft <= 5) return { label: `${daysLeft}d left`, progress, color: '#ffb84a', daysLeft }
  if (daysLeft <= 10) return { label: `${daysLeft}d left`, progress, color: '#7ef0ff', daysLeft }
  return { label: `${daysLeft}d left`, progress, color: '#6f8dff', daysLeft }
}

const buildRoadmapPayload = (
  roadmap: Roadmap,
  phases: RoadmapPhase[],
  metrics: Array<{ title: string; position: number }>,
  rules: Array<{ title: string; position: number }>,
) => ({
  title: roadmap.title,
  autoSchedule: roadmap.auto_schedule,
  phases: phases.map((phase, index) => ({
    title: phase.title,
    goal: phase.goal || null,
    position: index + 1,
    startDay: phase.start_day ?? null,
    endDay: phase.end_day ?? null,
    steps: phase.steps.map((step, stepIndex) => ({
      title: step.title,
      position: stepIndex + 1,
      dueDate: step.due_date ?? null,
      status: step.status ?? 'pending',
      notes: step.notes ?? null,
    })),
    checkpoints: phase.checkpoints.map((checkpoint, checkpointIndex) => ({
      title: checkpoint.title,
      position: checkpointIndex + 1,
    })),
  })),
  metrics: metrics.map((metric, index) => ({ title: metric.title, position: index + 1 })),
  rules: rules.map((rule, index) => ({ title: rule.title, position: index + 1 })),
})

function RoadmapDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [metrics, setMetrics] = useState<Array<{ title: string; position: number }>>([])
  const [rules, setRules] = useState<Array<{ title: string; position: number }>>([])
  const [status, setStatus] = useState('')
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [error, setError] = useState('')
  const [phaseWidths, setPhaseWidths] = useState<number[]>([])
  const lastSavedSignatureRef = useRef('')
  const autoSaveTimerRef = useRef<number | null>(null)

  const loadRoadmap = useCallback(() => {
    if (!token || !id) return
    apiRequest<RoadmapDetailResponse>(`/roadmaps/${id}`, {}, token)
      .then((data) => {
        setRoadmap(data.roadmap)
        setPhases(data.phases)
        setMetrics(data.metrics)
        setRules(data.rules)
        setStatus('')
        lastSavedSignatureRef.current = JSON.stringify(
          buildRoadmapPayload(data.roadmap, data.phases, data.metrics, data.rules),
        )
      })
      .catch(() => setError('Unable to load roadmap.'))
  }, [id, token])

  useEffect(() => {
    loadRoadmap()
  }, [loadRoadmap])

  useEffect(() => {
    setPhaseWidths((current) =>
      phases.map((_, index) => {
        const existing = current[index]
        return typeof existing === 'number' ? existing : DEFAULT_PHASE_WIDTH
      }),
    )
  }, [phases.length])

  const handlePhaseResizeStart = (phaseIndex: number, event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = phaseWidths[phaseIndex] ?? DEFAULT_PHASE_WIDTH
    const body = document.body
    body.classList.add('roadmap-resizing')

    const handleMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX
      const nextWidth = clamp(startWidth + delta, MIN_PHASE_WIDTH, MAX_PHASE_WIDTH)
      setPhaseWidths((current) => {
        const next = [...current]
        next[phaseIndex] = nextWidth
        return next
      })
    }

    const handleUp = () => {
      body.classList.remove('roadmap-resizing')
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
      window.removeEventListener('blur', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    window.addEventListener('blur', handleUp)
  }

  const handleSave = async () => {
    if (!token || !id || !roadmap) return
    setStatus('')
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    const payload = buildRoadmapPayload(roadmap, phases, metrics, rules)
    try {
      await apiRequest(
        `/roadmaps/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        },
        token,
      )
      lastSavedSignatureRef.current = JSON.stringify(payload)
      setStatus('Saved.')
    } catch {
      setStatus('Unable to save changes.')
    }
  }

  useEffect(() => {
    if (!token || !id || !roadmap) return
    const payload = buildRoadmapPayload(roadmap, phases, metrics, rules)
    const signature = JSON.stringify(payload)
    if (signature === lastSavedSignatureRef.current) return

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = window.setTimeout(async () => {
      setIsAutoSaving(true)
      try {
        await apiRequest(
          `/roadmaps/${id}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          },
          token,
        )
        lastSavedSignatureRef.current = signature
        setStatus('Auto-saved.')
      } catch {
        setStatus('Auto-save failed.')
      } finally {
        setIsAutoSaving(false)
      }
    }, 700)

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [id, metrics, phases, roadmap, rules, token])

  const handleDelete = async () => {
    if (!token || !id) return
    const confirmed = window.confirm('Delete this roadmap? This cannot be undone.')
    if (!confirmed) return
    await apiRequest(`/roadmaps/${id}`, { method: 'DELETE' }, token)
    window.location.href = '/roadmaps'
  }

  const addPhase = () => {
    setPhases((prev) => [
      ...prev,
      {
        title: `Phase ${prev.length + 1}`,
        goal: '',
        position: prev.length + 1,
        start_day: null,
        end_day: null,
        steps: [],
        checkpoints: [],
      },
    ])
  }

  const updatePhase = (index: number, patch: Partial<RoadmapPhase>) => {
    setPhases((prev) => prev.map((phase, idx) => (idx === index ? { ...phase, ...patch } : phase)))
  }

  const removePhase = (index: number) => {
    setPhases((prev) => prev.filter((_, idx) => idx !== index))
  }

  const addStep = (phaseIndex: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? {
              ...phase,
              steps: [
                ...phase.steps,
                { title: 'New step', position: phase.steps.length + 1, due_date: null, status: 'pending' },
              ],
            }
          : phase,
      ),
    )
  }

  const updateStep = (phaseIndex: number, stepIndex: number, patch: Partial<RoadmapStep>) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? {
              ...phase,
              steps: phase.steps.map((step, sIdx) => (sIdx === stepIndex ? { ...step, ...patch } : step)),
            }
          : phase,
      ),
    )
  }

  const removeStep = (phaseIndex: number, stepIndex: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? { ...phase, steps: phase.steps.filter((_, sIdx) => sIdx !== stepIndex) }
          : phase,
      ),
    )
  }

  const addCheckpoint = (phaseIndex: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? {
              ...phase,
              checkpoints: [
                ...phase.checkpoints,
                { title: 'New checkpoint', position: phase.checkpoints.length + 1 },
              ],
            }
          : phase,
      ),
    )
  }

  const updateCheckpoint = (phaseIndex: number, checkpointIndex: number, value: string) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? {
              ...phase,
              checkpoints: phase.checkpoints.map((checkpoint, cIdx) =>
                cIdx === checkpointIndex ? { ...checkpoint, title: value } : checkpoint,
              ),
            }
          : phase,
      ),
    )
  }

  const removeCheckpoint = (phaseIndex: number, checkpointIndex: number) => {
    setPhases((prev) =>
      prev.map((phase, idx) =>
        idx === phaseIndex
          ? { ...phase, checkpoints: phase.checkpoints.filter((_, cIdx) => cIdx !== checkpointIndex) }
          : phase,
      ),
    )
  }

  const metricInput = useMemo(() => metrics.map((item) => item.title).join('\n'), [metrics])
  const ruleInput = useMemo(() => rules.map((item) => item.title).join('\n'), [rules])
  const roadmapSnapshot = useMemo(() => {
    if (!roadmap) return null
    const stepRecords = phases.flatMap((phase) =>
      phase.steps.map((step) => ({
        phase: phase.title,
        title: step.title,
        dueDate: step.due_date ?? null,
        status: step.status ?? 'pending',
        notes: step.notes ?? null,
        overdue: isOverdueStep(step.due_date, step.status),
      })),
    )
    const completed = stepRecords.filter((step) => step.status === 'done').length
    const overdue = stepRecords.filter((step) => step.overdue).length
    return {
      generatedAt: new Date().toISOString(),
      roadmapId: roadmap.id,
      roadmapTitle: roadmap.title,
      projectId: roadmap.project_id,
      totals: {
        phases: phases.length,
        steps: stepRecords.length,
        completed,
        pending: stepRecords.length - completed,
        overdue,
      },
      phases: phases.map((phase) => ({
        title: phase.title,
        goal: phase.goal ?? '',
        startDay: phase.start_day ?? null,
        endDay: phase.end_day ?? null,
        steps: phase.steps.map((step) => ({
          title: step.title,
          status: step.status ?? 'pending',
          dueDate: step.due_date ?? null,
          overdue: isOverdueStep(step.due_date, step.status),
          notes: step.notes ?? null,
        })),
        checkpoints: phase.checkpoints.map((checkpoint) => checkpoint.title),
      })),
      metrics: metrics.map((metric) => metric.title),
      rules: rules.map((rule) => rule.title),
    }
  }, [metrics, phases, roadmap, rules])

  const downloadTextFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    if (!roadmapSnapshot) return
    const safeName = roadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'roadmap'
    downloadTextFile(
      `${safeName}-status.json`,
      JSON.stringify(roadmapSnapshot, null, 2),
      'application/json;charset=utf-8',
    )
  }

  const handleExportMarkdown = () => {
    if (!roadmapSnapshot) return
    const lines: string[] = []
    lines.push(`# ${roadmapSnapshot.roadmapTitle} — Status Export`)
    lines.push('')
    lines.push(`Generated: ${new Date(roadmapSnapshot.generatedAt).toLocaleString()}`)
    lines.push('')
    lines.push('## Summary')
    lines.push(`- Phases: ${roadmapSnapshot.totals.phases}`)
    lines.push(`- Steps: ${roadmapSnapshot.totals.steps}`)
    lines.push(`- Completed: ${roadmapSnapshot.totals.completed}`)
    lines.push(`- Pending: ${roadmapSnapshot.totals.pending}`)
    lines.push(`- Overdue: ${roadmapSnapshot.totals.overdue}`)
    lines.push('')
    lines.push('## Phases')
    roadmapSnapshot.phases.forEach((phase, phaseIndex) => {
      lines.push(`### ${phaseIndex + 1}. ${phase.title}`)
      if (phase.goal) lines.push(`Goal: ${phase.goal}`)
      lines.push(`Range: ${phase.startDay ?? '-'} to ${phase.endDay ?? '-'}`)
      lines.push('')
      lines.push('Steps:')
      phase.steps.forEach((step, stepIndex) => {
        const dueLabel = step.dueDate ?? 'No due date'
        const flags = [
          step.status === 'done' ? 'complete' : 'open',
          step.overdue ? 'overdue' : null,
        ]
          .filter(Boolean)
          .join(', ')
        lines.push(`- ${stepIndex + 1}. ${step.title} — ${dueLabel} (${flags})`)
        if (step.notes) lines.push(`  - Notes: ${step.notes}`)
      })
      if (phase.checkpoints.length > 0) {
        lines.push('')
        lines.push('Checkpoints:')
        phase.checkpoints.forEach((checkpoint) => lines.push(`- ${checkpoint}`))
      }
      lines.push('')
    })
    if (roadmapSnapshot.metrics.length > 0) {
      lines.push('## Metrics')
      roadmapSnapshot.metrics.forEach((metric) => lines.push(`- ${metric}`))
      lines.push('')
    }
    if (roadmapSnapshot.rules.length > 0) {
      lines.push('## Rules')
      roadmapSnapshot.rules.forEach((rule) => lines.push(`- ${rule}`))
      lines.push('')
    }
    const safeName = roadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'roadmap'
    downloadTextFile(`${safeName}-status.md`, `${lines.join('\n').trim()}\n`, 'text/markdown;charset=utf-8')
  }

  if (!roadmap) {
    return (
      <Layout title="Roadmap">
        {error && <div className="form-error">{error}</div>}
      </Layout>
    )
  }

  return (
    <Layout
      title={roadmap.title}
      headerActions={
        <div className="roadmap-actions">
          <Link to={`/projects/${roadmap.project_id}`} className="button button--ghost">
            Back to project
          </Link>
          <button type="button" className="button button--ghost" onClick={handleDelete}>
            Delete roadmap
          </button>
        </div>
      }
    >
      <div className="roadmap-detail">
        <header className="roadmap-detail__header">
          <div className="roadmap-headline">
            <p className="eyebrow roadmap-headline__eyebrow">Roadmap</p>
            <label className="roadmap-headline__title-input">
              <span className="muted">Name</span>
              <input
                value={roadmap.title}
                onChange={(event) => setRoadmap((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                placeholder="Roadmap title"
              />
            </label>
            <p className="muted roadmap-headline__subtitle">
              Organize phases, steps, and checkpoints in one roadmap.
            </p>
          </div>
          <div className="roadmap-detail__meta">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={roadmap.auto_schedule}
                onChange={(event) => setRoadmap((prev) => (prev ? { ...prev, auto_schedule: event.target.checked } : prev))}
              />
              Auto-schedule dates
            </label>
            <button type="button" className="roadmap-btn roadmap-btn--primary" onClick={handleSave}>
              Save changes
            </button>
            <div className="roadmap-export-actions">
              <button type="button" className="roadmap-btn roadmap-btn--subtle" onClick={handleExportMarkdown}>
                Export MD
              </button>
              <button type="button" className="roadmap-btn roadmap-btn--subtle" onClick={handleExportJson}>
                Export JSON
              </button>
            </div>
            {isAutoSaving && <span className="muted">Saving...</span>}
            {status && <span className="muted">{status}</span>}
          </div>
        </header>

        <div className="roadmap-phase-grid">
          {phases.map((phase, index) => (
            <div key={`${phase.title}-${index}`} className="roadmap-phase-wrap">
              <section
                className="roadmap-phase"
                style={{ width: `${phaseWidths[index] ?? DEFAULT_PHASE_WIDTH}px` }}
              >
                <div className="roadmap-phase__header">
                  <input
                    value={phase.title}
                    onChange={(event) => updatePhase(index, { title: event.target.value })}
                    className="roadmap-phase__title"
                  />
                  <button type="button" className="ghost-link roadmap-btn roadmap-btn--danger" onClick={() => removePhase(index)}>
                    Remove
                  </button>
                </div>
                <div className="roadmap-phase__meta">
                  <label>
                    Goal
                    <input
                      value={phase.goal ?? ''}
                      onChange={(event) => updatePhase(index, { goal: event.target.value })}
                    />
                  </label>
                  <div className="roadmap-phase__days">
                    <label>
                      Start day
                      <input
                        type="number"
                        value={phase.start_day ?? ''}
                        onChange={(event) => updatePhase(index, { start_day: Number(event.target.value) })}
                      />
                    </label>
                    <label>
                      End day
                      <input
                        type="number"
                        value={phase.end_day ?? ''}
                        onChange={(event) => updatePhase(index, { end_day: Number(event.target.value) })}
                      />
                    </label>
                  </div>
                </div>
                <div className="roadmap-phase__steps">
                  <div className="roadmap-phase__section-header">
                    <h4>Steps</h4>
                    <button type="button" className="ghost-link roadmap-btn roadmap-btn--subtle" onClick={() => addStep(index)}>
                      Add step
                    </button>
                  </div>
                  {phase.steps.map((step, stepIndex) => {
                    const deadline = getStepDeadlineMeta(step.due_date, step.status)
                    return (
                      <motion.div
                        key={`${step.title}-${stepIndex}`}
                        className={`roadmap-step roadmap-step--${getStepTone(step.due_date, step.status)}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <button
                          type="button"
                          className={`roadmap-step__toggle${step.status === 'done' ? ' is-done' : ''}`}
                          onClick={() =>
                            updateStep(index, stepIndex, {
                              status: step.status === 'done' ? 'pending' : 'done',
                            })
                          }
                          title={step.status === 'done' ? 'Mark as pending' : 'Mark as done'}
                        >
                          {step.status === 'done' ? '✓' : '○'}
                        </button>
                        <div className="roadmap-step__content">
                          <input
                            value={step.title}
                            onChange={(event) => updateStep(index, stepIndex, { title: event.target.value })}
                          />
                          <div className="roadmap-step__controls">
                            <input
                              type="date"
                              value={step.due_date ?? ''}
                              onChange={(event) => updateStep(index, stepIndex, { due_date: event.target.value })}
                            />
                            <select
                              value={step.status ?? 'pending'}
                              onChange={(event) => updateStep(index, stepIndex, { status: event.target.value })}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In progress</option>
                              <option value="done">Done</option>
                            </select>
                            <button
                              type="button"
                              className="roadmap-btn roadmap-btn--danger roadmap-btn--tiny"
                              onClick={() => removeStep(index, stepIndex)}
                            >
                              Delete
                            </button>
                          </div>
                          <textarea
                            value={step.notes ?? ''}
                            onChange={(event) => updateStep(index, stepIndex, { notes: event.target.value })}
                            placeholder="Add notes for this step..."
                            rows={2}
                          />
                        </div>
                        <div
                          className="roadmap-step__ring"
                          style={{ '--ring-color': deadline.color, '--ring-progress': deadline.progress } as CSSProperties}
                          title={deadline.label}
                        >
                          <span>{deadline.label}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="roadmap-phase__checkpoints">
                  <div className="roadmap-phase__section-header">
                    <h4>Checkpoints</h4>
                    <button type="button" className="ghost-link roadmap-btn roadmap-btn--subtle" onClick={() => addCheckpoint(index)}>
                      Add checkpoint
                    </button>
                  </div>
                {phase.checkpoints.map((checkpoint, checkpointIndex) => (
                  <div key={`${checkpoint.title}-${checkpointIndex}`} className="roadmap-checkpoint">
                    {(() => {
                      const markedDone = isCheckpointMarkedDone(checkpoint.title)
                      const relatedDone = isCheckpointRelatedToDoneStep(phase, checkpoint.title)
                      const isDone = markedDone || relatedDone
                      return (
                        <>
                    <input
                      value={stripCheckpointDonePrefix(checkpoint.title)}
                      onChange={(event) =>
                        updateCheckpoint(
                          index,
                          checkpointIndex,
                          withCheckpointDonePrefix(event.target.value, markedDone),
                        )
                      }
                    />
                    <button
                      type="button"
                      className={`roadmap-btn roadmap-btn--tiny ${isDone ? 'roadmap-btn--done' : 'roadmap-btn--subtle'}`}
                      onClick={() =>
                        updateCheckpoint(
                          index,
                          checkpointIndex,
                          withCheckpointDonePrefix(checkpoint.title, !markedDone),
                        )
                      }
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      className="roadmap-btn roadmap-btn--danger roadmap-btn--tiny"
                      onClick={() => removeCheckpoint(index, checkpointIndex)}
                    >
                      Remove
                    </button>
                        </>
                      )
                    })()}
                  </div>
                ))}
              </div>
              </section>
              <button
                type="button"
                className="roadmap-phase-resizer"
                onPointerDown={(event) => handlePhaseResizeStart(index, event)}
                title="Drag to resize this card"
                aria-label={`Resize ${phase.title}`}
              />
            </div>
          ))}
          <button type="button" className="roadmap-add" onClick={addPhase}>
            + Add phase
          </button>
        </div>

        <div className="roadmap-lists">
          <section className="roadmap-list">
            <h3>Metrics to watch</h3>
            <textarea
              value={metricInput}
              onChange={(event) =>
                setMetrics(
                  event.target.value
                    .split('\n')
                    .map((value) => value.trim())
                    .filter((value) => value.length > 0)
                    .map((title, index) => ({ title, position: index + 1 })),
                )
              }
              placeholder="One metric per line"
            />
          </section>
          <section className="roadmap-list">
            <h3>Rules</h3>
            <textarea
              value={ruleInput}
              onChange={(event) =>
                setRules(
                  event.target.value
                    .split('\n')
                    .map((value) => value.trim())
                    .filter((value) => value.length > 0)
                    .map((title, index) => ({ title, position: index + 1 })),
                )
              }
              placeholder="One rule per line"
            />
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default RoadmapDetail
