import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

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

router.get('/', async (_req, res) => {
  const templates = await query('SELECT * FROM workflow_templates ORDER BY id ASC')
  const steps = await query('SELECT * FROM workflow_steps ORDER BY position ASC')
  const templateIds = templates.rows.map((template) => template.id)
  const tagsByTemplate = new Map<number, string[]>()

  if (templateIds.length > 0) {
    const tagsResult = await query<{ template_id: number; tag: string }>(
      'SELECT template_id, tag FROM workflow_tags WHERE template_id = ANY($1)',
      [templateIds],
    )
    for (const row of tagsResult.rows) {
      const existing = tagsByTemplate.get(row.template_id) ?? []
      existing.push(row.tag)
      tagsByTemplate.set(row.template_id, existing)
    }
  }

  return res.json({
    templates: templates.rows.map((template) => ({
      ...template,
      tags: tagsByTemplate.get(template.id) ?? [],
    })),
    steps: steps.rows,
  })
})

router.post('/', async (req, res) => {
  const { name, description, steps, tags } = req.body as {
    name?: string
    description?: string
    steps?: Array<{ name: string; position: number; defaultOffsetDays?: number }>
    tags?: string[] | string
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

  const tagList = normalizeTags(tags)
  if (tagList.length > 0) {
    for (const tag of tagList) {
      await query('INSERT INTO workflow_tags (template_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING', [
        templateId,
        tag,
      ])
    }
  }

  return res.status(201).json({ template: template.rows[0] })
})

export default router
