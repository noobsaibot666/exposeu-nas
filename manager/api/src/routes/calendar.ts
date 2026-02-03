import { Router } from 'express'
import { nanoid } from 'nanoid'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const getUser = (req: { user?: unknown }) => req.user as { id: number }

const formatDate = (value: Date) =>
  `${value.getUTCFullYear()}${String(value.getUTCMonth() + 1).padStart(2, '0')}${String(value.getUTCDate()).padStart(2, '0')}`

const formatDateTime = (value: Date) =>
  `${formatDate(value)}T${String(value.getUTCHours()).padStart(2, '0')}${String(value.getUTCMinutes()).padStart(2, '0')}${String(value.getUTCSeconds()).padStart(2, '0')}Z`

const buildIcs = (events: Array<{ uid: string; summary: string; start: Date; end: Date; updated: Date }>) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Exposeu//Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-PUBLISHED-TTL:PT30M',
    'REFRESH-INTERVAL;VALUE=DURATION:PT30M',
  ]
  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${formatDateTime(event.updated)}`,
      `LAST-MODIFIED:${formatDateTime(event.updated)}`,
      `SUMMARY:${event.summary.replace(/\n/g, ' ')}`,
      `DTSTART;VALUE=DATE:${formatDate(event.start)}`,
      `DTEND;VALUE=DATE:${formatDate(event.end)}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

router.get('/token', requireAuth, async (req, res) => {
  const user = getUser(req)
  try {
    const existing = await query<{ calendar_token: string | null }>('SELECT calendar_token FROM users WHERE id = $1', [
      user.id,
    ])
    if (existing.rows[0]?.calendar_token) {
      return res.json({ token: existing.rows[0].calendar_token })
    }
    const token = nanoid(32)
    await query('UPDATE users SET calendar_token = $1 WHERE id = $2', [token, user.id])
    return res.json({ token })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create calendar token.'
    return res.status(500).json({ error: message })
  }
})

router.get('/project/:id', requireAuth, async (req, res) => {
  try {
    const user = getUser(req)
    const projectId = Number(req.params.id)
    const includeSteps = req.query.includeSteps === '1'
    const mode = req.query.mode === 'range' ? 'range' : 'due'

    const projects = await query(
      'SELECT id, title, start_date, due_date, updated_at, created_at FROM projects WHERE owner_user_id = $1 AND id = $2 AND status <> $3',
      [user.id, projectId, 'archive'],
    )
    const project = projects.rows[0]
    if (!project) return res.status(404).send('Not found')

    const steps = includeSteps
      ? await query(
          "SELECT id, project_id, name, due_date, status FROM project_steps WHERE project_id = $1 AND due_date IS NOT NULL AND COALESCE(status, 'pending') <> 'done'",
          [projectId],
        )
      : { rows: [] }

    const events: Array<{ uid: string; summary: string; start: Date; end: Date; updated: Date }> = []
    if (project.due_date) {
      const due = new Date(project.due_date)
      const start = mode === 'range' && project.start_date ? new Date(project.start_date) : due
      const end = new Date(due)
      end.setDate(end.getDate() + 1)
      events.push({
        uid: `project-${project.id}@exposeu`,
        summary: project.title,
        start,
        end,
        updated: new Date(project.updated_at ?? project.created_at),
      })
    }

    for (const step of steps.rows) {
      if (!step.due_date) continue
      const due = new Date(step.due_date)
      const end = new Date(due)
      end.setDate(end.getDate() + 1)
      events.push({
        uid: `step-${step.id}@exposeu`,
        summary: `${step.name}`,
        start: due,
        end,
        updated: new Date(),
      })
    }

    const ics = buildIcs(events)
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="project-calendar.ics"')
    return res.send(ics)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to build calendar.'
    return res.status(500).send(message)
  }
})

router.get('/:token', async (req, res) => {
  try {
    const token = String(req.params.token)
    const includeSteps = req.query.includeSteps === '1'
    const mode = req.query.mode === 'range' ? 'range' : 'due'
    const projectId = req.query.projectId ? Number(req.query.projectId) : null

    const userResult = await query<{ id: number }>('SELECT id FROM users WHERE calendar_token = $1', [token])
    const user = userResult.rows[0]
    if (!user) return res.status(404).send('Not found')

    const projects = projectId
      ? await query(
          'SELECT id, title, start_date, due_date, updated_at, created_at FROM projects WHERE owner_user_id = $1 AND id = $2 AND status <> $3',
          [user.id, projectId, 'archive'],
        )
      : await query(
          'SELECT id, title, start_date, due_date, updated_at, created_at FROM projects WHERE owner_user_id = $1 AND status <> $2',
          [user.id, 'archive'],
        )

    const projectIds = projects.rows.map((project) => project.id)
    const steps = includeSteps && projectIds.length
      ? await query(
          "SELECT id, project_id, name, due_date, status FROM project_steps WHERE project_id = ANY($1) AND due_date IS NOT NULL AND COALESCE(status, 'pending') <> 'done'",
          [projectIds],
        )
      : { rows: [] }

    const events: Array<{ uid: string; summary: string; start: Date; end: Date; updated: Date }> = []

    for (const project of projects.rows) {
      if (!project.due_date) continue
      const due = new Date(project.due_date)
      const start = mode === 'range' && project.start_date ? new Date(project.start_date) : due
      const end = new Date(due)
      end.setDate(end.getDate() + 1)
      events.push({
        uid: `project-${project.id}@exposeu`,
        summary: project.title,
        start,
        end,
        updated: new Date(project.updated_at ?? project.created_at),
      })
    }

    for (const step of steps.rows) {
      if (!step.due_date) continue
      const due = new Date(step.due_date)
      const end = new Date(due)
      end.setDate(end.getDate() + 1)
      events.push({
        uid: `step-${step.id}@exposeu`,
        summary: `${step.name}`,
        start: due,
        end,
        updated: new Date(),
      })
    }

    const ics = buildIcs(events)
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="exposeu-projects.ics"')
    return res.send(ics)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to build calendar.'
    return res.status(500).send(message)
  }
})

export default router
