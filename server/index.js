import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.CONTACT_API_PORT || 8787)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})


// Health checks (so HEAD/GET /contact doesn't show 404)
app.get('/contact', (req, res) => res.status(200).send('OK'))
app.head('/contact', (req, res) => res.status(200).end())
app.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body || {}
    if (!email || !message) {
      res.status(400).json({ ok: false, error: 'Missing required fields.' })
      return
    }

    const host = process.env.SMTP_HOST
    const portValue = Number(process.env.SMTP_PORT || 0)
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.CONTACT_TO
    const from = process.env.CONTACT_FROM || user

    if (!host || !portValue || !user || !pass || !to || !from) {
      res.status(500).json({ ok: false, error: 'Server email configuration missing.' })
      return
    }

    const transporter = nodemailer.createTransport({
      host,
      port: portValue,
      secure,
      auth: { user, pass },
    })

    const senderName = [firstName, lastName].filter(Boolean).join(' ').trim()
    const subject = senderName ? `Contact form: ${senderName}` : 'Contact form submission'

    const text = [
      `Name: ${senderName || 'N/A'}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n')

    await transporter.sendMail({
      to,
      from,
      replyTo: email,
      subject,
      text,
    })

    res.json({ ok: true })
  } catch (error) {
    console.error('Contact form error', error)
    res.status(500).json({ ok: false, error: 'Failed to send email.' })
  }
})

app.listen(port, () => {
  console.log(`Contact API listening on ${port}`)
})
