import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const port = Number(process.env.CONTACT_API_PORT || 8787)

const buildSmtpConfig = () => {
  const host = process.env.SMTP_HOST
  const portValue = Number(process.env.SMTP_PORT || 0)
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.CONTACT_TO
  const from = process.env.CONTACT_FROM || user
  const testToken = process.env.SMTP_TEST_TOKEN

  return {
    host,
    port: portValue,
    secure,
    user,
    pass,
    to,
    from,
    testToken,
  }
}

const hasRequiredConfig = (config) =>
  Boolean(
    config.host &&
      config.port &&
      config.user &&
      config.pass &&
      config.to &&
      config.from,
  )

const logSmtpConfig = (config, context) => {
  const portHint =
    config.secure && config.port === 587
      ? ' (secure=true with 587; Gmail expects secure=false for STARTTLS)'
      : !config.secure && config.port === 465
        ? ' (secure=false with 465; Gmail expects secure=true for implicit TLS)'
        : ''
  console.log(`${context} SMTP config:`, {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user ? '[set]' : '[missing]',
    pass: config.pass ? '[set]' : '[missing]',
    to: config.to,
    from: config.from,
    ...(!portHint ? {} : { note: portHint.trim() }),
  })
}

const createTransporter = (config) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  })

const serializeError = (error) => ({
  name: error?.name,
  message: error?.message,
  code: error?.code,
  responseCode: error?.responseCode,
  command: error?.command,
})

// Middleware
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

const smtpConfig = buildSmtpConfig()
if (hasRequiredConfig(smtpConfig)) {
  const transporter = createTransporter(smtpConfig)
  transporter
    .verify()
    .then(() => {
      logSmtpConfig(smtpConfig, 'SMTP verify ok.')
    })
    .catch((error) => {
      console.error('SMTP verify failed:', serializeError(error))
      logSmtpConfig(smtpConfig, 'SMTP verify failed. Config used:')
    })
} else {
  console.warn('SMTP verify skipped; missing configuration.')
  logSmtpConfig(smtpConfig, 'SMTP config status:')
}

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

    const config = buildSmtpConfig()

    if (!hasRequiredConfig(config)) {
      console.error('Server email configuration missing:', {
        SMTP_HOST: !!config.host,
        SMTP_PORT: config.port,
        SMTP_USER: !!config.user,
        SMTP_PASS: !!config.pass,
        CONTACT_TO: !!config.to,
        CONTACT_FROM: !!config.from,
      })
      return res.status(500).json({ ok: false, error: 'Server email configuration missing.' })
    }

    const transporter = createTransporter(config)

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

    const mailOptions = {
      to: config.to,
      from: config.from,
      replyTo: email,
      subject,
      text,
    }

    logSmtpConfig(config, 'Sending contact email with')
    console.log('MAIL META:', {
      to: mailOptions.to,
      from: mailOptions.from,
      replyTo: mailOptions.replyTo,
      subject: mailOptions.subject,
    })

    const info = await transporter.sendMail(mailOptions)

    console.log('MAIL SENT:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error('Contact form error', serializeError(error))
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email.',
      details: serializeError(error),
    })
  }
})

app.get('/smtp-test', async (req, res) => {
  const config = buildSmtpConfig()
  const token = String(req.query.token || '')
  const allowInDev = process.env.NODE_ENV === 'development'

  if (!allowInDev) {
    if (!config.testToken) {
      return res.status(403).json({ ok: false, error: 'SMTP test disabled.' })
    }
    if (!token || token !== config.testToken) {
      return res.status(401).json({ ok: false, error: 'Unauthorized.' })
    }
  }

  if (!hasRequiredConfig(config)) {
    return res.status(500).json({ ok: false, error: 'Server email configuration missing.' })
  }

  try {
    const transporter = createTransporter(config)
    const subject = 'SMTP self-test'
    const text = `SMTP self-test sent at ${new Date().toISOString()}`

    logSmtpConfig(config, 'Sending SMTP self-test with')
    console.log('MAIL META:', {
      to: config.to,
      from: config.from,
      replyTo: config.from,
      subject,
    })

    const info = await transporter.sendMail({
      to: config.to,
      from: config.from,
      replyTo: config.from,
      subject,
      text,
    })

    console.log('SMTP TEST SENT:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    })

    return res.json({
      ok: true,
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    })
  } catch (error) {
    console.error('SMTP test error', serializeError(error))
    return res.status(500).json({
      ok: false,
      error: 'SMTP test failed.',
      details: serializeError(error),
    })
  }
})

app.listen(port, () => {
  console.log(`Contact API listening on ${port}`)
})
