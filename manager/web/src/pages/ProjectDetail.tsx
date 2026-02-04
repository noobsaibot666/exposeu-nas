import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest, apiUpload } from '../components/api'
import { useAuth } from '../components/useAuth'
import { parseRoadmapInput, type ImportedRoadmap } from '../utils/roadmapParser'
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
  project_color: string | null
  status: string | null
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  notes: string | null
  workflow_template_id?: number | null
  tags?: string[]
  review?: Review | null
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

type Review = {
  delivered_on_time: boolean | null
  flow_issues: string | null
  review_notes: string | null
  learnings: string | null
  created_at: string
  updated_at: string
}

type Budget = {
  id: number
  project_id: number | null
  project_title: string | null
  total_budget: string
  production_budget: string
  profit_budget: string
  profit_percent: string | null
  vat_amount: string | null
  vat_percent: string | null
  notes: string | null
  archived: boolean
  created_at: string
  updated_at: string
}

type BudgetStep = {
  id: number
  project_step_id: number | null
  step_name: string
  step_position: number | null
  cost_amount: string | null
  vendor_name: string | null
  vendor_cost: string | null
}

type ReviewDraft = {
  deliveredOnTime: boolean | null
  flowIssues: string
  reviewNotes: string
  learnings: string
}

type Step = {
  id: number
  name: string
  position: number
  status: string
  due_date: string | null
  offset_days?: number | string | null
}

type WorkflowTemplate = {
  id: number
  name: string
  description?: string | null
  tags?: string[]
}

type WorkflowStep = {
  id: number
  template_id: number
  name: string
  position: number
  default_offset_days?: number | null
  default_cost?: number | null
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

const isUrgentTag = (tag: string) => tag.trim().toLowerCase() === 'urgent'
const hasUrgentTag = (tags?: string[]) => (tags ?? []).some(isUrgentTag)
const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

const toNumber = (value: string | null) => {
  if (!value) return 0
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)

const formatOffset = (value?: number | string | null) => {
  if (value === null || value === undefined) return ''
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return ''
  return `${numeric % 1 === 0 ? numeric.toFixed(0) : numeric}d`
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [budgetSteps, setBudgetSteps] = useState<BudgetStep[]>([])
  const [archivedBudget, setArchivedBudget] = useState<Budget | null>(null)
  const [stepDrafts, setStepDrafts] = useState<Record<number, { name: string; dueDate: string }>>({})
  const [shareToken, setShareToken] = useState('')
  const [status, setStatus] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [planTier, setPlanTier] = useState('')
  const [projectColor, setProjectColor] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notesDraft, setNotesDraft] = useState('')
  const [tagsDraft, setTagsDraft] = useState('')
  const [newStepName, setNewStepName] = useState('')
  const [newStepDue, setNewStepDue] = useState('')
  const [deliveryTitle, setDeliveryTitle] = useState('')
  const [deliveryUrl, setDeliveryUrl] = useState('')
  const [minutes, setMinutes] = useState('')
  const [logNote, setLogNote] = useState('')
  const [budgetTotal, setBudgetTotal] = useState('')
  const [budgetProduction, setBudgetProduction] = useState('')
  const [budgetProfitPercent, setBudgetProfitPercent] = useState('')
  const [budgetProfit, setBudgetProfit] = useState('')
  const [budgetVatPercent, setBudgetVatPercent] = useState('')
  const [budgetVat, setBudgetVat] = useState('')
  const [budgetNotes, setBudgetNotes] = useState('')
  const [budgetStepCosts, setBudgetStepCosts] = useState<Record<number, string>>({})
  const [budgetStatus, setBudgetStatus] = useState('')
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft>({
    deliveredOnTime: null,
    flowIssues: '',
    reviewNotes: '',
    learnings: '',
  })
  const [reviewStatus, setReviewStatus] = useState('')
  const [error, setError] = useState('')
  const [projectSaveStatus, setProjectSaveStatus] = useState('')
  const [stepSaveStatus, setStepSaveStatus] = useState('')
  const [roadmapId, setRoadmapId] = useState<number | null>(null)
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([])
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [replaceTemplateId, setReplaceTemplateId] = useState<number | ''>('')
  const [workflowLoading, setWorkflowLoading] = useState(false)
  const [workflowError, setWorkflowError] = useState('')
  const [replaceStatus, setReplaceStatus] = useState('')
  const [roadmapMessage, setRoadmapMessage] = useState('')
  const [roadmapImportType, setRoadmapImportType] = useState<'markdown' | 'json'>('markdown')
  const [roadmapImportName, setRoadmapImportName] = useState('')
  const [roadmapImportText, setRoadmapImportText] = useState('')

  const loadProject = useCallback(() => {
    if (!token || !id) return
    apiRequest<{
      project: Project
      steps: Step[]
      files: FileItem[]
      deliveries: Delivery[]
      timeLogs: TimeLog[]
      budget: Budget | null
      budgetSteps: BudgetStep[]
    }>(
      `/projects/${id}`,
      {},
      token,
    )
      .then((data) => {
        setProject(data.project)
        setStatus(data.project.status ?? '')
        setClientName(data.project.client_name ?? '')
        setClientEmail(data.project.client_email ?? '')
        setClientPhone(data.project.client_phone ?? '')
        setServiceType(data.project.service_type ?? '')
        setPlanTier(data.project.plan_tier ?? '')
        setProjectColor(data.project.project_color ?? '')
        setStartDate(data.project.start_date ?? '')
        setDueDate(data.project.due_date ?? '')
        setNotesDraft(data.project.notes ?? '')
        setTagsDraft((data.project.tags ?? []).join(', '))
        setReviewDraft({
          deliveredOnTime: data.project.review?.delivered_on_time ?? null,
          flowIssues: data.project.review?.flow_issues ?? '',
          reviewNotes: data.project.review?.review_notes ?? '',
          learnings: data.project.review?.learnings ?? '',
        })
        setReviewStatus('')
        setSteps(data.steps ?? [])
        if (data.budget?.archived) {
          setBudget(null)
          setBudgetSteps([])
          setArchivedBudget(data.budget)
        } else {
          setBudget(data.budget ?? null)
          setBudgetSteps(data.budgetSteps ?? [])
          setArchivedBudget(null)
        }
        setStepDrafts(
          Object.fromEntries(
            (data.steps ?? []).map((step) => [step.id, { name: step.name, dueDate: step.due_date ?? '' }]),
          ),
        )
        setFiles(data.files)
        setDeliveries(data.deliveries)
        setTimeLogs(data.timeLogs)
        apiRequest<Array<{ id: number }>>(`/roadmaps?projectId=${id}`, {}, token)
          .then((roadmaps) => setRoadmapId(roadmaps[0]?.id ?? null))
          .catch(() => setRoadmapId(null))
        if (!data.budget || data.budget.archived) {
          setBudgetTotal('')
          setBudgetProduction('')
          setBudgetProfitPercent('')
          setBudgetProfit('')
          setBudgetVatPercent('')
          setBudgetVat('')
          setBudgetNotes('')
          setBudgetStepCosts(Object.fromEntries((data.steps ?? []).map((step) => [step.id, ''])))
        } else {
          setBudgetTotal(data.budget.total_budget ?? '')
          setBudgetProduction(data.budget.production_budget ?? '')
          setBudgetProfitPercent(data.budget.profit_percent ?? '')
          setBudgetProfit(data.budget.profit_budget ?? '')
          setBudgetVatPercent(data.budget.vat_percent ?? '')
          setBudgetVat(data.budget.vat_amount ?? '')
          setBudgetNotes(data.budget.notes ?? '')
        }
      })
      .catch(() => setError('Unable to load project.'))
  }, [id, token])


  const loadWorkflows = useCallback(() => {
    if (!token) return
    setWorkflowLoading(true)
    apiRequest<{ templates: WorkflowTemplate[]; steps: WorkflowStep[] }>('/workflows', {}, token)
      .then((data) => {
        setWorkflowTemplates(data.templates ?? [])
        setWorkflowSteps(data.steps ?? [])
        setWorkflowError('')
      })
      .catch(() => setWorkflowError('Unable to load workflows.'))
      .finally(() => setWorkflowLoading(false))
  }, [token])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

  useEffect(() => {
    if (replaceTemplateId) return
    if (project?.workflow_template_id) {
      const match = workflowTemplates.find((template) => template.id === project.workflow_template_id)
      if (match) {
        setReplaceTemplateId(project.workflow_template_id)
        return
      }
    }
    if (workflowTemplates.length > 0) {
      setReplaceTemplateId(workflowTemplates[0].id)
    }
  }, [project?.workflow_template_id, replaceTemplateId, workflowTemplates])

  useEffect(() => {
    if (budget) return
    setBudgetStepCosts((current) => {
      const next = { ...current }
      for (const step of steps) {
        if (!(step.id in next)) next[step.id] = ''
      }
      return next
    })
  }, [budget, steps])

  useEffect(() => {
    if (budget) return
    const total = Number(budgetTotal) || 0
    const profitPct = Number(budgetProfitPercent) || 0
    const vatPct = Number(budgetVatPercent) || 0
    const profit = total * (profitPct / 100)
    const vat = total * (vatPct / 100)
    const production = Math.max(0, total - profit - vat)
    setBudgetVat(vat ? vat.toFixed(2) : '')
    setBudgetProduction(production ? production.toFixed(2) : '')
    setBudgetProfit(profit ? profit.toFixed(2) : '')
  }, [budget, budgetProfitPercent, budgetTotal, budgetVatPercent])

  const budgetProductionRemaining = useMemo(() => {
    if (budget) return 0
    const production = Number(budgetProduction) || 0
    const allocated = steps.reduce((total, step) => total + (Number(budgetStepCosts[step.id]) || 0), 0)
    return production - allocated
  }, [budget, budgetProduction, budgetStepCosts, steps])

  const budgetRemainingTone = useMemo(() => {
    if (budget) return 'neutral'
    const production = Number(budgetProduction) || 0
    if (production <= 0) return 'neutral'
    if (budgetProductionRemaining <= 0) return 'danger'
    if (budgetProductionRemaining <= production * 0.2) return 'warning'
    return 'ok'
  }, [budget, budgetProduction, budgetProductionRemaining])

  const selectedTemplate = useMemo(
    () => workflowTemplates.find((template) => template.id === replaceTemplateId),
    [replaceTemplateId, workflowTemplates],
  )

  const selectedTemplateSteps = useMemo(() => {
    if (!replaceTemplateId) return []
    return workflowSteps.filter((step) => step.template_id === replaceTemplateId)
  }, [replaceTemplateId, workflowSteps])

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

  const handleDeleteRoadmap = async () => {
    if (!token || !roadmapId) return
    const confirmed = window.confirm('Delete this roadmap? This cannot be undone.')
    if (!confirmed) return
    try {
      await apiRequest(`/roadmaps/${roadmapId}`, { method: 'DELETE' }, token)
      setRoadmapId(null)
      setRoadmapImportName('')
      setRoadmapImportText('')
      setRoadmapMessage('Roadmap deleted. You can import a new one.')
    } catch {
      setRoadmapMessage('Unable to delete roadmap.')
    }
  }

  const importRoadmapContent = async (content: string, sourceType: 'markdown' | 'json') => {
    if (!token || !id || !project) return
    setRoadmapMessage('')
    let parsed: ImportedRoadmap
    try {
      parsed = parseRoadmapInput(content, sourceType, `${project.title} roadmap`)
    } catch {
      setRoadmapMessage('Unable to parse roadmap file.')
      return
    }

    if (parsed.phases.length === 0) {
      setRoadmapMessage('No phases/steps found in file.')
      return
    }

    const payload = {
      title: parsed.title || `${project.title} roadmap`,
      autoSchedule: false,
      phases: parsed.phases.map((phase, index) => ({
        title: phase.title,
        goal: phase.goal || null,
        position: index + 1,
        startDay: phase.startDay ?? null,
        endDay: phase.endDay ?? null,
        steps: phase.steps.map((step, stepIndex) => ({
          title: step.title,
          position: stepIndex + 1,
          dueDate: step.dueDate ?? null,
          status: 'pending',
          notes: null,
          payload: step.content ?? null,
        })),
        checkpoints: phase.checkpoints.map((checkpoint, checkpointIndex) => ({
          title: checkpoint,
          position: checkpointIndex + 1,
        })),
      })),
      metrics: parsed.metrics.map((metric, index) => ({ title: metric, position: index + 1 })),
      rules: parsed.rules.map((rule, index) => ({ title: rule, position: index + 1 })),
    }

    try {
      if (roadmapId) {
        await apiRequest(`/roadmaps/${roadmapId}`, { method: 'PUT', body: JSON.stringify(payload) }, token)
      } else {
        const created = await apiRequest<{ roadmap?: { id: number } }>(
          '/roadmaps',
          {
            method: 'POST',
            body: JSON.stringify({
              projectId: Number(id),
              sourceType,
              ...payload,
            }),
          },
          token,
        )
        setRoadmapId(created.roadmap?.id ?? roadmapId)
      }
      setRoadmapMessage(roadmapId ? 'Roadmap replaced from file.' : 'Roadmap imported.')
      loadProject()
    } catch {
      setRoadmapMessage('Unable to import roadmap file.')
    }
  }

  const handleImportRoadmapFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    const sourceType = extension === 'json' ? 'json' : roadmapImportType
    setRoadmapImportType(sourceType)
    setRoadmapImportName(file.name)
    const content = await file.text()
    await importRoadmapContent(content, sourceType)
  }

  const handleImportRoadmapText = async () => {
    if (!roadmapImportText.trim()) {
      setRoadmapMessage('Paste roadmap content first.')
      return
    }
    setRoadmapImportName('Pasted text')
    await importRoadmapContent(roadmapImportText, roadmapImportType)
  }

  const handleProjectUpdate = async () => {
    if (!token || !id) return
    setProjectSaveStatus('')
    try {
      await apiRequest(
        `/projects/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status,
            clientName: clientName.trim() || null,
            clientEmail: clientEmail.trim() || null,
            clientPhone: clientPhone.trim() || null,
            serviceType: serviceType.trim() || null,
            planTier: planTier.trim() || null,
            projectColor: projectColor || null,
            startDate: startDate || null,
            dueDate: dueDate || null,
          }),
        },
        token,
      )
      setProjectSaveStatus('Saved.')
      loadProject()
    } catch {
      setProjectSaveStatus('Unable to save changes.')
    }
  }

  const handleReplaceWorkflow = async () => {
    if (!token || !id || !replaceTemplateId) return
    setReplaceStatus('')
    const confirmed = window.confirm(
      `Replace this project's workflow with "${selectedTemplate?.name ?? 'this template'}"? This will overwrite existing steps and recreate budget allocations.`,
    )
    if (!confirmed) return
    try {
      setReplaceStatus('Replacing workflow...')
      await apiRequest(
        `/projects/${id}/workflow/replace`,
        { method: 'POST', body: JSON.stringify({ templateId: replaceTemplateId }) },
        token,
      )
      setReplaceStatus('Workflow replaced.')
      loadProject()
    } catch {
      setReplaceStatus('Unable to replace workflow.')
    }
  }

  const handleArchiveProject = async () => {
    if (!token || !id) return
    const confirmed = window.confirm('Archive this project? You can still access it later from Archive.')
    if (!confirmed) return
    try {
      await apiRequest(
        `/projects/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status: 'archive' }) },
        token,
      )
      navigate('/archive')
    } catch {
      setError('Unable to archive project.')
    }
  }

  const handleDeleteProject = async () => {
    if (!token || !id) return
    const confirmed = window.confirm('Delete this project and all related data? This cannot be undone.')
    if (!confirmed) return
    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE' }, token)
      navigate('/')
    } catch {
      setError('Unable to delete project.')
    }
  }

  const handleNotesSave = async () => {
    if (!token || !id) return
    const nextNotes = notesDraft.trim()
    try {
      await apiRequest(
        `/projects/${id}`,
        { method: 'PATCH', body: JSON.stringify({ notes: nextNotes || null }) },
        token,
      )
      setProject((current) => (current ? { ...current, notes: nextNotes || null } : current))
      setNotesDraft(nextNotes)
    } catch {
      setError('Unable to save notes.')
    }
  }

  const handleTagsSave = async () => {
    if (!token || !id) return
    const tags = parseTags(tagsDraft)
    try {
      await apiRequest(
        `/projects/${id}`,
        { method: 'PATCH', body: JSON.stringify({ tags }) },
        token,
      )
      setProject((current) => (current ? { ...current, tags } : current))
      setTagsDraft(tags.join(', '))
    } catch {
      setError('Unable to save tags.')
    }
  }

  const handleUrgentToggle = async () => {
    if (!token || !id || !project) return
    const currentTags = parseTags(tagsDraft)
    const urgentActive = hasUrgentTag(currentTags)
    const cleanedTags = currentTags.filter((tag) => !isUrgentTag(tag))
    const nextTags = urgentActive ? cleanedTags : [...cleanedTags, 'urgent']
    try {
      await apiRequest(
        `/projects/${id}`,
        { method: 'PATCH', body: JSON.stringify({ tags: nextTags }) },
        token,
      )
      setProject((current) => (current ? { ...current, tags: nextTags } : current))
      setTagsDraft(nextTags.join(', '))
    } catch {
      setError('Unable to update urgent status.')
    }
  }

  const handleBudgetCreate = async () => {
    if (!token || !id) return
    setBudgetStatus('')
    try {
      await apiRequest(
        '/budgets',
        {
          method: 'POST',
          body: JSON.stringify({
            projectId: Number(id),
            totalBudget: budgetTotal,
            productionBudget: budgetProduction,
            profitBudget: budgetProfit,
            profitPercent: budgetProfitPercent,
            vatAmount: budgetVat,
            vatPercent: budgetVatPercent,
            notes: budgetNotes.trim() || null,
            steps: steps.map((step) => ({
              projectStepId: step.id,
              stepName: step.name,
              stepPosition: step.position,
              costAmount: budgetStepCosts[step.id] ?? '',
            })),
          }),
        },
        token,
      )
      setBudgetStatus('Budget created.')
      loadProject()
    } catch {
      setBudgetStatus('Unable to create budget.')
    }
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

  const handleStepDraftChange = (stepId: number, patch: { name?: string; dueDate?: string }) => {
    setStepDrafts((prev) => ({
      ...prev,
      [stepId]: {
        name: prev[stepId]?.name ?? '',
        dueDate: prev[stepId]?.dueDate ?? '',
        ...patch,
      },
    }))
  }

  const handleStepSave = async (stepId: number) => {
    if (!token || !id) return
    const step = steps.find((item) => item.id === stepId)
    const draft = stepDrafts[stepId]
    if (!step || !draft) return
    const nextName = draft.name.trim()
    if (!nextName) {
      handleStepDraftChange(stepId, { name: step.name })
      return
    }
    const nextDue = draft.dueDate || null
    const nameChanged = nextName !== step.name
    const dueChanged = (nextDue || null) !== (step.due_date || null)
    if (!nameChanged && !dueChanged) {
      return true
    }
    const payload: { name?: string; dueDate?: string | null } = {}
    if (nameChanged) payload.name = nextName
    if (dueChanged) payload.dueDate = nextDue
    try {
      await apiRequest(
        `/projects/${id}/steps/${stepId}`,
        { method: 'PATCH', body: JSON.stringify(payload) },
        token,
      )
      setSteps((prev) =>
        prev.map((item) =>
          item.id === stepId
            ? {
                ...item,
                name: payload.name ?? item.name,
                due_date: payload.dueDate ?? item.due_date,
              }
            : item,
        ),
      )
      return true
    } catch {
      setError('Unable to update step.')
      return false
    }
  }

  const handleSaveAllSteps = async () => {
    if (!token || !id) return
    setStepSaveStatus('')
    const results = await Promise.all(steps.map((step) => handleStepSave(step.id)))
    if (results.some((result) => result === false)) {
      setStepSaveStatus('Unable to save some steps.')
      return
    }
    setStepSaveStatus('Saved.')
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
  const projectDueDate = project.due_date ? new Date(project.due_date) : null
  const daysUntilDue = projectDueDate
    ? Math.ceil((projectDueDate.getTime() - today.getTime()) / 86400000)
    : null
  const overdueSteps = steps.filter((step) => {
    if (!step.due_date || step.status === 'done') return false
    const stepDate = new Date(step.due_date)
    stepDate.setHours(0, 0, 0, 0)
    return stepDate < today
  })
  const totalMinutes = timeLogs.reduce((sum, log) => sum + log.minutes, 0)

  const handleReviewChange = (patch: Partial<ReviewDraft>) => {
    setReviewDraft((prev) => ({ ...prev, ...patch }))
  }

  const handleSaveReview = async () => {
    if (!token || !id) return
    try {
      await apiRequest(
        `/projects/${id}/review`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            deliveredOnTime: reviewDraft.deliveredOnTime,
            flowIssues: reviewDraft.flowIssues.trim() || null,
            reviewNotes: reviewDraft.reviewNotes.trim() || null,
            learnings: reviewDraft.learnings.trim() || null,
          }),
        },
        token,
      )
      setReviewStatus('Saved.')
    } catch {
      setReviewStatus('Unable to save review.')
    }
  }

  const buildNotionSummary = (draft: ReviewDraft) => {
    const onTime =
      draft.deliveredOnTime === null ? '—' : draft.deliveredOnTime ? 'Yes' : 'No'
    return [
      `# ${project?.title ?? 'Project review'}`,
      `Client: ${project?.client_name ?? '—'}`,
      `Service: ${project?.service_type ?? '—'}`,
      `Due: ${formatDate(project?.due_date ?? null)}`,
      `Completed: ${formatDate(project?.completed_at ?? null)}`,
      '',
      '## Delivery review',
      `Delivered on time: ${onTime}`,
      `Flow issues: ${draft.flowIssues.trim() || '—'}`,
      `Review notes: ${draft.reviewNotes.trim() || '—'}`,
      'Learnings:',
      draft.learnings.trim() || '—',
    ].join('\n')
  }

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildNotionSummary(reviewDraft))
      setReviewStatus('Copied for Notion.')
    } catch {
      setReviewStatus('Copy failed.')
    }
  }

  const alerts = [
    ...(projectDueDate && daysUntilDue !== null && daysUntilDue < 0
      ? [{
          tone: 'danger',
          title: 'Deadline missed',
          detail: `Project due ${formatDate(project.due_date)}.`,
        }]
      : []),
    ...(projectDueDate && daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 5
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

  const urgentActive = hasUrgentTag(project.tags)
  const budgetSpent = budgetSteps.reduce((sum, step) => sum + toNumber(step.cost_amount), 0)
  const budgetProductionValue = budget ? toNumber(budget.production_budget) : toNumber(budgetProduction)
  const budgetRemaining = Math.max(0, budgetProductionValue - budgetSpent)
  return (
    <Layout
      title={project.title}
      headerActions={
        <div className="project-actions">
          <button type="button" className="project-actions__ghost" onClick={handleArchiveProject}>
            Archive project
          </button>
          <button type="button" className="project-actions__danger" onClick={handleDeleteProject}>
            Delete project
          </button>
        </div>
      }
    >
      <div className="detail-grid">
        <div className="detail-column">
          <div className="detail__summary">
            <div className="detail__field">
              <label>Client</label>
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Client name"
              />
            </div>
            <div className="detail__field">
              <label>Email</label>
              <input
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="detail__field">
              <label>Phone</label>
              <input
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                placeholder="Phone"
              />
            </div>
            <div className="detail__field">
              <label>Service</label>
              <input
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                placeholder="Service"
              />
            </div>
            <div className="detail__field">
              <label>Plan</label>
              <input
                value={planTier}
                onChange={(event) => setPlanTier(event.target.value)}
                placeholder="Plan"
              />
            </div>
            <div className="detail__field">
              <label>Project color</label>
              <input
                type="color"
                value={projectColor || '#9ca3af'}
                onChange={(event) => setProjectColor(event.target.value)}
              />
            </div>
            <div className="detail__field detail__field--status">
              <label>Status</label>
              <div className="detail__status">
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="briefing">Backlog</option>
                  <option value="scheduled">Planned</option>
                  <option value="shoot">In progress</option>
                  <option value="edit">Execution</option>
                  <option value="review">In review</option>
                  <option value="delivery">Completed</option>
                  <option value="archive">Archived</option>
                </select>
                <button type="button" onClick={handleProjectUpdate}>Update</button>
              </div>
            </div>
            <div className="detail__field">
              <label>Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="detail__field">
              <label>Due</label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="detail__actions">
              <button type="button" onClick={handleProjectUpdate}>
                Save changes
              </button>
              {projectSaveStatus && <span className="muted">{projectSaveStatus}</span>}
            </div>
          </div>
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
                  <p className="panel__subtitle">Define steps, dates, and progress for execution.</p>
                </div>
              </div>
            </div>
            <ul>
              {steps.map((step) => {
                const draft = stepDrafts[step.id] ?? { name: step.name, dueDate: step.due_date ?? '' }
                return (
                  <li
                    key={step.id}
                    className={`step-row${step.status === 'done' ? ' step-row--done' : ''}${
                      step.due_date && step.status !== 'done' && new Date(step.due_date) < today ? ' step-row--late' : ''
                    }`}
                  >
                    <div className="step-row__main">
                      <label>
                        <span className="step-row__index">{step.position}.</span>
                        <input
                          className="step-row__name"
                          value={draft.name}
                          onChange={(event) => handleStepDraftChange(step.id, { name: event.target.value })}
                          onBlur={() => handleStepSave(step.id)}
                          placeholder="Step name"
                        />
                      </label>
                      <input
                        className="step-row__date-input"
                        type="date"
                        value={draft.dueDate}
                        onChange={(event) => handleStepDraftChange(step.id, { dueDate: event.target.value })}
                        onBlur={() => handleStepSave(step.id)}
                      />
                    </div>
                    <div className="step-row__actions">
                      <button
                        type="button"
                        className={`step-row__toggle${step.status === 'done' ? ' step-row__toggle--undo' : ''}`}
                        onClick={() => toggleStep(step)}
                      >
                        {step.status === 'done' ? 'Undo' : 'Done'}
                      </button>
                      <button type="button" onClick={() => removeStep(step.id)}>Remove</button>
                    </div>
                  </li>
                )
              })}
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
            <div className="detail__actions">
              <button type="button" onClick={handleSaveAllSteps}>
                Save changes
              </button>
              {stepSaveStatus && <span className="muted">{stepSaveStatus}</span>}
            </div>
            <div className="workflow-assign">
              <div className="section-heading">
                <p className="eyebrow">Replace workflow</p>
                <h3>Apply a saved template</h3>
                <p className="muted">Swap the entire sequence with a saved workflow template.</p>
              </div>
              <label>
                Workflow template
                <div className="workflow-template-row">
                  <select
                    value={replaceTemplateId}
                    onChange={(event) => setReplaceTemplateId(Number(event.target.value))}
                    disabled={workflowLoading || workflowTemplates.length === 0}
                  >
                    {workflowTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleReplaceWorkflow}
                    disabled={!replaceTemplateId || workflowLoading}
                  >
                    Replace workflow
                  </button>
                </div>
              </label>
              {workflowError && <p className="form-error">{workflowError}</p>}
              {workflowTemplates.length === 0 && !workflowLoading ? (
                <p className="muted">No saved workflows yet. Create one on the new project screen.</p>
              ) : null}
              {selectedTemplateSteps.length > 0 && (
                <div className="workflow-preview">
                  <p>Workflow preview:</p>
                  <ul>
                    {selectedTemplateSteps.map((step) => (
                      <li key={step.id}>
                        {step.position}. {step.name}
                      </li>
                    ))}
                  </ul>
                  {selectedTemplate?.tags?.length ? (
                    <p className="muted">Tags: {selectedTemplate.tags.join(', ')}</p>
                  ) : null}
                </div>
              )}
              {replaceStatus && <span className="muted">{replaceStatus}</span>}
            </div>
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

        <div className="detail-column">
          <div className="detail-group">
            <p className="detail-group__title"><span className="detail-group__index">1</span> Overview</p>
            <section className="panel panel--compact">
              <div className="panel__header">
                <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Roadmap</p>
                  <h3>Project roadmap</h3>
                </div>
              </div>
              {roadmapId && (
                <div className="panel__actions">
                  <Link to={`/roadmaps/${roadmapId}`} className="ghost-link">
                    View status
                  </Link>
                  <button type="button" className="ghost-link" onClick={handleDeleteRoadmap}>
                    Delete
                  </button>
                </div>
              )}
            </div>
            {!roadmapId && <p className="muted">No roadmap attached.</p>}
            <div className="roadmap-inline-import">
              <div className="roadmap-inline-import__toolbar">
                <select
                  value={roadmapImportType}
                  onChange={(event) => setRoadmapImportType(event.target.value === 'json' ? 'json' : 'markdown')}
                  aria-label="Roadmap import type"
                >
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                </select>
                <label
                  className="ghost-link roadmap-inline-import__browse"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    const file = event.dataTransfer.files?.[0]
                    if (file) void handleImportRoadmapFile(file)
                  }}
                >
                  <input
                    type="file"
                    accept=".md,.markdown,.json"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) void handleImportRoadmapFile(file)
                    }}
                  />
                  {roadmapId ? 'Replace from file' : 'Import file'}
                </label>
              </div>
              {roadmapImportName && <em className="roadmap-inline-import__file">{roadmapImportName}</em>}
              <label className="roadmap-inline-import__paste">
                <textarea
                  className="roadmap-inline-import__text"
                  value={roadmapImportText}
                  onChange={(event) => setRoadmapImportText(event.target.value)}
                  placeholder={roadmapImportType === 'json' ? '{ ... }' : '# Roadmap ...'}
                  rows={4}
                />
              </label>
              <div className="roadmap-inline-import__actions">
                <button type="button" className="ghost-link" onClick={() => void handleImportRoadmapText()}>
                  {roadmapId ? 'Replace from text' : 'Import text'}
                </button>
                {roadmapId && (
                  <Link to={`/roadmaps/${roadmapId}`} className="ghost-link">
                    View roadmap
                  </Link>
                )}
              </div>
              {roadmapMessage && <p className="muted">{roadmapMessage}</p>}
            </div>
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
            <textarea
              className="detail__notes"
              rows={4}
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              placeholder="Add notes..."
            />
            <div className="detail__actions">
              <button type="button" onClick={handleNotesSave}>
                Save
              </button>
            </div>
          </section>
          </div>
          <div className="detail-group">
            <p className="detail-group__title"><span className="detail-group__index">2</span> Controls</p>
            <section className="panel panel--compact budget-panel">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Budget</p>
                  <h3>Budget control</h3>
                  <p className="panel__subtitle">Track production spend and profit targets.</p>
                </div>
              </div>
              {budget && (
                <Link to={`/budgets/${budget.id}`} className="ghost-link">
                  Open budget
                </Link>
              )}
            </div>
            {budget ? (
              <div className="budget-summary">
                <div>
                  <p className="muted">Project budget</p>
                  <strong>{formatAmount(toNumber(budget.total_budget))}</strong>
                </div>
                <div>
                  <p className="muted">Production</p>
                  <strong>{formatAmount(budgetProductionValue)}</strong>
                </div>
                <div>
                  <p className="muted">Spent</p>
                  <strong>{formatAmount(budgetSpent)}</strong>
                </div>
                <div>
                  <p className="muted">Remaining</p>
                  <strong>{formatAmount(budgetRemaining)}</strong>
                </div>
                <div>
                  <p className="muted">Profit</p>
                  <strong>{formatAmount(toNumber(budget.profit_budget))}</strong>
                </div>
                <div>
                  <p className="muted">VAT</p>
                  <strong>{formatAmount(toNumber(budget.vat_amount))}</strong>
                </div>
              </div>
            ) : (
              <div className="budget-create">
                {archivedBudget && (
                  <div className="budget-archived-note">
                    <p className="muted">An archived budget exists for this project.</p>
                    <Link to={`/budgets/${archivedBudget.id}`} className="ghost-link">
                      View archived budget
                    </Link>
                  </div>
                )}
                <div className="budget-create__grid">
                  <label>
                    Project budget
                    <input
                      value={budgetTotal}
                      onChange={(event) => setBudgetTotal(event.target.value)}
                    />
                  </label>
                  <label>
                    Production budget
                    <input value={budgetProduction} disabled />
                  </label>
                  <label>
                    Profit target (%)
                    <input
                      value={budgetProfitPercent}
                      onChange={(event) => setBudgetProfitPercent(event.target.value)}
                    />
                  </label>
                  <label>
                    Profit amount
                    <input value={budgetProfit} disabled />
                  </label>
                  <label>
                    VAT (%)
                    <input
                      value={budgetVatPercent}
                      onChange={(event) => setBudgetVatPercent(event.target.value)}
                    />
                  </label>
                  <label>
                    VAT amount
                    <input value={budgetVat} disabled />
                  </label>
                </div>
                <label className="budget-create__notes">
                  Notes
                  <textarea
                    value={budgetNotes}
                    onChange={(event) => setBudgetNotes(event.target.value)}
                    rows={2}
                  />
                </label>
                {steps.length > 0 && (
                  <div className="budget-create__steps">
                    <p className="muted">Allocate production costs by workflow step.</p>
                    <div className={`budget-remaining budget-remaining--${budgetRemainingTone}`}>
                      <span>Production remaining</span>
                      <strong>{formatAmount(budgetProductionRemaining)}</strong>
                    </div>
                    {steps.map((step) => (
                      <label key={step.id} className="budget-step-row">
                        <span>
                          {step.position}. {step.name}
                          {formatOffset(step.offset_days) && (
                            <em className="budget-step-meta">+{formatOffset(step.offset_days)}</em>
                          )}
                        </span>
                        <input
                          value={budgetStepCosts[step.id] ?? ''}
                          onChange={(event) =>
                            setBudgetStepCosts((current) => ({ ...current, [step.id]: event.target.value }))
                          }
                          placeholder="0.00"
                        />
                      </label>
                    ))}
                  </div>
                )}
                <button type="button" onClick={handleBudgetCreate}>
                  Create budget
                </button>
                {budgetStatus && <p className="muted">{budgetStatus}</p>}
              </div>
            )}
          </section>
          <section className="panel panel--compact detail__urgent">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4l8 14H4L12 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 10v4M12 16v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Focus today</p>
                  <h3>Urgent</h3>
                  <p className="panel__subtitle">Highlights this project in Focus Today and the timeline.</p>
                </div>
              </div>
              <button
                type="button"
                className={`urgent-toggle${urgentActive ? ' urgent-toggle--active' : ''}`}
                onClick={handleUrgentToggle}
              >
                {urgentActive ? 'Remove urgent' : 'Mark urgent'}
              </button>
            </div>
          </section>
          <section className="panel panel--compact">
            <div className="panel__header">
              <div className="panel__title">
                <span className="panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14M5 12h10M5 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Tags</p>
                  <h3>Tags</h3>
                </div>
              </div>
            </div>
            <input
              className="detail__tags"
              value={tagsDraft}
              onChange={(event) => setTagsDraft(event.target.value)}
              placeholder="Add tags, comma separated"
            />
            <div className="detail__actions">
              <button type="button" onClick={handleTagsSave}>
                Save
              </button>
            </div>
          </section>
          </div>
          <div className="detail-group">
            <p className="detail-group__title"><span className="detail-group__index">3</span> Archive</p>
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
                    <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="eyebrow">Review</p>
                  <h3>Delivery notes</h3>
                  <p className="panel__subtitle">Quick recap once the project is done.</p>
                </div>
              </div>
            </div>
            {project.status !== 'archive' && (
              <p className="muted">Mark the project done to unlock the review.</p>
            )}
            {project.status === 'archive' && (
              <div className="review-fields">
                <label htmlFor="review-on-time">Delivered on time</label>
                <select
                  id="review-on-time"
                  value={reviewDraft.deliveredOnTime === null ? '' : reviewDraft.deliveredOnTime ? 'yes' : 'no'}
                  onChange={(event) =>
                    handleReviewChange({
                      deliveredOnTime:
                        event.target.value === ''
                          ? null
                          : event.target.value === 'yes',
                    })
                  }
                >
                  <option value="">Not set</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>

                <label htmlFor="review-flow">Flow issues</label>
                <input
                  id="review-flow"
                  value={reviewDraft.flowIssues}
                  onChange={(event) => handleReviewChange({ flowIssues: event.target.value })}
                  placeholder="Short summary of blockers"
                />

                <label htmlFor="review-notes">Review notes</label>
                <textarea
                  id="review-notes"
                  value={reviewDraft.reviewNotes}
                  onChange={(event) => handleReviewChange({ reviewNotes: event.target.value })}
                  placeholder="Timing, comms, or scope notes"
                />

                <label htmlFor="review-learnings">Learnings</label>
                <textarea
                  id="review-learnings"
                  value={reviewDraft.learnings}
                  onChange={(event) => handleReviewChange({ learnings: event.target.value })}
                  placeholder="Lessons and playbook updates"
                />

                <div className="review-actions">
                  <button type="button" onClick={handleSaveReview}>
                    Save review
                  </button>
                  <button type="button" onClick={handleCopySummary}>
                    Copy Notion summary
                  </button>
                </div>
                {reviewStatus && <p className="muted">{reviewStatus}</p>}
              </div>
            )}
          </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
