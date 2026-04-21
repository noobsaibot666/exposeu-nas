import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
app.set('trust proxy', true)
const port = Number(process.env.CONTACT_API_PORT || 8787)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const contactRequestStore = new Map()

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

const trimValue = (value) => (typeof value === 'string' ? value.trim() : '')

const sendApiError = (res, status, code, message) =>
  res.status(status).json({
    ok: false,
    error: {
      code,
      message,
    },
  })

const getClientIp = (req) => {
  const cfConnectingIp = req.headers['cf-connecting-ip']
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.trim()) {
    return cfConnectingIp.trim()
  }

  if (Array.isArray(cfConnectingIp) && cfConnectingIp[0]) {
    return cfConnectingIp[0].trim()
  }

  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }

  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].trim()
  }

  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown'
}

const isRateLimited = (ip) => {
  const now = Date.now()
  const existingEntries = contactRequestStore.get(ip) || []
  const recentEntries = existingEntries.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recentEntries.length >= RATE_LIMIT_MAX_REQUESTS) {
    contactRequestStore.set(ip, recentEntries)
    return true
  }

  recentEntries.push(now)
  contactRequestStore.set(ip, recentEntries)
  return false
}

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
    const {
      firstName,
      lastName,
      name, // fallback if frontend sends "name"
      email,
      service,
      serviceLabel,
      package: packageSlug,
      packageLabel,
      sourceUrl,
      referrer,
      companyWebsite,
      message,
    } = req.body || {}

    const ip = getClientIp(req)
    const trimmedFirstName = trimValue(firstName)
    const trimmedLastName = trimValue(lastName)
    const trimmedName = trimValue(name)
    const trimmedEmail = trimValue(email)
    const trimmedMessage = trimValue(message)
    const trimmedService = trimValue(service)
    const trimmedServiceLabel = trimValue(serviceLabel)
    const trimmedPackage = trimValue(packageSlug)
    const trimmedPackageLabel = trimValue(packageLabel)
    const trimmedSourceUrl = trimValue(sourceUrl)
    const trimmedReferrer = trimValue(referrer)
    const trimmedCompanyWebsite = trimValue(companyWebsite)

    const senderName =
      [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ').trim() ||
      trimmedName ||
      'N/A'

    console.log('CONTACT LEAD META:', {
      ts: new Date().toISOString(),
      ip,
      service: trimmedService,
      package: trimmedPackage,
      sourceUrl: trimmedSourceUrl,
      referrer: trimmedReferrer,
    })

    if (trimmedCompanyWebsite) {
      console.warn('CONTACT SPAM BLOCKED:', {
        ts: new Date().toISOString(),
        ip,
        reason: 'honeypot_filled',
      })
      return res.json({ ok: true })
    }

    if (isRateLimited(ip)) {
      console.warn('CONTACT RATE LIMITED:', {
        ts: new Date().toISOString(),
        derivedIp: ip,
        hasForwardedFor: Boolean(req.headers['x-forwarded-for']),
        service: trimmedService,
        package: trimmedPackage,
      })
      return sendApiError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.')
    }

    if (senderName === 'N/A' || !trimmedEmail || !trimmedMessage) {
      console.error('CONTACT VALIDATION FAILED:', {
        ts: new Date().toISOString(),
        ip,
        hasName: senderName !== 'N/A',
        hasEmail: Boolean(trimmedEmail),
        hasMessage: Boolean(trimmedMessage),
      })
      return sendApiError(res, 400, 'INVALID_PAYLOAD', 'Please provide your name, email, and message.')
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
      return sendApiError(res, 500, 'EMAIL_CONFIG_MISSING', 'Server email configuration missing.')
    }

    const transporter = createTransporter(config)

    const subjectService = trimmedServiceLabel || trimmedService || ''
    const subjectPackage = trimmedPackageLabel || trimmedPackage || ''
    const subjectParts = [subjectService, subjectPackage].filter(Boolean)
    const subject = subjectParts.length
      ? `Expose.u Lead - ${subjectParts.join(' - ')}`
      : 'Expose.u Lead - Website Contact'

    const leadSummary = [
      'Lead Summary',
      ...(trimmedServiceLabel || trimmedService ? [`Service: ${trimmedServiceLabel || 'Unknown'}${trimmedService ? ` (${trimmedService})` : ''}`] : []),
      ...(trimmedPackageLabel || trimmedPackage ? [`Package: ${trimmedPackageLabel || 'Unknown'}${trimmedPackage ? ` (${trimmedPackage})` : ''}`] : []),
      ...(trimmedSourceUrl ? [`Source: ${trimmedSourceUrl}`] : trimmedReferrer ? [`Source: ${trimmedReferrer}`] : []),
    ]

    const text = [
      `Name: ${senderName}`,
      `Email: ${trimmedEmail}`,
      '',
      ...leadSummary,
      '',
      trimmedMessage,
    ].join('\n')

    const mailOptions = {
      to: config.to,
      from: config.from,
      replyTo: trimmedEmail,
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
    return sendApiError(res, 500, 'EMAIL_SEND_FAILED', 'Failed to send email.')
  }
})

app.get('/smtp-test', async (req, res) => {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    console.warn('SMTP TEST RATE LIMITED:', {
      ts: new Date().toISOString(),
      ip,
    })
    return sendApiError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.')
  }

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
