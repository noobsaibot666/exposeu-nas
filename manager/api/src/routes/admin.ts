import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

const getUser = (req: { user?: unknown }) => req.user as { id: number; is_admin?: boolean }

const requireAdmin = (req: { user?: unknown }) => {
  const user = getUser(req)
  return Boolean(user?.is_admin)
}

router.get('/users', async (req, res) => {
  if (!requireAdmin(req)) return res.status(403).json({ error: 'Not allowed.' })
  const users = await query<{ id: number; email: string; is_admin: boolean; created_at: string }>(
    'SELECT id, email, is_admin, created_at FROM users ORDER BY created_at ASC',
  )
  return res.json(users.rows)
})

router.get('/users/:id/projects', async (req, res) => {
  if (!requireAdmin(req)) return res.status(403).json({ error: 'Not allowed.' })
  const id = Number(req.params.id)
  const projects = await query('SELECT * FROM projects WHERE owner_user_id = $1 ORDER BY created_at DESC', [id])
  return res.json(projects.rows)
})

router.get('/users/:id/budgets', async (req, res) => {
  if (!requireAdmin(req)) return res.status(403).json({ error: 'Not allowed.' })
  const id = Number(req.params.id)
  const budgets = await query(
    `SELECT budgets.*,
        COALESCE(SUM(budget_steps.cost_amount), 0) as spent_total,
        COALESCE(SUM(budget_steps.vendor_cost), 0) as vendor_total
     FROM budgets
     LEFT JOIN budget_steps ON budgets.id = budget_steps.budget_id
     WHERE budgets.owner_user_id = $1
     GROUP BY budgets.id
     ORDER BY budgets.created_at DESC`,
    [id],
  )
  return res.json(budgets.rows)
})

export default router
