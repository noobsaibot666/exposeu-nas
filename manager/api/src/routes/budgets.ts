import { Router } from 'express'
import { query } from '../db.js'

type BudgetStepInput = {
  projectStepId?: number | null
  stepName?: string | null
  stepPosition?: number | null
  costAmount?: number | string | null
  vendorName?: string | null
  vendorCost?: number | string | null
}

const router = Router()

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return null
  return parsed
}

router.get('/', async (req, res) => {
  const includeArchived = String(req.query.includeArchived ?? 'false') === 'true'
  const projectId = req.query.projectId ? Number(req.query.projectId) : null

  const budgetsResult = await query<{
    id: number
    project_id: number | null
    project_title: string | null
    production_budget: string
    profit_budget: string
    vat_amount: string | null
    notes: string | null
    archived: boolean
    created_at: string
    updated_at: string
  }>(
    `SELECT *
     FROM budgets
     WHERE ($1::int IS NULL OR project_id = $1)
       AND ($2::boolean OR archived = false)
     ORDER BY created_at DESC`,
    [projectId, includeArchived],
  )

  const budgets = budgetsResult.rows
  const budgetIds = budgets.map((budget) => budget.id)
  const totalsByBudget = new Map<number, { spent_total: number; vendor_total: number }>()

  if (budgetIds.length > 0) {
    const totalsResult = await query<{ budget_id: number; spent_total: string; vendor_total: string }>(
      `SELECT budget_id,
              COALESCE(SUM(cost_amount), 0) as spent_total,
              COALESCE(SUM(vendor_cost), 0) as vendor_total
       FROM budget_steps
       WHERE budget_id = ANY($1)
       GROUP BY budget_id`,
      [budgetIds],
    )
    for (const row of totalsResult.rows) {
      totalsByBudget.set(row.budget_id, {
        spent_total: Number(row.spent_total),
        vendor_total: Number(row.vendor_total),
      })
    }
  }

  return res.json(
    budgets.map((budget) => ({
      ...budget,
      spent_total: totalsByBudget.get(budget.id)?.spent_total ?? 0,
      vendor_total: totalsByBudget.get(budget.id)?.vendor_total ?? 0,
    })),
  )
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const budgetResult = await query('SELECT * FROM budgets WHERE id = $1', [id])
  const budget = budgetResult.rows[0]
  if (!budget) return res.status(404).json({ error: 'Not found.' })

  const stepsResult = await query<{
    id: number
    project_step_id: number | null
    step_name: string
    step_position: number | null
    cost_amount: string | null
    vendor_name: string | null
    vendor_cost: string | null
    created_at: string
    updated_at: string
  }>(
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
    [id],
  )

  return res.json({
    budget,
    steps: stepsResult.rows,
  })
})

router.post('/', async (req, res) => {
  const { projectId, productionBudget, profitBudget, vatAmount, notes, steps } = req.body as {
    projectId?: number
    productionBudget?: number | string
    profitBudget?: number | string
    vatAmount?: number | string
    notes?: string | null
    steps?: BudgetStepInput[]
  }

  if (!projectId) {
    return res.status(400).json({ error: 'Project id required.' })
  }

  const production = toNumber(productionBudget)
  const profit = toNumber(profitBudget)
  const vat = toNumber(vatAmount) ?? 0

  if (production === null || profit === null) {
    return res.status(400).json({ error: 'Production and profit budgets are required.' })
  }

  const existing = await query<{ id: number }>(
    'SELECT id FROM budgets WHERE project_id = $1 AND archived = false',
    [projectId],
  )
  if (existing.rows[0]) {
    return res.status(409).json({ error: 'Active budget already exists.' })
  }

  const projectResult = await query<{ title: string }>('SELECT title FROM projects WHERE id = $1', [projectId])
  const projectTitle = projectResult.rows[0]?.title ?? 'Deleted project'

  const budgetResult = await query(
    `INSERT INTO budgets
      (project_id, project_title, production_budget, profit_budget, vat_amount, notes)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [projectId, projectTitle, production, profit, vat, notes || null],
  )

  const budget = budgetResult.rows[0]
  const stepRows = Array.isArray(steps) ? steps : []

  if (stepRows.length > 0) {
    for (const step of stepRows) {
      const costAmount = toNumber(step.costAmount) ?? 0
      const vendorCost = toNumber(step.vendorCost)
      await query(
        `INSERT INTO budget_steps
          (budget_id, project_step_id, step_name, step_position, cost_amount, vendor_name, vendor_cost)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          budget.id,
          step.projectStepId ?? null,
          step.stepName ?? 'Step',
          step.stepPosition ?? null,
          costAmount,
          step.vendorName || null,
          vendorCost,
        ],
      )
    }
  }

  return res.status(201).json(budget)
})

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { productionBudget, profitBudget, vatAmount, notes, archived, steps } = req.body as {
    productionBudget?: number | string
    profitBudget?: number | string
    vatAmount?: number | string
    notes?: string | null
    archived?: boolean
    steps?: BudgetStepInput[]
  }

  const budgetResult = await query('SELECT * FROM budgets WHERE id = $1', [id])
  if (!budgetResult.rows[0]) return res.status(404).json({ error: 'Not found.' })

  const production = toNumber(productionBudget)
  const profit = toNumber(profitBudget)
  const vat = toNumber(vatAmount)

  const updated = await query(
    `UPDATE budgets
     SET production_budget = COALESCE($1, production_budget),
         profit_budget = COALESCE($2, profit_budget),
         vat_amount = COALESCE($3, vat_amount),
         notes = COALESCE($4, notes),
         archived = COALESCE($5, archived),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [production, profit, vat, notes ?? null, archived ?? null, id],
  )

  if (Array.isArray(steps)) {
    await query('DELETE FROM budget_steps WHERE budget_id = $1', [id])
    for (const step of steps) {
      const costAmount = toNumber(step.costAmount) ?? 0
      const vendorCost = toNumber(step.vendorCost)
      await query(
        `INSERT INTO budget_steps
          (budget_id, project_step_id, step_name, step_position, cost_amount, vendor_name, vendor_cost)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          id,
          step.projectStepId ?? null,
          step.stepName ?? 'Step',
          step.stepPosition ?? null,
          costAmount,
          step.vendorName || null,
          vendorCost,
        ],
      )
    }
  }

  return res.json(updated.rows[0])
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const result = await query('DELETE FROM budgets WHERE id = $1 RETURNING id', [id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found.' })
  return res.json({ ok: true })
})

export default router
