import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/dashboard.css'
import './AdminUsers.css'

type AdminUser = {
  id: number
  email: string
  is_admin: boolean
  created_at: string
}

type Project = {
  id: number
  title: string
  client_name: string | null
  service_type: string | null
  status: string | null
  due_date: string | null
  project_color: string | null
}

type Budget = {
  id: number
  project_id: number | null
  project_title: string | null
  total_budget: string
  production_budget: string
  profit_budget: string
  profit_percent: string | null
  vat_amount: string | null
  vat_percent: string | null
  spent_total: string
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(date)
}

const formatAmount = (value: string | null) => {
  const numberValue = Number(value || 0)
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isNaN(numberValue) ? 0 : numberValue)
}

export default function AdminUsers() {
  const { token, user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest<AdminUser[]>('/admin/users', {}, token)
      .then((data) => {
        setUsers(data)
        setSelectedUser((current) => current ?? data[0] ?? null)
      })
      .catch(() => setError('Unable to load users.'))
  }, [token])

  useEffect(() => {
    if (!token || !selectedUser) return
    Promise.all([
      apiRequest<Project[]>(`/admin/users/${selectedUser.id}/projects`, {}, token),
      apiRequest<Budget[]>(`/admin/users/${selectedUser.id}/budgets`, {}, token),
    ])
      .then(([projectData, budgetData]) => {
        setProjects(projectData)
        setBudgets(budgetData)
      })
      .catch(() => setError('Unable to load user data.'))
  }, [selectedUser, token])

  const totalProjects = projects.length
  const activeProjects = projects.filter((project) => project.status !== 'archive').length
  const totalBudget = useMemo(
    () => budgets.reduce((sum, budget) => sum + Number(budget.total_budget || 0), 0),
    [budgets],
  )

  if (!user?.is_admin) {
    return (
      <Layout title="User access">
        <p className="muted">Admin access required.</p>
      </Layout>
    )
  }

  return (
    <Layout title="User access">
      <div className="admin-users">
        <div className="admin-users__header">
          <div>
            <p className="eyebrow">Admin</p>
            <h2>User access</h2>
            <p className="muted">Select a user to review their projects and budgets.</p>
          </div>
          <Link to="/" className="button button--ghost">
            Back to dashboard
          </Link>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="admin-users__grid">
          <aside className="admin-users__list">
            {users.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`user-chip${selectedUser?.id === item.id ? ' is-active' : ''}`}
                onClick={() => setSelectedUser(item)}
              >
                <span>{item.email}</span>
                {item.is_admin && <span className="user-chip__tag">Admin</span>}
              </button>
            ))}
          </aside>
          <section className="admin-users__panel">
            {selectedUser ? (
              <>
                <div className="admin-users__summary">
                  <div className="summary-card">
                    <p className="summary-card__label">Total projects</p>
                    <p className="summary-card__value">{totalProjects}</p>
                  </div>
                  <div className="summary-card summary-card--accent">
                    <p className="summary-card__label">Active projects</p>
                    <p className="summary-card__value">{activeProjects}</p>
                  </div>
                  <div className="summary-card summary-card--warning">
                    <p className="summary-card__label">Total budget</p>
                    <p className="summary-card__value">{formatAmount(String(totalBudget))}</p>
                  </div>
                </div>
                <div className="admin-users__section">
                  <h3>Projects</h3>
                  <div className="table">
                    <div className="table__row table__row--header">
                      <span>Project</span>
                      <span>Client</span>
                      <span>Service</span>
                      <span>Status</span>
                      <span>Due</span>
                    </div>
                    {projects.map((project) => (
                      <Link key={project.id} to={`/projects/${project.id}`} className="table__row">
                        <span data-label="Project">{project.title}</span>
                        <span data-label="Client">{project.client_name ?? '—'}</span>
                        <span data-label="Service">{project.service_type ?? '—'}</span>
                        <span data-label="Status">{project.status ?? '—'}</span>
                        <span data-label="Due">{formatDate(project.due_date)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="admin-users__section">
                  <h3>Budgets</h3>
                  <div className="table">
                    <div className="table__row table__row--header">
                      <span>Project</span>
                      <span>Total</span>
                      <span>Production</span>
                      <span>Profit</span>
                      <span>VAT</span>
                    </div>
                    {budgets.map((budget) => (
                      <Link key={budget.id} to={`/budgets/${budget.id}`} className="table__row">
                        <span data-label="Project">{budget.project_title ?? 'Project'}</span>
                        <span data-label="Total">{formatAmount(budget.total_budget)}</span>
                        <span data-label="Production">{formatAmount(budget.production_budget)}</span>
                        <span data-label="Profit">
                          {formatAmount(budget.profit_budget)}
                          {budget.profit_percent ? ` (${budget.profit_percent}%)` : ''}
                        </span>
                        <span data-label="VAT">{formatAmount(budget.vat_amount)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="muted">Select a user to begin.</p>
            )}
          </section>
        </div>
      </div>
    </Layout>
  )
}
