import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

const getUser = (req: { user?: unknown }) => req.user as { id: number; is_admin?: boolean }
const isAdmin = (req: { user?: unknown }) => Boolean(getUser(req)?.is_admin)

type RoadmapPhaseInput = {
  title: string
  goal?: string | null
  position: number
  startDay?: number | null
  endDay?: number | null
  steps?: Array<{
    title: string
    position: number
    dueDate?: string | null
    status?: string
    notes?: string | null
    payload?: Record<string, unknown> | null
    content?: Record<string, unknown> | null
  }>
  checkpoints?: Array<{ title: string; position: number }>
}

const mapRoadmap = async (roadmapId: number) => {
  const roadmapResult = await query('SELECT * FROM roadmaps WHERE id = $1', [roadmapId])
  const roadmap = roadmapResult.rows[0]
  if (!roadmap) return null

  const phases = await query(
    'SELECT * FROM roadmap_phases WHERE roadmap_id = $1 ORDER BY position ASC',
    [roadmapId],
  )
  const phaseIds = phases.rows.map((phase) => phase.id)
  const steps = phaseIds.length
    ? await query('SELECT * FROM roadmap_steps WHERE roadmap_phase_id = ANY($1) ORDER BY position ASC', [phaseIds])
    : { rows: [] }
  const checkpoints = phaseIds.length
    ? await query('SELECT * FROM roadmap_checkpoints WHERE roadmap_phase_id = ANY($1) ORDER BY position ASC', [phaseIds])
    : { rows: [] }
  const metrics = await query('SELECT * FROM roadmap_metrics WHERE roadmap_id = $1 ORDER BY position ASC', [roadmapId])
  const rules = await query('SELECT * FROM roadmap_rules WHERE roadmap_id = $1 ORDER BY position ASC', [roadmapId])

  const stepsByPhase = new Map<number, typeof steps.rows>()
  for (const step of steps.rows) {
    const existing = stepsByPhase.get(step.roadmap_phase_id) ?? []
    existing.push(step)
    stepsByPhase.set(step.roadmap_phase_id, existing)
  }

  const checkpointsByPhase = new Map<number, typeof checkpoints.rows>()
  for (const checkpoint of checkpoints.rows) {
    const existing = checkpointsByPhase.get(checkpoint.roadmap_phase_id) ?? []
    existing.push(checkpoint)
    checkpointsByPhase.set(checkpoint.roadmap_phase_id, existing)
  }

  return {
    roadmap,
    phases: phases.rows.map((phase) => ({
      ...phase,
      steps: stepsByPhase.get(phase.id) ?? [],
      checkpoints: checkpointsByPhase.get(phase.id) ?? [],
    })),
    metrics: metrics.rows,
    rules: rules.rows,
  }
}

router.get('/', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const projectId = req.query.projectId ? Number(req.query.projectId) : null

  const rows = projectId
    ? await query(
        `SELECT roadmaps.*, projects.title as project_title, projects.project_color
         FROM roadmaps
         JOIN projects ON projects.id = roadmaps.project_id
         WHERE roadmaps.project_id = $1 AND ($2::boolean OR projects.owner_user_id = $3)
         ORDER BY roadmaps.created_at DESC`,
        [projectId, admin, user.id],
      )
    : await query(
        `SELECT roadmaps.*, projects.title as project_title, projects.project_color
         FROM roadmaps
         JOIN projects ON projects.id = roadmaps.project_id
         WHERE ($1::boolean OR projects.owner_user_id = $2)
         ORDER BY roadmaps.created_at DESC`,
        [admin, user.id],
      )

  return res.json(rows.rows)
})

router.get('/:id', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const id = Number(req.params.id)
  const roadmap = await query(
    `SELECT roadmaps.*
     FROM roadmaps
     JOIN projects ON projects.id = roadmaps.project_id
     WHERE roadmaps.id = $1 AND ($2::boolean OR projects.owner_user_id = $3)`,
    [id, admin, user.id],
  )
  if (!roadmap.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const data = await mapRoadmap(id)
  return res.json(data)
})

router.post('/', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const {
    projectId,
    title,
    sourceType,
    autoSchedule,
    phases,
    metrics,
    rules,
  } = req.body as {
    projectId: number
    title: string
    sourceType?: string
    autoSchedule?: boolean
    phases?: RoadmapPhaseInput[]
    metrics?: Array<{ title: string; position: number }>
    rules?: Array<{ title: string; position: number }>
  }

  if (!projectId || !title) return res.status(400).json({ error: 'Project and title required.' })
  const project = await query(
    'SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)',
    [projectId, admin, user.id],
  )
  if (!project.rows[0]) return res.status(404).json({ error: 'Project not found.' })

  const roadmap = await query(
    'INSERT INTO roadmaps (project_id, title, source_type, auto_schedule) VALUES ($1,$2,$3,$4) RETURNING *',
    [projectId, title, sourceType || 'markdown', autoSchedule ?? false],
  )
  const roadmapId = roadmap.rows[0].id

  if (phases?.length) {
    for (const phase of phases) {
      const phaseResult = await query(
        'INSERT INTO roadmap_phases (roadmap_id, title, goal, position, start_day, end_day) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [roadmapId, phase.title, phase.goal || null, phase.position, phase.startDay ?? null, phase.endDay ?? null],
      )
      const phaseId = phaseResult.rows[0].id
      if (phase.steps?.length) {
        for (const step of phase.steps) {
          await query(
            'INSERT INTO roadmap_steps (roadmap_phase_id, title, position, due_date, status, notes, payload) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            [
              phaseId,
              step.title,
              step.position,
              step.dueDate ?? null,
              step.status || 'pending',
              step.notes ?? null,
              step.payload ?? step.content ?? {},
            ],
          )
        }
      }
      if (phase.checkpoints?.length) {
        for (const checkpoint of phase.checkpoints) {
          await query(
            'INSERT INTO roadmap_checkpoints (roadmap_phase_id, title, position) VALUES ($1,$2,$3)',
            [phaseId, checkpoint.title, checkpoint.position],
          )
        }
      }
    }
  }

  if (metrics?.length) {
    for (const metric of metrics) {
      await query(
        'INSERT INTO roadmap_metrics (roadmap_id, title, position) VALUES ($1,$2,$3)',
        [roadmapId, metric.title, metric.position],
      )
    }
  }

  if (rules?.length) {
    for (const rule of rules) {
      await query(
        'INSERT INTO roadmap_rules (roadmap_id, title, position) VALUES ($1,$2,$3)',
        [roadmapId, rule.title, rule.position],
      )
    }
  }

  const data = await mapRoadmap(roadmapId)
  return res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const id = Number(req.params.id)
  const {
    title,
    autoSchedule,
    phases,
    metrics,
    rules,
  } = req.body as {
    title?: string
    autoSchedule?: boolean
    phases?: RoadmapPhaseInput[]
    metrics?: Array<{ title: string; position: number }>
    rules?: Array<{ title: string; position: number }>
  }

  const roadmap = await query(
    `SELECT roadmaps.*
     FROM roadmaps
     JOIN projects ON projects.id = roadmaps.project_id
     WHERE roadmaps.id = $1 AND ($2::boolean OR projects.owner_user_id = $3)`,
    [id, admin, user.id],
  )
  if (!roadmap.rows[0]) return res.status(404).json({ error: 'Not found.' })

  if (title || autoSchedule !== undefined) {
    await query(
      'UPDATE roadmaps SET title = COALESCE($1, title), auto_schedule = COALESCE($2, auto_schedule), updated_at = NOW() WHERE id = $3',
      [title || null, autoSchedule ?? null, id],
    )
  }

  await query('DELETE FROM roadmap_phases WHERE roadmap_id = $1', [id])
  await query('DELETE FROM roadmap_metrics WHERE roadmap_id = $1', [id])
  await query('DELETE FROM roadmap_rules WHERE roadmap_id = $1', [id])

  if (phases?.length) {
    for (const phase of phases) {
      const phaseResult = await query(
        'INSERT INTO roadmap_phases (roadmap_id, title, goal, position, start_day, end_day) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [id, phase.title, phase.goal || null, phase.position, phase.startDay ?? null, phase.endDay ?? null],
      )
      const phaseId = phaseResult.rows[0].id
      if (phase.steps?.length) {
        for (const step of phase.steps) {
          await query(
            'INSERT INTO roadmap_steps (roadmap_phase_id, title, position, due_date, status, notes, payload) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            [
              phaseId,
              step.title,
              step.position,
              step.dueDate ?? null,
              step.status || 'pending',
              step.notes ?? null,
              step.payload ?? step.content ?? {},
            ],
          )
        }
      }
      if (phase.checkpoints?.length) {
        for (const checkpoint of phase.checkpoints) {
          await query(
            'INSERT INTO roadmap_checkpoints (roadmap_phase_id, title, position) VALUES ($1,$2,$3)',
            [phaseId, checkpoint.title, checkpoint.position],
          )
        }
      }
    }
  }

  if (metrics?.length) {
    for (const metric of metrics) {
      await query(
        'INSERT INTO roadmap_metrics (roadmap_id, title, position) VALUES ($1,$2,$3)',
        [id, metric.title, metric.position],
      )
    }
  }

  if (rules?.length) {
    for (const rule of rules) {
      await query(
        'INSERT INTO roadmap_rules (roadmap_id, title, position) VALUES ($1,$2,$3)',
        [id, rule.title, rule.position],
      )
    }
  }

  const data = await mapRoadmap(id)
  return res.json(data)
})

router.delete('/:id', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const id = Number(req.params.id)
  const roadmap = await query(
    `SELECT roadmaps.*
     FROM roadmaps
     JOIN projects ON projects.id = roadmaps.project_id
     WHERE roadmaps.id = $1 AND ($2::boolean OR projects.owner_user_id = $3)`,
    [id, admin, user.id],
  )
  if (!roadmap.rows[0]) return res.status(404).json({ error: 'Not found.' })
  await query('DELETE FROM roadmaps WHERE id = $1', [id])
  return res.status(204).send()
})

export default router
