import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

function RoadmapDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [metrics, setMetrics] = useState<Array<{ title: string; position: number }>>([])
  const [rules, setRules] = useState<Array<{ title: string; position: number }>>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [importError, setImportError] = useState('')
  const [importFileName, setImportFileName] = useState('')
  const [importSourceType, setImportSourceType] = useState<'markdown' | 'json'>('markdown')

  const loadRoadmap = useCallback(() => {
    if (!token || !id) return
    apiRequest<RoadmapDetailResponse>(`/roadmaps/${id}`, {}, token)
      .then((data) => {
        setRoadmap(data.roadmap)
        setPhases(data.phases)
        setMetrics(data.metrics)
        setRules(data.rules)
        setStatus('')
      })
      .catch(() => setError('Unable to load roadmap.'))
  }, [id, token])

  useEffect(() => {
    loadRoadmap()
  }, [loadRoadmap])

  const handleSave = async () => {
    if (!token || !id || !roadmap) return
    setStatus('')
    try {
      await apiRequest(
        `/roadmaps/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
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
          }),
        },
        token,
      )
      setStatus('Saved.')
      loadRoadmap()
    } catch {
      setStatus('Unable to save changes.')
    }
  }

  const handleDelete = async () => {
    if (!token || !id) return
    const confirmed = window.confirm('Delete this roadmap? This cannot be undone.')
    if (!confirmed) return
    await apiRequest(`/roadmaps/${id}`, { method: 'DELETE' }, token)
    window.location.href = '/roadmaps'
  }

  const parseMarkdownRoadmap = (value: string) => {
    const lines = value.split(/\r?\n/)
    let title = roadmap?.title || 'Roadmap'
    const nextPhases: RoadmapPhase[] = []
    const nextMetrics: string[] = []
    const nextRules: string[] = []
    let currentPhase: RoadmapPhase | null = null
    let section: 'steps' | 'checkpoints' | 'metrics' | 'rules' | null = null

    const addPhase = (phaseTitle: string, startDay?: number | null, endDay?: number | null) => {
      currentPhase = {
        title: phaseTitle || `Phase ${nextPhases.length + 1}`,
        goal: '',
        position: nextPhases.length + 1,
        start_day: startDay ?? null,
        end_day: endDay ?? null,
        steps: [],
        checkpoints: [],
      }
      nextPhases.push(currentPhase)
      section = 'steps'
    }

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line) continue
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '').trim()
        continue
      }
      if (line.startsWith('## ')) {
        const heading = line.replace(/^##\s+/, '').trim()
        const lower = heading.toLowerCase()
        if (lower.includes('phase')) {
          const rangeMatch = heading.match(/days?\s*(\d+)\s*[–-]\s*(\d+)/i)
          const startDay = rangeMatch ? Number(rangeMatch[1]) : null
          const endDay = rangeMatch ? Number(rangeMatch[2]) : null
          const cleanTitle = heading
            .replace(/phase\s*\d*\s*[—-]\s*/i, '')
            .replace(/\(.*\)/, '')
            .trim()
          addPhase(cleanTitle || heading, startDay, endDay)
        } else if (lower.includes('metric')) {
          section = 'metrics'
          currentPhase = null
        } else if (lower.includes('rule')) {
          section = 'rules'
          currentPhase = null
        } else {
          section = null
          currentPhase = null
        }
        continue
      }
      if (line.startsWith('**Goal:**')) {
        if (currentPhase) currentPhase.goal = line.replace('**Goal:**', '').trim()
        continue
      }
      if (line.toLowerCase().startsWith('checkpoint')) {
        section = 'checkpoints'
        continue
      }
      if (line.startsWith('---')) {
        continue
      }

      const bulletMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/)
      const text = bulletMatch ? bulletMatch[1].trim() : line

      if (section === 'metrics') {
        nextMetrics.push(text)
        continue
      }
      if (section === 'rules') {
        nextRules.push(text)
        continue
      }
      if (currentPhase) {
        if (section === 'checkpoints') {
          currentPhase.checkpoints.push({ title: text, position: currentPhase.checkpoints.length + 1 })
        } else {
          currentPhase.steps.push({ title: text, position: currentPhase.steps.length + 1, status: 'pending' })
        }
      }
    }

    return { title, phases: nextPhases, metrics: nextMetrics, rules: nextRules }
  }

  const parseJsonRoadmap = (value: string) => {
    const parsed = JSON.parse(value) as Partial<{
      title: string
      phases: RoadmapPhase[]
      metrics: string[] | Array<{ title: string }>
      rules: string[] | Array<{ title: string }>
    }>
    const normalizedPhases =
      parsed.phases?.map((phase, index) => ({
        ...phase,
        title: phase.title || `Phase ${index + 1}`,
        goal: phase.goal ?? '',
        start_day: phase.start_day ?? null,
        end_day: phase.end_day ?? null,
        steps: (phase.steps ?? []).map((step, stepIndex) => {
          if (typeof step === 'string') {
            return { title: step, position: stepIndex + 1, status: 'pending' }
          }
          return {
            ...step,
            title: step.title || `Step ${stepIndex + 1}`,
            position: step.position ?? stepIndex + 1,
            status: step.status ?? 'pending',
          }
        }),
        checkpoints: (phase.checkpoints ?? []).map((checkpoint, checkpointIndex) => {
          if (typeof checkpoint === 'string') {
            return { title: checkpoint, position: checkpointIndex + 1 }
          }
          return {
            ...checkpoint,
            title: checkpoint.title || `Checkpoint ${checkpointIndex + 1}`,
            position: checkpoint.position ?? checkpointIndex + 1,
          }
        }),
      })) ?? []
    return {
      title: parsed.title || roadmap?.title || 'Roadmap',
      phases: normalizedPhases,
      metrics: Array.isArray(parsed.metrics)
        ? parsed.metrics.map((item) => (typeof item === 'string' ? item : item.title))
        : [],
      rules: Array.isArray(parsed.rules)
        ? parsed.rules.map((item) => (typeof item === 'string' ? item : item.title))
        : [],
    }
  }

  const applyImportedRoadmap = (value: string, sourceType: 'markdown' | 'json') => {
    setImportError('')
    try {
      const parsed = sourceType === 'json' ? parseJsonRoadmap(value) : parseMarkdownRoadmap(value)
      if (roadmap) {
        setRoadmap({ ...roadmap, title: parsed.title })
      }
      setPhases(
        parsed.phases.map((phase, index) => ({
          ...phase,
          position: index + 1,
          steps: phase.steps?.map((step, stepIndex) => ({ ...step, position: stepIndex + 1 })) ?? [],
          checkpoints:
            phase.checkpoints?.map((checkpoint, checkpointIndex) => ({
              ...checkpoint,
              position: checkpointIndex + 1,
            })) ?? [],
        })),
      )
      setMetrics(parsed.metrics.map((title, index) => ({ title, position: index + 1 })))
      setRules(parsed.rules.map((title, index) => ({ title, position: index + 1 })))
      return parsed
    } catch {
      setImportError('Unable to parse roadmap file.')
      return null
    }
  }

  const handleImportFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const nextSource = extension === 'json' ? 'json' : 'markdown'
    setImportSourceType(nextSource)
    setImportFileName(file.name)
    const reader = new FileReader()
    reader.onload = async () => {
      const value = String(reader.result || '')
      const parsed = applyImportedRoadmap(value, nextSource)
      if (parsed && token && id) {
        await apiRequest(
          `/roadmaps/${id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              title: parsed.title || roadmap?.title,
              autoSchedule: roadmap?.auto_schedule ?? false,
              phases: parsed.phases.map((phase, index) => ({
                title: phase.title,
                goal: phase.goal || null,
                position: index + 1,
                startDay: phase.start_day ?? null,
                endDay: phase.end_day ?? null,
                steps: (phase.steps ?? []).map((step, stepIndex) => ({
                  title: step.title,
                  position: stepIndex + 1,
                  dueDate: step.due_date ?? null,
                  status: step.status ?? 'pending',
                  notes: step.notes ?? null,
                })),
                checkpoints: (phase.checkpoints ?? []).map((checkpoint, checkpointIndex) => ({
                  title: checkpoint.title,
                  position: checkpointIndex + 1,
                })),
              })),
              metrics: parsed.metrics.map((title, index) => ({
                title,
                position: index + 1,
              })),
              rules: parsed.rules.map((title, index) => ({
                title,
                position: index + 1,
              })),
            }),
          },
          token,
        )
        setStatus('Imported and saved.')
      }
    }
    reader.readAsText(file)
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
          <div>
            <p className="eyebrow">Roadmap</p>
            <h2>{roadmap.title}</h2>
            <p className="muted">Organize phases, steps, and checkpoints in one roadmap.</p>
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
            <button type="button" onClick={handleSave}>
              Save changes
            </button>
            {status && <span className="muted">{status}</span>}
          </div>
        </header>

        <div className="roadmap-import">
          <label
            className="roadmap-import__drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const file = event.dataTransfer.files?.[0]
              if (file) handleImportFile(file)
            }}
          >
            <input
              type="file"
              accept=".md,.markdown,.json"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) handleImportFile(file)
              }}
            />
            <span>Drop a Markdown/JSON file to replace this roadmap</span>
            {importFileName && <em>{importFileName}</em>}
          </label>
          <label>
            Import type
            <select
              value={importSourceType}
              onChange={(event) => setImportSourceType(event.target.value === 'json' ? 'json' : 'markdown')}
            >
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </label>
          {importError && <p className="muted">{importError}</p>}
        </div>

        <div className="roadmap-phase-grid">
          {phases.map((phase, index) => (
            <section key={`${phase.title}-${index}`} className="roadmap-phase">
              <div className="roadmap-phase__header">
                <input
                  value={phase.title}
                  onChange={(event) => updatePhase(index, { title: event.target.value })}
                  className="roadmap-phase__title"
                />
                <button type="button" className="ghost-link" onClick={() => removePhase(index)}>
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
                  <button type="button" className="ghost-link" onClick={() => addStep(index)}>
                    Add step
                  </button>
                </div>
                {phase.steps.map((step, stepIndex) => (
                  <div key={`${step.title}-${stepIndex}`} className={`roadmap-step roadmap-step--${getStepTone(step.due_date, step.status)}`}>
                    <input
                      value={step.title}
                      onChange={(event) => updateStep(index, stepIndex, { title: event.target.value })}
                    />
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
                    <button type="button" onClick={() => removeStep(index, stepIndex)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="roadmap-phase__checkpoints">
                <div className="roadmap-phase__section-header">
                  <h4>Checkpoints</h4>
                  <button type="button" className="ghost-link" onClick={() => addCheckpoint(index)}>
                    Add checkpoint
                  </button>
                </div>
                {phase.checkpoints.map((checkpoint, checkpointIndex) => (
                  <div key={`${checkpoint.title}-${checkpointIndex}`} className="roadmap-checkpoint">
                    <input
                      value={checkpoint.title}
                      onChange={(event) => updateCheckpoint(index, checkpointIndex, event.target.value)}
                    />
                    <button type="button" onClick={() => removeCheckpoint(index, checkpointIndex)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
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
