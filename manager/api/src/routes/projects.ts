import { Router } from 'express'
import path from 'path'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { query } from '../db.js'

const router = Router()

const uploadDir = process.env.API_UPLOAD_DIR || '/uploads'
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: Number(process.env.API_MAX_UPLOAD_BYTES || 2147483648) },
})

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM projects ORDER BY created_at DESC')
  return res.json(result.rows)
})

router.post('/', async (req, res) => {
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
  } = req.body as Record<string, string>

  if (!title) {
    return res.status(400).json({ error: 'Title required.' })
  }

  const result = await query(
    `INSERT INTO projects
      (title, client_name, client_email, client_phone, service_type, plan_tier, status, start_date, due_date, notes, workflow_template_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      title,
      clientName || null,
      clientEmail || null,
      clientPhone || null,
      serviceType || null,
      planTier || null,
      status || 'briefing',
      startDate || null,
      dueDate || null,
      notes || null,
      workflowTemplateId ? Number(workflowTemplateId) : null,
    ],
  )

  const project = result.rows[0]

  if (project.workflow_template_id) {
    const templateSteps = await query(
      'SELECT name, position, default_offset_days FROM workflow_steps WHERE template_id = $1 ORDER BY position ASC',
      [project.workflow_template_id],
    )
    for (const step of templateSteps.rows as Array<{ name: string; position: number; default_offset_days: number }>) {
      await query(
        'INSERT INTO project_steps (project_id, name, position, due_date) VALUES ($1,$2,$3,$4)',
        [
          project.id,
          step.name,
          step.position,
          project.start_date
            ? new Date(new Date(project.start_date).getTime() + step.default_offset_days * 86400000)
            : null,
        ],
      )
    }
  }

  return res.status(201).json(project)
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const project = await query('SELECT * FROM projects WHERE id = $1', [id])
  if (!project.rows[0]) return res.status(404).json({ error: 'Not found.' })

  const steps = await query('SELECT * FROM project_steps WHERE project_id = $1 ORDER BY position ASC', [id])
  const files = await query('SELECT * FROM files WHERE project_id = $1 ORDER BY created_at DESC', [id])
  const deliveries = await query('SELECT * FROM deliveries WHERE project_id = $1 ORDER BY created_at DESC', [id])
  const timeLogs = await query('SELECT * FROM time_logs WHERE project_id = $1 ORDER BY logged_at DESC', [id])

  return res.json({
    project: project.rows[0],
    steps: steps.rows,
    files: files.rows,
    deliveries: deliveries.rows,
    timeLogs: timeLogs.rows,
  })
})

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { status, dueDate } = req.body as { status?: string; dueDate?: string }

  const result = await query(
    'UPDATE projects SET status = COALESCE($1, status), due_date = COALESCE($2, due_date), updated_at = NOW() WHERE id = $3 RETURNING *',
    [status || null, dueDate || null, id],
  )

  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  return res.json(result.rows[0])
})

router.post('/:id/files', upload.single('file'), async (req, res) => {
  const id = Number(req.params.id)
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
  const { status, dueDate, name } = req.body as { status?: string; dueDate?: string; name?: string }

  const result = await query(
    'UPDATE project_steps SET status = COALESCE($1, status), due_date = COALESCE($2, due_date), name = COALESCE($3, name) WHERE id = $4 AND project_id = $5 RETURNING *',
    [status || null, dueDate || null, name || null, stepId, id],
  )

  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  return res.json(result.rows[0])
})

router.delete('/:id/steps/:stepId', async (req, res) => {
  const id = Number(req.params.id)
  const stepId = Number(req.params.stepId)
  const result = await query('DELETE FROM project_steps WHERE id = $1 AND project_id = $2 RETURNING id', [stepId, id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  return res.json({ ok: true })
})

router.get('/:id/files/:fileId', async (req, res) => {
  const id = Number(req.params.id)
  const fileId = Number(req.params.fileId)
  const file = await query('SELECT filename, stored_path FROM files WHERE id = $1 AND project_id = $2', [fileId, id])
  const fileRow = file.rows[0]
  if (!fileRow) return res.status(404).json({ error: 'File not found.' })

  const resolved = path.resolve(uploadDir, path.basename(fileRow.stored_path))
  return res.download(resolved, fileRow.filename)
})

router.post('/:id/deliveries', async (req, res) => {
  const id = Number(req.params.id)
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
  const token = nanoid(10)
  const result = await query(
    'INSERT INTO share_links (project_id, token) VALUES ($1,$2) RETURNING token',
    [id, token],
  )

  return res.status(201).json({ token: result.rows[0].token })
})

export default router
