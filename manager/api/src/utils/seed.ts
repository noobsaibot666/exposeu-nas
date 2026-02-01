import { query } from '../db.js'

export async function ensureDefaultWorkflow() {
  const existing = await query('SELECT id FROM workflow_templates LIMIT 1')
  if (existing.rows[0]) return

  const standard = await query(
    'INSERT INTO workflow_templates (name, description) VALUES ($1, $2) RETURNING id',
    ['Standard workflow', 'Simple 3-step flow'],
  )
  const standardSteps = [
    { name: 'Plan', position: 1, offset: 0 },
    { name: 'Produce', position: 2, offset: 7 },
    { name: 'Deliver', position: 3, offset: 14 },
  ]
  for (const step of standardSteps) {
    await query(
      'INSERT INTO workflow_steps (template_id, name, position, default_offset_days, default_cost) VALUES ($1,$2,$3,$4,$5)',
      [standard.rows[0].id, step.name, step.position, step.offset, 0],
    )
  }

  const film = await query(
    'INSERT INTO workflow_templates (name, description) VALUES ($1, $2) RETURNING id',
    ['Film production workflow', 'Briefing to delivery'],
  )
  const filmSteps = [
    { name: 'Briefing', position: 1, offset: 0 },
    { name: 'Scheduled', position: 2, offset: 3 },
    { name: 'Shoot', position: 3, offset: 7 },
    { name: 'Edit', position: 4, offset: 14 },
    { name: 'Review', position: 5, offset: 18 },
    { name: 'Delivery', position: 6, offset: 21 },
    { name: 'Archive', position: 7, offset: 28 },
  ]
  for (const step of filmSteps) {
    await query(
      'INSERT INTO workflow_steps (template_id, name, position, default_offset_days, default_cost) VALUES ($1,$2,$3,$4,$5)',
      [film.rows[0].id, step.name, step.position, step.offset, 0],
    )
  }
}
