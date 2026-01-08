const apiBase =
  process.env.MANAGER_API_URL ||
  process.env.VITE_MANAGER_API ||
  'http://localhost:4001'

const email = process.env.MANAGER_LOGIN_EMAIL || process.env.ADMIN_EMAIL
const password = process.env.MANAGER_LOGIN_PASSWORD || process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Missing MANAGER_LOGIN_EMAIL/MANAGER_LOGIN_PASSWORD (or ADMIN_EMAIL/ADMIN_PASSWORD).')
  process.exit(1)
}

const baseUrl = apiBase.replace(/\/$/, '')
const response = await fetch(`${baseUrl}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})

const status = response.status
let body = null
try {
  body = await response.json()
} catch {
  const text = await response.text().catch(() => '')
  body = text ? { error: text } : null
}

console.log(`status: ${status}`)
if (response.ok) {
  const tokenPresent = !!(body && typeof body.token === 'string' && body.token.length > 0)
  console.log(`token: ${tokenPresent ? 'present' : 'missing'}`)
  if (!tokenPresent) {
    process.exit(1)
  }
} else {
  const errorMessage = body && typeof body.error === 'string' ? body.error : 'Request failed'
  console.log(`error: ${errorMessage}`)
  process.exit(1)
}
