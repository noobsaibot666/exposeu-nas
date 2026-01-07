import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.CONTACT_API_PORT || 8787)

// Middleware
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health
app.get('/health', (_req, res) => res.json({ ok: true }))

// Health checks (so HEAD/GET /contact doesn't show 404)
app.get('/contact', (_req, res) => res.status(200).send('OK'))
app.head('/contact', (_req, res) => res.status(200).end())

// Contact endpoint
app.post('/contact', async (req, res) => {
  try {
    console.log('CONTACT BODY:', req.body)

    const {
      firstName,
      lastName,
      name, // fallback if frontend sends "name"
      email,
      message,
    } = req.body || {}

    const senderName =
      [firstName, lastName].filter(Boolean).join(' ').trim() ||
      name ||
      'N/A'

    if (!email || !message) {
      console.error('Missing required fields:', { senderName, email, message })
      return res.status(400).json({ ok: false, error: 'Missing required fields.' })
    }

    const host = process.env.SMTP_HOST
    const portValue = Number(process.env.SMTP_PORT || 0)
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.CONTACT_TO
    const from = process.env.CONTACT_FROM || user

    if (!host || !portValue || !user || !pass || !to || !from) {
      console.error('Server email configuration missing:', {
        SMTP_HOST: !!host,
        SMTP_PORT: portValue,
        SMTP_USER: !!user,
        SMTP_PASS: !!pass,
        CONTACT_TO: !!to,
        CONTACT_FROM: !!from,
      })
      return res.status(500).json({ ok: false, error: 'Server email configuration missing.' })
    }

    const transporter = nodemailer.createTransport({
      host,
      port: portValue,
      secure,
      auth: { user, pass },
    })

    const subject =
      senderName && senderName !== 'N/A'
        ? `Contact form: ${senderName}`
        : 'Contact form submission'

    const text = [
      `Name: ${senderName}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n')

   const info = await transporter.sendMail({
  to,
  from,
  replyTo: email,
  subject,
  text,
})

console.log('MAIL SENT:', info.messageId)

    return res.json({ ok: true })
  } catch (error) {
    console.error('Contact form error', error)
    return res.status(500).json({ ok: false, error: 'Failed to send email.' })
  }
})

app.listen(port, () => {
  console.log(`Contact API listening on ${port}`)
})