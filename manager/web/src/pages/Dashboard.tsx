import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import Layout from '../components/Layout'
import { apiRequest, apiBase } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'

type Project = {
  id: number
  title: string
  client_name: string | null
  client_email?: string | null
  service_type: string | null
  plan_tier: string | null
  project_color?: string | null
  status: string | null
  start_date: string | null
  due_date: string | null
  created_at: string
  tags?: string[]
  share_links?: Array<{ token: string; created_at: string; expires_at: string | null }>
  steps?: Array<{ id: number; name: string; due_date: string | null; status?: string }>
}

type RoadmapListItem = {
  id: number
  project_id: number
  project_color: string | null
}

type ViewMode = 'timeline' | 'list' | 'board' | 'calendar'
type CalendarMode = 'month' | 'week'

const MotionLink = motion(Link)

const hasUrgentTag = (tags?: string[]) =>
  (tags ?? []).some((tag) => tag.trim().toLowerCase() === 'urgent')

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
  }).format(date)
}

const statusLabel = (value: string | null | undefined) => {
  switch (value) {
    case 'briefing':
      return 'Backlog'
    case 'scheduled':
      return 'Planned'
    case 'shoot':
      return 'In progress'
    case 'edit':
      return 'Execution'
    case 'review':
      return 'In review'
    case 'delivery':
      return 'Completed'
    case 'archive':
      return 'Archived'
    default:
      return value || '—'
  }
}

const formatDateMonthDay = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date)
}

const hashString = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const fallbackColor = '#9ca3af'

const getProjectColor = (project: { id: number; title: string; project_color?: string | null }, mode: 'hash' | 'fallback') => {
  if (project.project_color) return project.project_color
  if (mode === 'fallback') return fallbackColor
  const seed = hashString(`${project.id}-${project.title}`)
  const hue = seed % 360
  return `hsl(${hue} 68% 62%)`
}

const hexToRgba = (value: string, alpha: number) => {
  const normalized = value.replace('#', '')
  if (normalized.length !== 6) return value
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const normalizeValue = (value: string | null | undefined) => (value ?? '').trim().toLowerCase()

type TimelineFilterType =
  | 'none'
  | 'project_color'
  | 'tag'
  | 'client_name'
  | 'client_email'
  | 'service_type'
  | 'plan_tier'

const matchesFilter = (project: Project, filterType: TimelineFilterType, filterValue: string) => {
  if (filterType === 'none' || !filterValue) return false
  switch (filterType) {
    case 'project_color':
      return normalizeValue(project.project_color) === normalizeValue(filterValue)
    case 'tag':
      return (project.tags ?? []).some((tag) => normalizeValue(tag) === normalizeValue(filterValue))
    case 'client_name':
      return normalizeValue(project.client_name) === normalizeValue(filterValue)
    case 'client_email':
      return normalizeValue(project.client_email) === normalizeValue(filterValue)
    case 'service_type':
      return normalizeValue(project.service_type) === normalizeValue(filterValue)
    case 'plan_tier':
      return normalizeValue(project.plan_tier) === normalizeValue(filterValue)
    default:
      return false
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([])
  const [error, setError] = useState('')
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'timeline'
    try {
      const stored = window.sessionStorage.getItem('dashboardView') as ViewMode | null
      return stored ?? 'timeline'
    } catch {
      return 'timeline'
    }
  })
  const [timelineOffsets, setTimelineOffsets] = useState<Record<number, number>>({})
  const [draggingProjectId, setDraggingProjectId] = useState<number | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const current = new Date()
    return new Date(current.getFullYear(), current.getMonth(), 1)
  })
  const [calendarAnchor, setCalendarAnchor] = useState(() => {
    const current = new Date()
    return new Date(current.getFullYear(), current.getMonth(), current.getDate())
  })
  const [calendarView, setCalendarView] = useState<CalendarMode>('month')
  const [daySize, setDaySize] = useState(72)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)
  const [timelineFilterOpen, setTimelineFilterOpen] = useState(false)
  const [timelineFilterType, setTimelineFilterType] = useState<TimelineFilterType>('none')
  const [timelineFilterValue, setTimelineFilterValue] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarToken, setCalendarToken] = useState('')
  const [calendarStatus, setCalendarStatus] = useState('')
  const filterRef = useRef<HTMLDivElement | null>(null)
  const calendarRef = useRef<HTMLDivElement | null>(null)
  const [listSortKey, setListSortKey] = useState<'project' | 'client' | 'service' | 'status' | 'due' | 'tags'>('due')
  const [listSortDir, setListSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    setCalendarAnchor((current) => new Date(current.getFullYear(), current.getMonth(), current.getDate()))
  }, [calendarView])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(pointer: coarse)')
    const updatePointer = () => setIsCoarsePointer(media.matches)
    updatePointer()
    if (media.addEventListener) {
      media.addEventListener('change', updatePointer)
      return () => media.removeEventListener('change', updatePointer)
    }
    media.addListener(updatePointer)
    return () => media.removeListener(updatePointer)
  }, [])

  useEffect(() => {
    const updateDaySize = () => {
      const width = window.innerWidth
      if (width <= 720) {
        setDaySize(56)
      } else if (width <= 900) {
        setDaySize(64)
      } else {
        setDaySize(72)
      }
    }
    updateDaySize()
    window.addEventListener('resize', updateDaySize)
    return () => window.removeEventListener('resize', updateDaySize)
  }, [])
  const draggingRef = useRef<{
    id: number | null
    startX: number
    offset: number
    mode: 'move' | 'resize-left' | 'resize-right'
    active: boolean
    pointerId: number | null
    target: HTMLDivElement | null
    holdTimer: number | null
  }>({
    id: null,
    startX: 0,
    offset: 0,
    mode: 'move',
    active: false,
    pointerId: null,
    target: null,
    holdTimer: null,
  })
  const draggedRef = useRef<{ id: number | null; moved: boolean }>({ id: null, moved: false })

  useEffect(() => {
    if (!token) return
    apiRequest<Project[]>('/projects', {}, token)
      .then(setProjects)
      .catch(() => setError('Unable to load projects.'))
  }, [token])

  useEffect(() => {
    if (!token) return
    apiRequest<RoadmapListItem[]>('/roadmaps', {}, token)
      .then(setRoadmaps)
      .catch(() => {
        // Keep dashboard usable even if roadmap stats fail to load.
      })
  }, [token])

  useEffect(() => {
    if (!calendarOpen || calendarToken || !token) return
    apiRequest<{ token: string }>('/calendar/token', {}, token)
      .then((data) => {
        setCalendarToken(data.token)
        setCalendarStatus('')
      })
      .catch((error) => {
        const message =
          error instanceof Error && error.message ? error.message : 'Unable to load calendar link.'
        setCalendarStatus(message)
      })
  }, [calendarOpen, calendarToken, token])

  const calendarFeedUrl = useMemo(() => {
    if (!calendarToken) return ''
    const params = new URLSearchParams()
    params.set('includeSteps', '1')
    params.set('mode', 'due')
    return `${apiBase}/calendar/${calendarToken}?${params.toString()}`
  }, [calendarToken])

  useEffect(() => {
    if (!timelineFilterOpen && !calendarOpen) return
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (timelineFilterOpen && filterRef.current && !filterRef.current.contains(target)) {
        setTimelineFilterOpen(false)
      }
      if (calendarOpen && calendarRef.current && !calendarRef.current.contains(target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [timelineFilterOpen, calendarOpen])

  const handleCalendarCopy = async () => {
    if (!calendarFeedUrl) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(calendarFeedUrl)
        setCalendarStatus('Link copied.')
        return
      }
    } catch {
      // fall back to manual copy
    }

    const textarea = document.createElement('textarea')
    textarea.value = calendarFeedUrl
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const success = document.execCommand('copy')
      setCalendarStatus(success ? 'Link copied.' : 'Copy failed. Please copy manually.')
    } catch {
      setCalendarStatus('Copy failed. Please copy manually.')
    } finally {
      document.body.removeChild(textarea)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem('dashboardView', view)
    } catch {
      // Ignore storage write failures (e.g. private mode).
    }
  }, [view])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const projectsWithDue = projects
    .map((project) => ({
      ...project,
      due: project.due_date ? new Date(project.due_date) : null,
      steps: project.steps ? project.steps.filter((step) => step.status !== 'done') : project.steps,
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
  const boardProjects = projectsWithDue
  const activeProjects = projectsWithDue.filter((project) => project.status !== 'archive')
  const urgentProjects = activeProjects
    .filter((project) => hasUrgentTag(project.tags))
    .sort((a, b) => {
      const aDue = a.due?.getTime() ?? Infinity
      const bDue = b.due?.getTime() ?? Infinity
      if (aDue !== bDue) return aDue - bDue
      return a.created_at.localeCompare(b.created_at)
    })
  const statusColumns = useMemo(
    () => [
      { id: 'briefing', label: 'Backlog' },
      { id: 'scheduled', label: 'Planned' },
      { id: 'shoot', label: 'In progress' },
      { id: 'edit', label: 'Execution' },
      { id: 'review', label: 'In review' },
      { id: 'delivery', label: 'Completed' },
      { id: 'archive', label: 'Archived' },
    ],
    [],
  )
  const baseTimelineProjects = useMemo(
    () =>
      projectsWithDue
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
        }),
    [projectsWithDue],
  )

  const timelineFilterValues = useMemo(() => {
    const colors = new Set<string>()
    const tags = new Set<string>()
    const clientNames = new Set<string>()
    const clientEmails = new Set<string>()
    const serviceTypes = new Set<string>()
    const planTiers = new Set<string>()
    for (const project of activeProjects) {
      if (project.project_color) colors.add(project.project_color)
      for (const tag of project.tags ?? []) {
        const normalized = tag.trim()
        if (normalized) tags.add(normalized)
      }
      if (project.client_name) clientNames.add(project.client_name)
      if (project.client_email) clientEmails.add(project.client_email)
      if (project.service_type) serviceTypes.add(project.service_type)
      if (project.plan_tier) planTiers.add(project.plan_tier)
    }
    return {
      project_color: Array.from(colors).sort(),
      tag: Array.from(tags).sort(),
      client_name: Array.from(clientNames).sort(),
      client_email: Array.from(clientEmails).sort(),
      service_type: Array.from(serviceTypes).sort(),
      plan_tier: Array.from(planTiers).sort(),
    }
  }, [activeProjects])

  useEffect(() => {
    if (timelineFilterType === 'none') {
      setTimelineFilterValue('')
      return
    }
    const values = timelineFilterValues[timelineFilterType]
    if (!values || values.length === 0) {
      setTimelineFilterValue('')
      return
    }
    if (!values.includes(timelineFilterValue)) {
      setTimelineFilterValue(values[0])
    }
  }, [timelineFilterType, timelineFilterValue, timelineFilterValues])

  const timelineProjects = useMemo(() => {
    if (timelineFilterType === 'none' || !timelineFilterValue) return baseTimelineProjects
    const matched: typeof baseTimelineProjects = []
    const other: typeof baseTimelineProjects = []
    for (const project of baseTimelineProjects) {
      if (matchesFilter(project, timelineFilterType, timelineFilterValue)) {
        matched.push(project)
      } else {
        other.push(project)
      }
    }
    matched.sort((a, b) => {
      const aDue = a.end?.getTime() ?? Infinity
      const bDue = b.end?.getTime() ?? Infinity
      return aDue - bDue
    })
    return [...matched, ...other]
  }, [baseTimelineProjects, timelineFilterType, timelineFilterValue])

  const listProjects = useMemo(() => {
    const sorted = (items: typeof activeProjects) => {
      const multiplier = listSortDir === 'asc' ? 1 : -1
      return [...items].sort((a, b) => {
        switch (listSortKey) {
          case 'project':
            return multiplier * (a.title ?? '').localeCompare(b.title ?? '')
          case 'client':
            return multiplier * (a.client_name ?? '').localeCompare(b.client_name ?? '')
          case 'service':
            return multiplier * (a.service_type ?? '').localeCompare(b.service_type ?? '')
          case 'status':
            return multiplier * (a.status ?? '').localeCompare(b.status ?? '')
          case 'tags': {
            const tagA = (a.tags ?? []).slice().sort()[0]?.toLowerCase() ?? ''
            const tagB = (b.tags ?? []).slice().sort()[0]?.toLowerCase() ?? ''
            return multiplier * tagA.localeCompare(tagB)
          }
          case 'due':
          default: {
            const aDue = a.due?.getTime() ?? Infinity
            const bDue = b.due?.getTime() ?? Infinity
            return multiplier * (aDue - bDue)
          }
        }
      })
    }
    if (timelineFilterType === 'none' || !timelineFilterValue) return sorted(activeProjects)
    const matched: typeof activeProjects = []
    const other: typeof activeProjects = []
    for (const project of activeProjects) {
      if (matchesFilter(project, timelineFilterType, timelineFilterValue)) {
        matched.push(project)
      } else {
        other.push(project)
      }
    }
    return [...sorted(matched), ...sorted(other)]
  }, [activeProjects, timelineFilterType, timelineFilterValue, listSortDir, listSortKey])

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

  const handleViewChange = (next: ViewMode) => {
    setView(next)
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
    const isTouchMove = event.pointerType === 'touch' && mode === 'move'
    draggingRef.current = {
      id,
      startX: event.clientX,
      offset: currentOffset,
      mode,
      active: !isTouchMove,
      pointerId: event.pointerId,
      target: event.currentTarget,
      holdTimer: null,
    }
    draggedRef.current = { id, moved: false }
    if (!isTouchMove) {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    draggingRef.current.holdTimer = window.setTimeout(() => {
      if (draggingRef.current.id !== id) return
      draggingRef.current.active = true
      draggingRef.current.target?.setPointerCapture(event.pointerId)
    }, 180)
  }

  const handlePointerMove = (id: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current.id !== id) return
    if (!draggingRef.current.active) {
      const delta = event.clientX - draggingRef.current.startX
      if (Math.abs(delta) > 8 && draggingRef.current.holdTimer) {
        window.clearTimeout(draggingRef.current.holdTimer)
        draggingRef.current.holdTimer = null
        draggingRef.current.id = null
        draggedRef.current = { id: null, moved: false }
      }
      return
    }
    const delta = event.clientX - draggingRef.current.startX
    const offsetDays = Math.round(delta / daySize)
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
    if (draggingRef.current.holdTimer) {
      window.clearTimeout(draggingRef.current.holdTimer)
      draggingRef.current.holdTimer = null
    }
    if (draggingRef.current.active) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const offsetDays = timelineOffsets[id] ?? 0
    const moved = draggedRef.current.id === id && draggedRef.current.moved
    const mode = draggingRef.current.mode
    const wasActive = draggingRef.current.active
    draggingRef.current = {
      id: null,
      startX: 0,
      offset: 0,
      mode: 'move',
      active: false,
      pointerId: null,
      target: null,
      holdTimer: null,
    }
    draggedRef.current = { id: null, moved: false }

    if (!wasActive) {
      if (!moved && mode === 'move') {
        navigate(`/projects/${id}`)
      }
      return
    }

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

  const handleStatusDrop = async (status: string, projectId: number) => {
    if (!token) return
    const project = projects.find((item) => item.id === projectId)
    if (!project || project.status === status) return
    try {
      await apiRequest(
        `/projects/${projectId}`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        token,
      )
      setProjects((prev) =>
        prev.map((item) => (item.id === projectId ? { ...item, status } : item)),
      )
    } catch {
      setError('Unable to update project status.')
    }
  }

  const calendarDays = useMemo(() => {
    if (calendarView === 'week') {
      const weekStart = new Date(calendarAnchor)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + index)
        return day
      })
    }

    const start = new Date(calendarMonth)
    const end = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)
    const startDay = new Date(start)
    startDay.setDate(startDay.getDate() - startDay.getDay())
    const endDay = new Date(end)
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()))

    const days: Date[] = []
    const cursor = new Date(startDay)
    while (cursor <= endDay) {
      days.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return days
  }, [calendarAnchor, calendarMonth, calendarView])

  const calendarProjects = useMemo(() => {
    return activeProjects.map((project) => {
      const start = project.start_date ? new Date(project.start_date) : new Date(project.created_at)
      const end = project.due ? new Date(project.due) : start
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      return { ...project, spanStart: start, spanEnd: end }
    })
  }, [activeProjects])

  const maxCalendarItems = isCoarsePointer ? 2 : 3
  const roadmapColors = useMemo(() => {
    const colors = new Set<string>()
    roadmaps.forEach((roadmap) => {
      if (roadmap.project_color) {
        colors.add(roadmap.project_color)
        return
      }
      const project = projects.find((item) => item.id === roadmap.project_id)
      if (project) colors.add(getProjectColor(project, 'fallback'))
    })
    return Array.from(colors).slice(0, 6)
  }, [projects, roadmaps])

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
            {user?.is_admin && (
              <Link to="/admin/users" className="button button--ghost">
                User access
              </Link>
            )}
            <Link to="/stats/shared" className="button button--ghost">
              Shared links
            </Link>
            <Link to="/archive" className="button button--ghost">
              Archive
            </Link>
          </div>
        </div>
        <motion.div
          className="dashboard__stats"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          <MotionLink
            to="/stats/active"
            className="stat-card"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="stat-card__label">Active projects</p>
            <div className="stat-card__value">{activeProjects.length}</div>
            <p className="stat-card__meta">Total: {projects.length}</p>
          </MotionLink>
          <MotionLink
            to="/stats/focus"
            className="stat-card stat-card--focus"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="stat-card__label">Focus today</p>
            <div className="stat-card__value">{urgentProjects.length}</div>
            <p className="stat-card__meta">Tagged urgent</p>
          </MotionLink>
          <MotionLink
            to="/stats/due-soon"
            className="stat-card stat-card--warning"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="stat-card__label">Due soon</p>
            <div className="stat-card__value">{dueSoon.length}</div>
            <p className="stat-card__meta">Next 5 days</p>
          </MotionLink>
          <MotionLink
            to="/stats/overdue"
            className="stat-card stat-card--danger"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="stat-card__label">Overdue</p>
            <div className="stat-card__value">{overdue.length}</div>
            <p className="stat-card__meta">Needs attention</p>
          </MotionLink>
          <MotionLink
            to="/roadmaps"
            className="stat-card stat-card--roadmap"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="stat-card__label">Roadmaps</p>
            <div className="stat-card__value">{roadmaps.length}</div>
            <div className="stat-card__colors" aria-label="Roadmap project colors">
              {roadmapColors.length > 0 ? (
                roadmapColors.map((color) => (
                  <span key={color} className="stat-card__color-dot" style={{ backgroundColor: color }} />
                ))
              ) : (
                <span className="stat-card__meta">No roadmap projects yet</span>
              )}
            </div>
          </MotionLink>
        </motion.div>
        <div className="dashboard__timeline">
          <div className="timeline__header">
            <div>
              <p className="eyebrow">View</p>
              <h3>
                {view === 'timeline'
                  ? 'Delivery timeline'
                  : view === 'board'
                    ? 'Project board'
                    : view === 'calendar'
                      ? 'Project calendar'
                      : 'Project list'}
              </h3>
              <p className="muted">
                {view === 'timeline'
                  ? 'Drag projects to adjust start/end dates in the schedule.'
                  : view === 'board'
                    ? 'Drag cards between phases to update status.'
                    : view === 'calendar'
                      ? 'See start and due spans on the calendar.'
                      : 'Scan all active projects in one list.'}
              </p>
            </div>
            <div className="timeline__actions">
              {(view === 'timeline' || view === 'list') && (
                <div ref={filterRef} className={`timeline-filter${timelineFilterOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className={`timeline-filter__button${timelineFilterType !== 'none' ? ' is-active' : ''}`}
                    onClick={() => setTimelineFilterOpen((current) => !current)}
                    aria-label="Filter projects"
                  >
                    <Filter aria-hidden="true" />
                  </button>
                  {timelineFilterOpen && (
                    <div className="timeline-filter__panel">
                      <div className="timeline-filter__header">
                        <p className="timeline-filter__title">Filter by</p>
                        <button
                          type="button"
                          className="timeline-filter__close"
                          onClick={() => setTimelineFilterOpen(false)}
                          aria-label="Close filter"
                        >
                          ×
                        </button>
                      </div>
                      <div className="timeline-filter__options">
                        <button
                          type="button"
                          className={timelineFilterType === 'project_color' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('project_color')}
                        >
                          Project colors
                        </button>
                        <button
                          type="button"
                          className={timelineFilterType === 'tag' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('tag')}
                        >
                          Tag
                        </button>
                        <button
                          type="button"
                          className={timelineFilterType === 'client_name' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('client_name')}
                        >
                          Client name
                        </button>
                        <button
                          type="button"
                          className={timelineFilterType === 'client_email' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('client_email')}
                        >
                          Client email
                        </button>
                        <button
                          type="button"
                          className={timelineFilterType === 'service_type' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('service_type')}
                        >
                          Service type
                        </button>
                        <button
                          type="button"
                          className={timelineFilterType === 'plan_tier' ? 'is-active' : ''}
                          onClick={() => setTimelineFilterType('plan_tier')}
                        >
                          Plan tier
                        </button>
                      </div>
                      {timelineFilterType !== 'none' && (
                        <div className="timeline-filter__value">
                          <span>Value</span>
                          {timelineFilterType === 'project_color' ? (
                            <div className="timeline-filter__swatches">
                              {(timelineFilterValues.project_color ?? []).map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  className={`timeline-filter__swatch${
                                    timelineFilterValue === value ? ' is-active' : ''
                                  }`}
                                  onClick={() => setTimelineFilterValue(value)}
                                  style={{ backgroundColor: value }}
                                  aria-label={`Filter by color ${value}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <select
                              value={timelineFilterValue}
                              onChange={(event) => setTimelineFilterValue(event.target.value)}
                            >
                              {(timelineFilterValues[timelineFilterType] ?? []).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                      <div className="timeline-filter__actions">
                        <button
                          type="button"
                          className="ghost-link ghost-link--compact"
                          onClick={() => {
                            setTimelineFilterType('none')
                            setTimelineFilterValue('')
                          }}
                        >
                          Clear filter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={calendarRef} className={`timeline-calendar${calendarOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="timeline-filter__button timeline__icon-link"
                  aria-label="Calendar subscription"
                  onClick={() => setCalendarOpen((current) => !current)}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 4v4M16 4v4M4.5 9.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <rect x="4.5" y="6" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                {calendarOpen && (
                  <div className="timeline-calendar__panel">
                    <div className="timeline-calendar__header">
                      <p className="timeline-calendar__title">Calendar link</p>
                      <button
                        type="button"
                        className="timeline-calendar__close"
                        onClick={() => setCalendarOpen(false)}
                        aria-label="Close calendar link"
                      >
                        ×
                      </button>
                    </div>
                    <div className="timeline-calendar__link">
                      <input readOnly value={calendarFeedUrl || 'Loading...'} />
                      <button
                        type="button"
                        className="ghost-link ghost-link--compact"
                        onClick={handleCalendarCopy}
                        disabled={!calendarFeedUrl}
                      >
                        Copy
                      </button>
                    </div>
                    {calendarStatus && <p className="muted">{calendarStatus}</p>}
                  </div>
                )}
              </div>
              <div className="view-switcher" role="tablist" aria-label="Project views">
                <button
                  type="button"
                  className={`view-switcher__button${view === 'timeline' ? ' is-active' : ''}`}
                  onClick={() => handleViewChange('timeline')}
                >
                  Timeline
                </button>
                <button
                  type="button"
                  className={`view-switcher__button${view === 'board' ? ' is-active' : ''}`}
                  onClick={() => handleViewChange('board')}
                >
                  Board
                </button>
                <button
                  type="button"
                  className={`view-switcher__button${view === 'calendar' ? ' is-active' : ''}`}
                  onClick={() => handleViewChange('calendar')}
                >
                  Calendar
                </button>
                <button
                  type="button"
                  className={`view-switcher__button${view === 'list' ? ' is-active' : ''}`}
                  onClick={() => handleViewChange('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          {view === 'timeline' && (
            <>
              {timelineProjects.length === 0 && <p className="muted">Add due dates to see the timeline.</p>}
              {timelineProjects.length > 0 && (
                <div className="timeline-board" style={{ '--days': daysCount, '--day-size': `${daySize}px` } as CSSProperties}>
                  <div className="timeline-board__days">
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
                  <div className="timeline-board__rows">
                    {timelineProjects.map((project) => {
                      const offset = timelineOffsets[project.id] ?? 0
                      const shiftedStart = new Date(project.start.getTime() + offset * dayMs)
                      const shiftedEnd = new Date(project.end.getTime() + offset * dayMs)
                      const rawStartIndex = Math.round((shiftedStart.getTime() - baseStart.getTime()) / dayMs)
                      const rawEndIndex = Math.round((shiftedEnd.getTime() - baseStart.getTime()) / dayMs)
                      const startIndex = Math.max(0, Math.min(daysCount - 1, rawStartIndex))
                      const endIndex = Math.max(startIndex, Math.min(daysCount - 1, rawEndIndex))
                      const spanDays = endIndex - startIndex + 1
                      const width = spanDays * daySize
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
                            <span className="timeline-row__title">
                              <span
                                className="timeline-row__color"
                                style={{ '--project-color': getProjectColor(project, 'fallback') } as CSSProperties}
                                aria-hidden="true"
                              />
                              {project.title}
                            </span>
                            <span className="timeline-row__meta">{project.client_name ?? 'No client'}</span>
                            {project.tags && project.tags.length > 0 && (
                              <span className="timeline-row__tag">{[...project.tags].sort()[0]}</span>
                            )}
                          </div>
                          <div className="timeline-row__track timeline-project">
                            <div
                              className={`timeline-chip timeline-chip--${tone}${compactClass ? ` ${compactClass}` : ''}${
                                urgent ? ' timeline-chip--urgent' : ''
                              }${draggingProjectId === project.id ? ' is-dragging' : ''}`}
                              style={
                                {
                                  width,
                                  transform: `translateX(${startIndex * daySize}px)`,
                                  '--project-color': getProjectColor(project, 'fallback'),
                                  '--project-color-soft': hexToRgba(getProjectColor(project, 'fallback'), 0.18),
                                } as CSSProperties
                              }
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
                              <div className="timeline-chip__title">{project.service_type ?? statusLabel(project.status) ?? 'Project'}</div>
                              <div className="timeline-chip__client">{project.client_name ?? 'No client'}</div>
                              <div className="timeline-chip__meta">
                                {formatDate(shiftedStart.toISOString())} – {formatDate(shiftedEnd.toISOString())}
                              </div>
                              {(project.steps ?? []).some((step) => step.due_date && step.status !== 'done') && (() => {
                                const dueSteps = (project.steps ?? []).filter((step) => step.due_date && step.status !== 'done')
                                const visibleSteps = dueSteps.slice(0, 3)
                                const extraCount = Math.max(0, dueSteps.length - visibleSteps.length)
                                return (
                                  <div className="timeline-chip__steps">
                                    {visibleSteps.map((step) => (
                                      <div key={step.id} className="timeline-chip__step">
                                        <span className="timeline-chip__dot" aria-hidden="true" />
                                        <span className="timeline-chip__step-date">{formatDate(step.due_date)}</span>
                                        <span className="timeline-chip__step-name">{step.name}</span>
                                      </div>
                                    ))}
                                    {extraCount > 0 && (
                                      <span className="timeline-chip__steps-more">+{extraCount} more</span>
                                    )}
                                  </div>
                                )
                              })()}
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
            </>
          )}
          {view === 'board' && (
            <div className="board-view">
              {statusColumns.map((column) => {
                const columnProjects = boardProjects.filter((project) => project.status === column.id)
                return (
                  <div
                    key={column.id}
                    className={`board-column${dragOverStatus === column.id ? ' board-column--dragover' : ''}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDragEnter={() => setDragOverStatus(column.id)}
                    onDragLeave={() => setDragOverStatus(null)}
                    onDrop={() => {
                      if (draggingProjectId !== null) {
                        handleStatusDrop(column.id, draggingProjectId)
                        setDraggingProjectId(null)
                        setDragOverStatus(null)
                      }
                    }}
                  >
                    <div className="board-column__header">
                      <span>{column.label}</span>
                      <span className="board-column__count">{columnProjects.length}</span>
                    </div>
                    <div className="board-column__body">
                      {columnProjects.map((project) => (
                        <div
                          key={project.id}
                          className={`board-card board-card--${project.due ? getTone({ end: project.due }) : 'ok'}`}
                          draggable={!isCoarsePointer}
                          onDragStart={() => setDraggingProjectId(project.id)}
                          onDragEnd={() => setDraggingProjectId(null)}
                          style={{ '--project-color': getProjectColor(project, 'hash') } as CSSProperties}
                        >
                          <Link to={`/projects/${project.id}`} className="board-card__title">
                            {project.title}
                          </Link>
                          <span className="board-card__meta">{project.client_name ?? 'No client'}</span>
                          <span className="board-card__meta">Due {formatDate(project.due_date)}</span>
                          {project.tags && project.tags.length > 0 && (
                            <span className="board-card__tag">{project.tags.join(' · ')}</span>
                          )}
                          <select
                            className="board-card__status-select"
                            value={project.status ?? column.id}
                            onChange={(event) => handleStatusDrop(event.target.value, project.id)}
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            {statusColumns.map((option) => (
                              <option key={option.id} value={option.id}>
                                Move to {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {columnProjects.length === 0 && <p className="muted">No projects yet.</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {view === 'calendar' && (
            <div className="calendar-view">
              <div className="calendar-view__header">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() =>
                    calendarView === 'month'
                      ? setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                      : setCalendarAnchor(
                          new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth(), calendarAnchor.getDate() - 7),
                        )
                  }
                >
                  Prev
                </button>
                <div className="calendar-view__title">
                  <h4>
                    {calendarView === 'month'
                      ? calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : calendarAnchor.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </h4>
                  <div className="calendar-toggle">
                    <button
                      type="button"
                      className={`calendar-toggle__button${calendarView === 'month' ? ' is-active' : ''}`}
                      onClick={() => setCalendarView('month')}
                    >
                      Month
                    </button>
                    <button
                      type="button"
                      className={`calendar-toggle__button${calendarView === 'week' ? ' is-active' : ''}`}
                      onClick={() => setCalendarView('week')}
                    >
                      Week
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() =>
                    calendarView === 'month'
                      ? setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                      : setCalendarAnchor(
                          new Date(calendarAnchor.getFullYear(), calendarAnchor.getMonth(), calendarAnchor.getDate() + 7),
                        )
                  }
                >
                  Next
                </button>
              </div>
              <div className={`calendar-grid${calendarView === 'week' ? ' calendar-grid--week' : ''}`}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                  <div key={label} className="calendar-grid__weekday">
                    {label}
                  </div>
                ))}
                {calendarDays.map((day) => {
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth()
                  const dayProjects = calendarProjects.filter(
                    (project) => day >= project.spanStart && day <= project.spanEnd,
                  )
                  return (
                    <div
                      key={day.toISOString()}
                      className={`calendar-day${isCurrentMonth ? '' : ' calendar-day--muted'}`}
                    >
                      <span className="calendar-day__date">{day.getDate()}</span>
                      <div className="calendar-day__items">
                        {dayProjects.slice(0, maxCalendarItems).map((project) => {
                          const isStart = day.getTime() === project.spanStart.getTime()
                          const isEnd = day.getTime() === project.spanEnd.getTime()
                          return (
                            <Link
                              key={`${project.id}-${day.toISOString()}`}
                              to={`/projects/${project.id}`}
                              className={`calendar-item${isStart ? ' is-start' : ''}${isEnd ? ' is-end' : ''}`}
                              style={
                                {
                                  '--project-color': getProjectColor(project, 'hash'),
                                  backgroundColor: 'var(--project-color)',
                                  borderColor: 'var(--project-color)',
                                } as CSSProperties
                              }
                            >
                              {project.title}
                            </Link>
                          )
                        })}
                        {dayProjects.length > maxCalendarItems && (
                          <span className="calendar-item calendar-item--more">
                            +{dayProjects.length - maxCalendarItems} more
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {view === 'list' && (
            <div className="table">
              <div className="table__row table__row--header">
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('project')
                    setListSortDir((current) => (listSortKey === 'project' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Project
                </button>
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('client')
                    setListSortDir((current) => (listSortKey === 'client' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Client
                </button>
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('service')
                    setListSortDir((current) => (listSortKey === 'service' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Service
                </button>
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('status')
                    setListSortDir((current) => (listSortKey === 'status' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Status
                </button>
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('due')
                    setListSortDir((current) => (listSortKey === 'due' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Due
                </button>
                <button
                  type="button"
                  className="table__header-button"
                  onClick={() => {
                    setListSortKey('tags')
                    setListSortDir((current) => (listSortKey === 'tags' && current === 'asc' ? 'desc' : 'asc'))
                  }}
                >
                  Tags
                </button>
              </div>
              {listProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="table__row"
                  style={{ '--project-color': getProjectColor(project, 'fallback') } as CSSProperties}
                >
                  <span data-label="Project">
                    <span
                      className="project-dot"
                    />
                    {project.title}
                  </span>
                  <span data-label="Client">{project.client_name ?? '—'}</span>
                  <span data-label="Service">{project.service_type ?? '—'}</span>
                  <span data-label="Status">{statusLabel(project.status)}</span>
                  <span data-label="Due">{formatDateMonthDay(project.due_date)}</span>
                  <span data-label="Tags">{project.tags && project.tags.length > 0 ? project.tags.join(', ') : '—'}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {error && <div className="form-error">{error}</div>}
      </div>
    </Layout>
  )
}

export default Dashboard
