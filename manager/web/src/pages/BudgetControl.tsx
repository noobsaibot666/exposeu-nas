import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'
import './BudgetControl.css'

type Budget = {
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
  spent_total: number
  vendor_total: number
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)

const toNumber = (value: string | null) => {
  if (!value) return 0
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export default function BudgetControl() {
  const { token } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    apiRequest<Budget[]>('/budgets?includeArchived=true', {}, token)
      .then(setBudgets)
      .catch(() => setError('Unable to load budgets.'))
  }, [token])

  const activeBudgets = useMemo(() => budgets.filter((budget) => !budget.archived), [budgets])
  const archivedBudgets = useMemo(() => budgets.filter((budget) => budget.archived), [budgets])

  const totals = useMemo(() => {
    const production = activeBudgets.reduce((sum, budget) => sum + toNumber(budget.production_budget), 0)
    const spent = activeBudgets.reduce((sum, budget) => sum + (budget.spent_total || 0), 0)
    const profit = activeBudgets.reduce((sum, budget) => sum + toNumber(budget.profit_budget), 0)
    const vat = activeBudgets.reduce((sum, budget) => sum + toNumber(budget.vat_amount), 0)
    return {
      production,
      spent,
      remaining: Math.max(0, production - spent),
      profit,
      vat,
    }
  }, [activeBudgets])

  const spentRatio = totals.production > 0 ? Math.min(100, Math.round((totals.spent / totals.production) * 100)) : 0

  const updateBudgetStatus = async (budgetId: number, archived: boolean) => {
    if (!token) return
    setBusyId(budgetId)
    try {
      const updated = await apiRequest<Budget>(
        `/budgets/${budgetId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ archived }),
        },
        token,
      )
      setBudgets((prev) => prev.map((budget) => (budget.id === budgetId ? { ...budget, ...updated } : budget)))
    } catch {
      setError('Unable to update budget status.')
    } finally {
      setBusyId(null)
    }
  }

  const deleteBudget = async (budgetId: number) => {
    if (!token) return
    const confirmed = window.confirm('Delete this budget record? This cannot be undone.')
    if (!confirmed) return
    setBusyId(budgetId)
    try {
      await apiRequest(`/budgets/${budgetId}`, { method: 'DELETE' }, token)
      setBudgets((prev) => prev.filter((budget) => budget.id !== budgetId))
    } catch {
      setError('Unable to delete budget.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Layout title="Budget control">
      <div className="budget-control">
        <div className="budget-control__header">
          <div>
            <p className="eyebrow">Finance</p>
            <h2>Budget control</h2>
            <p className="muted">Track production spend, profit targets, and VAT exposure across projects.</p>
          </div>
          <Link to="/" className="button button--ghost">
            Back to dashboard
          </Link>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="budget-summary">
          <div className="summary-card">
            <p className="summary-card__label">Production budget</p>
            <p className="summary-card__value">{formatAmount(totals.production)}</p>
          </div>
          <div className="summary-card summary-card--warning">
            <p className="summary-card__label">Spent</p>
            <p className="summary-card__value">{formatAmount(totals.spent)}</p>
          </div>
          <div className="summary-card summary-card--ok">
            <p className="summary-card__label">Remaining</p>
            <p className="summary-card__value">{formatAmount(totals.remaining)}</p>
          </div>
          <div className="summary-card summary-card--accent">
            <p className="summary-card__label">Profit target</p>
            <p className="summary-card__value">{formatAmount(totals.profit)}</p>
          </div>
          <div className="summary-card summary-card--muted">
            <p className="summary-card__label">VAT total</p>
            <p className="summary-card__value">{formatAmount(totals.vat)}</p>
          </div>
        </div>
        <div className="budget-chart">
          <div className="budget-chart__bar">
            <div className="budget-chart__fill" style={{ width: `${spentRatio}%` }} />
          </div>
          <div className="budget-chart__meta">
            <span>Spent {formatAmount(totals.spent)}</span>
            <span>Remaining {formatAmount(totals.remaining)}</span>
          </div>
        </div>
        <section className="budget-list">
          <div className="budget-list__header">
            <div>
              <p className="eyebrow">Active budgets</p>
              <h3>Current allocations</h3>
            </div>
            <p className="muted">{activeBudgets.length} active</p>
          </div>
          {activeBudgets.length === 0 && <p className="muted">No active budgets yet.</p>}
          {activeBudgets.map((budget) => {
            const production = toNumber(budget.production_budget)
            const spent = budget.spent_total || 0
            const remaining = Math.max(0, production - spent)
            const ratio = production > 0 ? Math.min(100, Math.round((spent / production) * 100)) : 0
            return (
              <div key={budget.id} className="budget-card">
                <div className="budget-card__main">
                  <div>
                    <p className="eyebrow">Project</p>
                    {budget.project_id ? (
                      <Link to={`/projects/${budget.project_id}`} className="budget-card__title">
                        {budget.project_title ?? 'Untitled project'}
                      </Link>
                    ) : (
                      <p className="budget-card__title">{budget.project_title ?? 'Deleted project'}</p>
                    )}
                    <p className="muted">
                      Production {formatAmount(production)} · Remaining {formatAmount(remaining)}
                    </p>
                  </div>
                  <div className="budget-card__actions">
                    <Link to={`/budgets/${budget.id}`} className="button button--ghost">
                      View
                    </Link>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => updateBudgetStatus(budget.id, true)}
                      disabled={busyId === budget.id}
                    >
                      Archive
                    </button>
                  </div>
                </div>
                <div className="budget-card__metrics">
                  <div>
                    <p className="metric-label">Spent</p>
                    <p className="metric-value">{formatAmount(spent)}</p>
                  </div>
                  <div>
                    <p className="metric-label">Profit</p>
                    <p className="metric-value">{formatAmount(toNumber(budget.profit_budget))}</p>
                  </div>
                  <div>
                    <p className="metric-label">VAT</p>
                    <p className="metric-value">{formatAmount(toNumber(budget.vat_amount))}</p>
                  </div>
                </div>
                <div className="budget-bar">
                  <div className="budget-bar__fill" style={{ width: `${ratio}%` }} />
                </div>
              </div>
            )
          })}
        </section>
        <section className="budget-list budget-list--archived">
          <div className="budget-list__header">
            <div>
              <p className="eyebrow">Archive</p>
              <h3>Past budgets</h3>
            </div>
            <p className="muted">{archivedBudgets.length} archived</p>
          </div>
          {archivedBudgets.length === 0 && <p className="muted">No archived budgets.</p>}
          {archivedBudgets.map((budget) => (
            <div key={budget.id} className="budget-card budget-card--archived">
              <div className="budget-card__main">
                <div>
                  <p className="eyebrow">Project</p>
                  <p className="budget-card__title">{budget.project_title ?? 'Deleted project'}</p>
                  <p className="muted">
                    Production {formatAmount(toNumber(budget.production_budget))} · Spent{' '}
                    {formatAmount(budget.spent_total || 0)}
                  </p>
                </div>
                <div className="budget-card__actions">
                  <Link to={`/budgets/${budget.id}`} className="button button--ghost">
                    View
                  </Link>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => updateBudgetStatus(budget.id, false)}
                    disabled={busyId === budget.id}
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() => deleteBudget(budget.id)}
                    disabled={busyId === budget.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  )
}
