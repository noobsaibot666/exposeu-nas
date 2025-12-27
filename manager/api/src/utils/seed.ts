import { query } from '../db.js'

export async function ensureDefaultWorkflow() {
  const existing = await query('SELECT id FROM workflow_templates LIMIT 1')
  if (existing.rows[0]) return

  const template = await query(
    'INSERT INTO workflow_templates (name, description) VALUES ($1, $2) RETURNING id',
    ['Default workflow', 'Briefing to delivery'],
  )

  const templateId = template.rows[0].id
  const steps = [
    { name: 'Briefing', position: 1, offset: 0 },
    { name: 'Scheduled', position: 2, offset: 3 },
    { name: 'Shoot', position: 3, offset: 7 },
    { name: 'Edit', position: 4, offset: 14 },
    { name: 'Review', position: 5, offset: 18 },
    { name: 'Delivery', position: 6, offset: 21 },
    { name: 'Archive', position: 7, offset: 28 },
  ]

  for (const step of steps) {
    await query(
      'INSERT INTO workflow_steps (template_id, name, position, default_offset_days) VALUES ($1,$2,$3,$4)',
      [templateId, step.name, step.position, step.offset],
    )
  }
}
