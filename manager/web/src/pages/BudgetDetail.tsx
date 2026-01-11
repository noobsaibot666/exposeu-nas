import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'
import '../styles/forms.css'
import './BudgetDetail.css'

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
}

type BudgetStep = {
  id: number
  project_step_id: number | null
  step_name: string
  step_position: number | null
  cost_amount: string | null
  vendor_name: string | null
  vendor_cost: string | null
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

export default function BudgetDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [steps, setSteps] = useState<BudgetStep[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [productionBudget, setProductionBudget] = useState('')
  const [profitBudget, setProfitBudget] = useState('')
  const [vatAmount, setVatAmount] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!token || !id) return
    apiRequest<{ budget: Budget; steps: BudgetStep[] }>(`/budgets/${id}`, {}, token)
      .then((data) => {
        setBudget(data.budget)
        setSteps(data.steps)
        setProductionBudget(data.budget.production_budget ?? '')
        setProfitBudget(data.budget.profit_budget ?? '')
        setVatAmount(data.budget.vat_amount ?? '')
        setNotes(data.budget.notes ?? '')
      })
      .catch(() => setError('Unable to load budget.'))
  }, [id, token])

  const spentTotal = useMemo(() => {
    return steps.reduce((sum, step) => sum + toNumber(step.cost_amount), 0)
  }, [steps])

  const remainingTotal = useMemo(() => {
    return Math.max(0, toNumber(productionBudget) - spentTotal)
  }, [productionBudget, spentTotal])

  const handleStepChange = (stepId: number, patch: Partial<BudgetStep>) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, ...patch } : step)))
  }

  const handleSave = async () => {
    if (!token || !budget) return
    setSaving(true)
    setError('')
    try {
      await apiRequest(
        `/budgets/${budget.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            productionBudget,
            profitBudget,
            vatAmount,
            notes: notes.trim() || null,
            steps: steps.map((step) => ({
              projectStepId: step.project_step_id,
              stepName: step.step_name,
              stepPosition: step.step_position,
              costAmount: step.cost_amount ?? 0,
              vendorName: step.vendor_name,
              vendorCost: step.vendor_cost,
            })),
          }),
        },
        token,
      )
      setBudget((current) =>
        current
          ? {
              ...current,
              production_budget: productionBudget,
              profit_budget: profitBudget,
              vat_amount: vatAmount,
              notes,
            }
          : current,
      )
    } catch {
      setError('Unable to save budget.')
    } finally {
      setSaving(false)
    }
  }

  const toggleArchive = async () => {
    if (!token || !budget) return
    setSaving(true)
    setError('')
    try {
      const updated = await apiRequest<Budget>(
        `/budgets/${budget.id}`,
        { method: 'PATCH', body: JSON.stringify({ archived: !budget.archived }) },
        token,
      )
      setBudget(updated)
    } catch {
      setError('Unable to update budget status.')
    } finally {
      setSaving(false)
    }
  }

  if (!budget) {
    return (
      <Layout title="Budget detail">
        {error && <div className="form-error">{error}</div>}
      </Layout>
    )
  }

  return (
    <Layout title="Budget detail">
      <div className="budget-detail">
        <div className="budget-detail__header">
          <div>
            <p className="eyebrow">Budget</p>
            <h2>{budget.project_title ?? 'Project budget'}</h2>
            <p className="muted">
              Production remaining {formatAmount(remainingTotal)} · Spent {formatAmount(spentTotal)}
            </p>
          </div>
          <div className="budget-detail__actions">
            <Link to="/budgets" className="button button--ghost">
              Back to budgets
            </Link>
            {budget.project_id && (
              <Link to={`/projects/${budget.project_id}`} className="button button--ghost">
                Open project
              </Link>
            )}
            <button type="button" className="button button--ghost" onClick={toggleArchive} disabled={saving}>
              {budget.archived ? 'Restore' : 'Archive'}
            </button>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <section className="budget-panel">
          <div className="budget-panel__grid">
            <label>
              Production budget
              <input value={productionBudget} onChange={(event) => setProductionBudget(event.target.value)} />
            </label>
            <label>
              Profit target
              <input value={profitBudget} onChange={(event) => setProfitBudget(event.target.value)} />
            </label>
            <label>
              VAT amount
              <input value={vatAmount} onChange={(event) => setVatAmount(event.target.value)} />
            </label>
          </div>
          <label className="budget-panel__notes">
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
          </label>
        </section>
        <section className="budget-panel">
          <div className="budget-panel__header">
            <div>
              <p className="eyebrow">Workflow</p>
              <h3>Step costs</h3>
              <p className="muted">Track production spend and vendor cost for each phase.</p>
            </div>
            <button type="button" className="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
          <div className="budget-steps">
            {steps.map((step) => (
              <div key={step.id} className="budget-step">
                <div className="budget-step__title">
                  <span>{step.step_position ? `${step.step_position}.` : ''}</span>
                  <span>{step.step_name}</span>
                </div>
                <label>
                  Cost
                  <input
                    value={step.cost_amount ?? ''}
                    onChange={(event) => handleStepChange(step.id, { cost_amount: event.target.value })}
                  />
                </label>
                <label>
                  Vendor name
                  <input
                    value={step.vendor_name ?? ''}
                    onChange={(event) => handleStepChange(step.id, { vendor_name: event.target.value })}
                  />
                </label>
                <label>
                  Vendor cost
                  <input
                    value={step.vendor_cost ?? ''}
                    onChange={(event) => handleStepChange(step.id, { vendor_cost: event.target.value })}
                  />
                </label>
              </div>
            ))}
            {steps.length === 0 && <p className="muted">No steps tracked for this budget.</p>}
          </div>
        </section>
      </div>
    </Layout>
  )
}
