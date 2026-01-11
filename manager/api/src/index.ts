import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import authRoutes from './routes/auth.js'
import budgetRoutes from './routes/budgets.js'
import projectRoutes from './routes/projects.js'
import shareRoutes from './routes/share.js'
import workflowRoutes from './routes/workflows.js'
import { requireAuth } from './middleware/auth.js'
import { query } from './db.js'
import { ensureDefaultWorkflow } from './utils/seed.js'

const app = express()
const port = Number(process.env.API_PORT || 4001)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRoutes)
app.use('/budgets', requireAuth, budgetRoutes)
app.use('/projects', requireAuth, projectRoutes)
app.use('/workflows', requireAuth, workflowRoutes)
app.use('/share', shareRoutes)

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const normalizedEmail = email?.trim()
  if (!normalizedEmail || !password) return

  const existing = await query<{ id: number }>('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [
    normalizedEmail,
  ])
  if (existing.rows[0]) return

  const passwordHash = await bcrypt.hash(password, 12)
  await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [normalizedEmail, passwordHash])
}

Promise.all([ensureAdmin(), ensureDefaultWorkflow()])
  .then(() => {
    app.listen(port, () => {
      console.log(`Exposeu Manager API listening on ${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start API', error)
    process.exit(1)
  })
