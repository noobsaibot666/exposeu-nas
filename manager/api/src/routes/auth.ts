import { Router } from 'express'
import bcrypt from 'bcrypt'
import { query } from '../db.js'
import { signToken } from '../utils/tokens.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' })
  }

  const result = await query<{ id: number; email: string; password_hash: string }>(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email],
  )

  const user = result.rows[0]
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }

  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }

  const token = signToken({ id: user.id, email: user.email })
  return res.json({ token })
})

router.post('/seed', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' })
  }

  const existingUsers = await query<{ id: number }>('SELECT id FROM users LIMIT 1')
  if (existingUsers.rows[0]) {
    return res.status(409).json({ error: 'Users already exist.' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash])
  return res.json({ ok: true })
})

export default router
