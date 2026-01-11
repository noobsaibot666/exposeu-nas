import { Router } from 'express'
import path from 'path'
import fs from 'fs/promises'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { query } from '../db.js'

const router = Router()

const uploadDir = process.env.API_UPLOAD_DIR || '/uploads'
const getUser = (req: { user?: unknown }) => req.user as { id: number; is_admin?: boolean }
const isAdmin = (req: { user?: unknown }) => Boolean(getUser(req)?.is_admin)
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: Number(process.env.API_MAX_UPLOAD_BYTES || 2147483648) },
})

const normalizeTags = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag).trim())
      .filter((tag) => tag.length > 0)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }
  return []
}

router.get('/', async (req, res) => {
  const user = getUser(req)
  const admin = isAdmin(req)
  const result = await query(
    'SELECT * FROM projects WHERE ($1::boolean OR owner_user_id = $2) ORDER BY created_at DESC',
    [admin, user.id],
  )
  const projects = result.rows
  const projectIds = projects.map((project) => project.id)
  const tagsByProject = new Map<number, string[]>()
  const reviewsByProject = new Map<number, Record<string, unknown>>()
  const shareLinksByProject = new Map<number, Array<{ token: string; created_at: string; expires_at: string | null }>>()

  if (projectIds.length > 0) {
    const tagsResult = await query<{ project_id: number; tag: string }>(
      'SELECT project_id, tag FROM project_tags WHERE project_id = ANY($1)',
      [projectIds],
    )
    for (const row of tagsResult.rows) {
      const existing = tagsByProject.get(row.project_id) ?? []
      existing.push(row.tag)
      tagsByProject.set(row.project_id, existing)
    }

    const reviewsResult = await query<{
      project_id: number
      delivered_on_time: boolean | null
      flow_issues: string | null
      review_notes: string | null
      learnings: string | null
      created_at: string
      updated_at: string
    }>(
      'SELECT project_id, delivered_on_time, flow_issues, review_notes, learnings, created_at, updated_at FROM project_reviews WHERE project_id = ANY($1)',
      [projectIds],
    )
    for (const row of reviewsResult.rows) {
      reviewsByProject.set(row.project_id, {
        delivered_on_time: row.delivered_on_time,
        flow_issues: row.flow_issues,
        review_notes: row.review_notes,
        learnings: row.learnings,
        created_at: row.created_at,
        updated_at: row.updated_at,
      })
    }

    const shareLinksResult = await query<{
      project_id: number
      token: string
      created_at: string
      expires_at: string | null
    }>(
      'SELECT project_id, token, created_at, expires_at FROM share_links WHERE project_id = ANY($1) ORDER BY created_at DESC',
      [projectIds],
    )
    for (const row of shareLinksResult.rows) {
      const existing = shareLinksByProject.get(row.project_id) ?? []
      existing.push({
        token: row.token,
        created_at: row.created_at,
        expires_at: row.expires_at,
      })
      shareLinksByProject.set(row.project_id, existing)
    }
  }

  return res.json(
    projects.map((project) => ({
      ...project,
      tags: tagsByProject.get(project.id) ?? [],
      review: reviewsByProject.get(project.id) ?? null,
      share_links: shareLinksByProject.get(project.id) ?? [],
    })),
  )
})

router.post('/', async (req, res) => {
  const user = getUser(req)
  const {
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
    workflowTemplateId,
    tags,
    projectColor,
  } = req.body as Record<string, string | string[] | undefined>

  if (!title) {
    return res.status(400).json({ error: 'Title required.' })
  }

  const result = await query(
    `INSERT INTO projects
      (owner_user_id, title, client_name, client_email, client_phone, service_type, plan_tier, project_color, status, start_date, due_date, notes, workflow_template_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      user.id,
      title,
      clientName || null,
      clientEmail || null,
      clientPhone || null,
      serviceType || null,
      planTier || null,
      projectColor || null,
      status || 'briefing',
      startDate || null,
      dueDate || null,
      notes || null,
      workflowTemplateId ? Number(workflowTemplateId) : null,
    ],
  )

  const project = result.rows[0]
  const tagList = normalizeTags(tags)
  if (tagList.length > 0) {
    for (const tag of tagList) {
      await query('INSERT INTO project_tags (project_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING', [
        project.id,
        tag,
      ])
    }
  }

  if (project.workflow_template_id) {
    const templateSteps = await query(
      'SELECT name, position, default_offset_days FROM workflow_steps WHERE template_id = $1 ORDER BY position ASC',
      [project.workflow_template_id],
    )
    for (const step of templateSteps.rows as Array<{ name: string; position: number; default_offset_days: number }>) {
      await query(
        'INSERT INTO project_steps (project_id, name, position, due_date, offset_days) VALUES ($1,$2,$3,$4,$5)',
        [
          project.id,
          step.name,
          step.position,
          project.start_date
            ? new Date(new Date(project.start_date).getTime() + step.default_offset_days * 86400000)
            : null,
          step.default_offset_days ?? 0,
        ],
      )
    }
  }

  return res.status(201).json(project)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT * FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })

  const tagsResult = await query<{ tag: string }>('SELECT tag FROM project_tags WHERE project_id = $1', [id])
  const steps = await query('SELECT * FROM project_steps WHERE project_id = $1 ORDER BY position ASC', [id])
  const files = await query('SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC', [id])
  const deliveries = await query('SELECT * FROM deliveries WHERE project_id = $1 ORDER BY created_at DESC', [id])
  const timeLogs = await query('SELECT * FROM time_logs WHERE project_id = $1 ORDER BY logged_at DESC', [id])
  const review = await query(
    'SELECT delivered_on_time, flow_issues, review_notes, learnings, created_at, updated_at FROM project_reviews WHERE project_id = $1',
    [id],
  )
  const budget = await query(
    'SELECT * FROM budgets WHERE project_id = $1 ORDER BY archived ASC, created_at DESC LIMIT 1',
    [id],
  )
  const budgetRow = budget.rows[0] ?? null
  const budgetSteps = budgetRow
    ? await query(
        `SELECT
            budget_steps.id,
            budget_steps.project_step_id,
            COALESCE(project_steps.name, budget_steps.step_name) as step_name,
            COALESCE(project_steps.position, budget_steps.step_position) as step_position,
            budget_steps.cost_amount,
            budget_steps.vendor_name,
            budget_steps.vendor_cost,
            budget_steps.created_at,
            budget_steps.updated_at
          FROM budget_steps
          LEFT JOIN project_steps ON budget_steps.project_step_id = project_steps.id
          WHERE budget_steps.budget_id = $1
          ORDER BY step_position ASC NULLS LAST, budget_steps.id ASC`,
        [budgetRow.id],
      )
    : { rows: [] }

  return res.json({
    project: { ...project.rows[0], tags: tagsResult.rows.map((row) => row.tag), review: review.rows[0] ?? null },
    steps: steps.rows,
    files: files.rows,
    deliveries: deliveries.rows,
    timeLogs: timeLogs.rows,
    budget: budgetRow,
    budgetSteps: budgetSteps.rows,
  })
})

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const { status, dueDate, startDate, notes, tags, clientName, clientEmail, clientPhone, serviceType, planTier, projectColor } = req.body as {
    status?: string
    dueDate?: string
    startDate?: string
    notes?: string
    tags?: string[] | string
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    serviceType?: string
    planTier?: string
    projectColor?: string
  }

  const result = await query(
    `UPDATE projects
     SET status = COALESCE($1, status),
         due_date = COALESCE($2, due_date),
         start_date = COALESCE($3, start_date),
         notes = COALESCE($4, notes),
         client_name = COALESCE($5, client_name),
         client_email = COALESCE($6, client_email),
         client_phone = COALESCE($7, client_phone),
         service_type = COALESCE($8, service_type),
         plan_tier = COALESCE($9, plan_tier),
         project_color = COALESCE($10, project_color),
         completed_at = CASE
           WHEN COALESCE($1, status) = 'archive' AND completed_at IS NULL THEN NOW()
           ELSE completed_at
         END,
         updated_at = NOW()
     WHERE id = $11 AND ($12::boolean OR owner_user_id = $13)
     RETURNING *`,
    [
      status || null,
      dueDate || null,
      startDate || null,
      notes || null,
      clientName || null,
      clientEmail || null,
      clientPhone || null,
      serviceType || null,
      planTier || null,
      projectColor || null,
      id,
      admin,
      user.id,
    ],
  )

  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  await query('UPDATE budgets SET project_title = $1, updated_at = NOW() WHERE project_id = $2', [
    result.rows[0].title,
    id,
  ])

  if (tags !== undefined) {
    const tagList = normalizeTags(tags)
    await query('DELETE FROM project_tags WHERE project_id = $1', [id])
    for (const tag of tagList) {
      await query('INSERT INTO project_tags (project_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, tag])
    }
  }

  return res.json(result.rows[0])
})

router.patch('/:id/review', async (req, res) => {
  const id = Number(req.params.id)
  const { deliveredOnTime, flowIssues, reviewNotes, learnings } = req.body as {
    deliveredOnTime?: boolean | null
    flowIssues?: string | null
    reviewNotes?: string | null
    learnings?: string | null
  }

  const result = await query(
    `INSERT INTO project_reviews
      (project_id, delivered_on_time, flow_issues, review_notes, learnings, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (project_id)
     DO UPDATE SET
       delivered_on_time = EXCLUDED.delivered_on_time,
       flow_issues = EXCLUDED.flow_issues,
       review_notes = EXCLUDED.review_notes,
       learnings = EXCLUDED.learnings,
       updated_at = NOW()
     RETURNING *`,
    [id, deliveredOnTime ?? null, flowIssues ?? null, reviewNotes ?? null, learnings ?? null],
  )

  return res.json(result.rows[0])
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const files = await query<{ stored_path: string }>('SELECT stored_path FROM files WHERE project_id = $1', [id])

  await query('DELETE FROM project_reviews WHERE project_id = $1', [id])
  await query('DELETE FROM share_links WHERE project_id = $1', [id])
  await query('DELETE FROM project_tags WHERE project_id = $1', [id])
  await query('DELETE FROM project_steps WHERE project_id = $1', [id])
  await query('DELETE FROM deliveries WHERE project_id = $1', [id])
  await query('DELETE FROM time_logs WHERE project_id = $1', [id])
  await query('DELETE FROM files WHERE project_id = $1', [id])

  const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })

  for (const file of files.rows) {
    const resolved = path.resolve(uploadDir, path.basename(file.stored_path))
    try {
      await fs.unlink(resolved)
    } catch {
      // Best effort cleanup.
    }
  }

  return res.json({ ok: true })
})

router.post('/:id/files', upload.single('file'), async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

  const { originalname, filename, size, mimetype } = req.file
  const storedPath = `${uploadDir}/${filename}`

  const result = await query(
    'INSERT INTO files (project_id, filename, stored_path, size_bytes, mime_type) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, originalname, storedPath, size, mimetype || null],
  )

  return res.status(201).json(result.rows[0])
})

router.post('/:id/steps', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const { name, dueDate } = req.body as { name?: string; dueDate?: string }
  if (!name) return res.status(400).json({ error: 'Name required.' })

  const maxPosition = await query<{ max: number }>('SELECT COALESCE(MAX(position), 0) as max FROM project_steps WHERE project_id = $1', [id])
  const position = (maxPosition.rows[0]?.max ?? 0) + 1

  const result = await query(
    'INSERT INTO project_steps (project_id, name, position, due_date, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, name, position, dueDate || null, 'pending'],
  )

  return res.status(201).json(result.rows[0])
})

router.patch('/:id/steps/:stepId', async (req, res) => {
  const id = Number(req.params.id)
  const stepId = Number(req.params.stepId)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const { status, dueDate, name } = req.body as { status?: string; dueDate?: string; name?: string }

  const result = await query(
    'UPDATE project_steps SET status = COALESCE($1, status), due_date = COALESCE($2, due_date), name = COALESCE($3, name) WHERE id = $4 AND project_id = $5 RETURNING *',
    [status || null, dueDate || null, name || null, stepId, id],
  )

  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  if (name || result.rows[0].name) {
    await query(
      'UPDATE budget_steps SET step_name = COALESCE($1, step_name), step_position = COALESCE($2, step_position), updated_at = NOW() WHERE project_step_id = $3',
      [name || result.rows[0].name, result.rows[0].position ?? null, stepId],
    )
  }
  return res.json(result.rows[0])
})

router.delete('/:id/steps/:stepId', async (req, res) => {
  const id = Number(req.params.id)
  const stepId = Number(req.params.stepId)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const result = await query('DELETE FROM project_steps WHERE id = $1 AND project_id = $2 RETURNING id', [stepId, id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  return res.json({ ok: true })
})

router.get('/:id/files/:fileId', async (req, res) => {
  const id = Number(req.params.id)
  const fileId = Number(req.params.fileId)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const file = await query('SELECT filename, stored_path FROM files WHERE id = $1 AND project_id = $2', [fileId, id])
  const fileRow = file.rows[0]
  if (!fileRow) return res.status(404).json({ error: 'File not found.' })

  const resolved = path.resolve(uploadDir, path.basename(fileRow.stored_path))
  return res.download(resolved, fileRow.filename)
})

router.post('/:id/deliveries', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const { title, url } = req.body as { title?: string; url?: string }
  if (!title || !url) return res.status(400).json({ error: 'Title and url required.' })

  const result = await query(
    'INSERT INTO deliveries (project_id, title, url) VALUES ($1,$2,$3) RETURNING *',
    [id, title, url],
  )

  return res.status(201).json(result.rows[0])
})

router.post('/:id/time-logs', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const { minutes, note } = req.body as { minutes?: number; note?: string }
  if (!minutes) return res.status(400).json({ error: 'Minutes required.' })

  const result = await query(
    'INSERT INTO time_logs (project_id, minutes, note) VALUES ($1,$2,$3) RETURNING *',
    [id, minutes, note || null],
  )

  return res.status(201).json(result.rows[0])
})

router.post('/:id/share', async (req, res) => {
  const id = Number(req.params.id)
  const user = getUser(req)
  const admin = isAdmin(req)
  const project = await query('SELECT id FROM projects WHERE id = $1 AND ($2::boolean OR owner_user_id = $3)', [
    id,
    admin,
    user.id,
  ])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })
  const token = nanoid(10)
  const result = await query(
    'INSERT INTO share_links (project_id, token) VALUES ($1,$2) RETURNING token',
    [id, token],
  )

  return res.status(201).json({ token: result.rows[0].token })
})

export default router
