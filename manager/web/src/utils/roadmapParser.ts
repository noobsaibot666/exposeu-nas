import { marked, type Tokens } from 'marked'

export type ImportedRoadmapPhase = {
  title: string
  goal?: string
  startDay?: number | null
  endDay?: number | null
  steps: string[]
  checkpoints: string[]
}

export type ImportedRoadmap = {
  title: string
  phases: ImportedRoadmapPhase[]
  metrics: string[]
  rules: string[]
  sourceType: 'markdown' | 'json'
}

const normalizeLine = (value: string) => value.replace(/\s+/g, ' ').trim()
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? normalizeLine(item) : ''))
        .filter((item) => item.length > 0)
    : []
const collectStepArraysFromRecord = (
  record: Record<string, unknown>,
  excludedKeys: string[] = [],
): string[] => {
  const excluded = new Set(excludedKeys)
  return Object.keys(record)
    .filter((key) => !excluded.has(key))
    .flatMap((key) => asStringArray(record[key]))
}

const tokenText = (tokens: Tokens.Generic[] | undefined): string => {
  if (!tokens || tokens.length === 0) return ''
  return normalizeLine(
    tokens
      .map((token) => {
        if ('text' in token && typeof token.text === 'string') return token.text
        if ('tokens' in token && Array.isArray(token.tokens)) return tokenText(token.tokens as Tokens.Generic[])
        return ''
      })
      .join(' '),
  )
}

const listItemText = (item: Tokens.ListItem): string => {
  if (Array.isArray(item.tokens) && item.tokens.length > 0) return tokenText(item.tokens as Tokens.Generic[])
  return normalizeLine(item.text || '')
}

export const parseRoadmapInput = (
  value: string,
  sourceType: 'markdown' | 'json',
  fallbackTitle = 'Roadmap',
): ImportedRoadmap => {
  if (sourceType === 'json') {
    const parsed = JSON.parse(value) as Record<string, unknown>
    const parsedPhases = Array.isArray(parsed.phases) ? parsed.phases : []
    const parsedDays = Array.isArray(parsed.days) ? parsed.days : []
    const parsedSteps = Array.isArray(parsed.steps) ? parsed.steps : []
    const parsedMonths = Object.keys(parsed)
      .filter((key) => /^month[_\s-]?\d+$/i.test(key))
      .map((key) => parsed[key])
      .filter(isRecord)

    let phases: ImportedRoadmapPhase[] = []

    if (parsedPhases.length > 0) {
      phases = parsedPhases
        .filter(isRecord)
        .map((phase, phaseIndex) => ({
          title:
            (typeof phase.title === 'string' && normalizeLine(phase.title)) || `Phase ${phaseIndex + 1}`,
          goal: typeof phase.goal === 'string' ? normalizeLine(phase.goal) : '',
          startDay:
            typeof phase.startDay === 'number'
              ? phase.startDay
              : typeof phase.start_day === 'number'
                ? phase.start_day
                : null,
          endDay:
            typeof phase.endDay === 'number'
              ? phase.endDay
              : typeof phase.end_day === 'number'
                ? phase.end_day
                : null,
          steps: Array.isArray(phase.steps)
            ? phase.steps.map((step, stepIndex) => {
                if (typeof step === 'string') return normalizeLine(step)
                if (isRecord(step) && typeof step.title === 'string') return normalizeLine(step.title)
                return `Step ${stepIndex + 1}`
              })
            : [],
          checkpoints: Array.isArray(phase.checkpoints)
            ? phase.checkpoints
                .map((checkpoint) => {
                  if (typeof checkpoint === 'string') return normalizeLine(checkpoint)
                  if (isRecord(checkpoint) && typeof checkpoint.title === 'string')
                    return normalizeLine(checkpoint.title)
                  return ''
                })
                .filter(Boolean)
            : [],
        }))
    } else if (parsedDays.length > 0) {
      phases = parsedDays
        .filter(isRecord)
        .map((day, index) => {
          const dayNumber = typeof day.day === 'number' ? day.day : null
          const checkpoints = [
            ...asStringArray(day.outcome),
            ...asStringArray(day.outcomes),
            ...asStringArray(day.checkpoints),
          ]
          const stepKeys = Object.keys(day).filter(
            (key) => !['day', 'label', 'title', 'goal', 'outcome', 'outcomes', 'checkpoints'].includes(key),
          )
          const steps = stepKeys.flatMap((key) => asStringArray(day[key]))
          return {
            title:
              (typeof day.label === 'string' && normalizeLine(day.label)) ||
              (typeof day.title === 'string' && normalizeLine(day.title)) ||
              `Day ${index + 1}`,
            goal: typeof day.goal === 'string' ? normalizeLine(day.goal) : '',
            startDay: dayNumber,
            endDay: dayNumber,
            steps,
            checkpoints,
          }
        })
    } else if (parsedSteps.length > 0) {
      phases = [
        {
          title:
            typeof parsed.title === 'string' && normalizeLine(parsed.title)
              ? `${normalizeLine(parsed.title)} phase`
              : 'Execution',
          goal: typeof parsed.goal === 'string' ? normalizeLine(parsed.goal) : '',
          startDay: null,
          endDay: null,
          steps: parsedSteps.map((step, index) => {
            if (typeof step === 'string') return normalizeLine(step)
            if (isRecord(step) && typeof step.title === 'string') return normalizeLine(step.title)
            return `Step ${index + 1}`
          }),
          checkpoints: asStringArray(parsed.checkpoints),
        },
      ]
    } else if (parsedMonths.length > 0) {
      const monthPhases: ImportedRoadmapPhase[] = []
      parsedMonths.forEach((month, monthIndex) => {
        const monthFocus =
          typeof month.focus === 'string' && normalizeLine(month.focus)
            ? normalizeLine(month.focus)
            : `Month ${monthIndex + 1}`
        const monthGoal = typeof month.goal === 'string' ? normalizeLine(month.goal) : ''
        const weeks = isRecord(month.weeks) ? month.weeks : null
        if (!weeks) {
          const steps = collectStepArraysFromRecord(month, ['focus', 'goal', 'weeks'])
          monthPhases.push({
            title: monthFocus,
            goal: monthGoal,
            startDay: null,
            endDay: null,
            steps,
            checkpoints: [],
          })
          return
        }
        Object.keys(weeks)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .forEach((weekKey) => {
            const week = weeks[weekKey]
            if (!isRecord(week)) return
            const title =
              (typeof week.title === 'string' && normalizeLine(week.title)) ||
              normalizeLine(weekKey.replace(/_/g, ' ')) ||
              'Week'
            const goal = typeof week.focus === 'string' ? normalizeLine(week.focus) : monthGoal
            const steps = collectStepArraysFromRecord(week, ['title', 'focus', 'method', 'output'])
            const checkpoints = [
              ...asStringArray(week.output),
              ...asStringArray(week.deliverables),
            ]
            if (typeof week.method === 'string' && normalizeLine(week.method)) {
              steps.unshift(`Method: ${normalizeLine(week.method)}`)
            }
            if (steps.length === 0 && typeof week.focus === 'string') {
              steps.push(normalizeLine(week.focus))
            }
            monthPhases.push({
              title: `${monthFocus} — ${title}`,
              goal,
              startDay: null,
              endDay: null,
              steps,
              checkpoints,
            })
          })
      })
      phases = monthPhases
    }

    const metrics = Array.isArray(parsed.metrics)
      ? parsed.metrics
          .map((metric) => (typeof metric === 'string' ? normalizeLine(metric) : ''))
          .filter(Boolean)
      : [
          ...asStringArray(parsed.end_of_week_state),
          ...(isRecord(parsed.final_outcome) ? asStringArray(parsed.final_outcome.deliverables) : []),
        ]
    const rules = Array.isArray(parsed.rules)
      ? parsed.rules.map((rule) => (typeof rule === 'string' ? normalizeLine(rule) : '')).filter(Boolean)
      : asStringArray(parsed.core_rules)
    const objective =
      typeof parsed.objective === 'string' && normalizeLine(parsed.objective)
        ? [normalizeLine(parsed.objective)]
        : typeof parsed.core_objective === 'string' && normalizeLine(parsed.core_objective)
          ? [normalizeLine(parsed.core_objective)]
        : []
    const duration =
      typeof parsed.duration === 'string' && normalizeLine(parsed.duration)
        ? [`Duration: ${normalizeLine(parsed.duration)}`]
        : []

    return {
      title:
        (typeof parsed.title === 'string' && normalizeLine(parsed.title)) ||
        (typeof parsed.roadmap_title === 'string' && normalizeLine(parsed.roadmap_title)) ||
        fallbackTitle,
      phases,
      metrics,
      rules: [...objective, ...duration, ...rules],
      sourceType: 'json',
    }
  }

  const tokens = marked.lexer(value, { gfm: true })
  let title = fallbackTitle
  const phases: ImportedRoadmapPhase[] = []
  const metrics: string[] = []
  const rules: string[] = []
  const fallbackSteps: string[] = []
  let section: 'steps' | 'checkpoints' | 'metrics' | 'rules' | null = null
  let currentPhase: ImportedRoadmapPhase | null = null

  const addPhase = (phaseTitle: string, startDay?: number | null, endDay?: number | null) => {
    currentPhase = {
      title: phaseTitle || `Phase ${phases.length + 1}`,
      goal: '',
      startDay: startDay ?? null,
      endDay: endDay ?? null,
      steps: [],
      checkpoints: [],
    }
    phases.push(currentPhase)
    section = 'steps'
  }

  for (const token of tokens) {
    if (token.type === 'heading') {
      const heading = normalizeLine(token.text)
      const lower = heading.toLowerCase()
      if (token.depth === 1) {
        title = heading || fallbackTitle
      } else if (token.depth === 2) {
        if (lower.includes('metric')) {
          section = 'metrics'
          currentPhase = null
        } else if (lower.includes('rule')) {
          section = 'rules'
          currentPhase = null
        } else {
          const rangeMatch = heading.match(/days?\s*(\d+)\s*[–-]\s*(\d+)/i)
          const startDay = rangeMatch ? Number(rangeMatch[1]) : null
          const endDay = rangeMatch ? Number(rangeMatch[2]) : null
          const cleanTitle = heading
            .replace(/phase\s*\d*\s*[—-]\s*/i, '')
            .replace(/\(.*\)/, '')
            .trim()
          addPhase(cleanTitle || heading, startDay, endDay)
        }
      }
      continue
    }

    if (token.type === 'paragraph') {
      const text = normalizeLine(token.text)
      if (!text) continue
      const lower = text.toLowerCase()
      if (lower.startsWith('checkpoint')) {
        section = 'checkpoints'
        continue
      }
      if (/^goal\s*:/i.test(text)) {
        if (currentPhase) currentPhase.goal = text.replace(/^goal\s*:/i, '').trim()
        continue
      }
      if (section === 'metrics') {
        metrics.push(text)
      } else if (section === 'rules') {
        rules.push(text)
      } else if (currentPhase) {
        currentPhase.steps.push(text)
      } else {
        fallbackSteps.push(text)
      }
      continue
    }

    if (token.type === 'list') {
      for (const item of token.items) {
        const text = listItemText(item)
        if (!text) continue
        if (section === 'metrics') metrics.push(text)
        else if (section === 'rules') rules.push(text)
        else if (currentPhase && section === 'checkpoints') currentPhase.checkpoints.push(text)
        else if (currentPhase) currentPhase.steps.push(text)
        else fallbackSteps.push(text)
      }
      continue
    }
  }

  if (phases.length === 0 && fallbackSteps.length > 0) {
    phases.push({
      title: 'Execution',
      goal: '',
      startDay: null,
      endDay: null,
      steps: fallbackSteps,
      checkpoints: [],
    })
  }

  return {
    title,
    phases,
    metrics,
    rules,
    sourceType: 'markdown',
  }
}
