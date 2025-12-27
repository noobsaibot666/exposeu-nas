import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res) => {
  const templates = await query('SELECT * FROM workflow_templates ORDER BY id ASC')
  const steps = await query('SELECT * FROM workflow_steps ORDER BY position ASC')
  return res.json({ templates: templates.rows, steps: steps.rows })
})

router.post('/', async (req, res) => {
  const { name, description, steps } = req.body as {
    name?: string
    description?: string
    steps?: Array<{ name: string; position: number; defaultOffsetDays?: number }>
  }

  if (!name || !steps?.length) {
    return res.status(400).json({ error: 'Name and steps required.' })
  }

  const template = await query(
    'INSERT INTO workflow_templates (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null],
  )

  const templateId = template.rows[0].id
  for (const step of steps) {
    await query(
      'INSERT INTO workflow_steps (template_id, name, position, default_offset_days) VALUES ($1,$2,$3,$4)',
      [templateId, step.name, step.position, step.defaultOffsetDays ?? 0],
    )
  }

  return res.status(201).json({ template: template.rows[0] })
})

export default router
