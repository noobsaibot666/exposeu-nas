import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import { buildMetaLeadEvent, sendMetaEvents } from './metaConversions.js'

// Logs contact submissions into the outreach-app's Supabase project so the ads dashboard
// can join clicks to actual conversions via the service= tier. Optional — if unset, the
// contact form still works, submissions just aren't logged anywhere.
//
// createClient() always constructs a RealtimeClient, which throws synchronously on
// Node <22 without a WebSocket polyfill (we only ever call .from().insert(), never
// realtime) — pass the `ws` package as the transport to satisfy that constructor check.
// Wrapped in try/catch too: this is a best-effort side log and must never be able to
// take the whole contact API down the way an unguarded throw here did once already.
let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      realtime: { transport: ws },
    })
  } catch (err) {
    console.error('SUPABASE CLIENT INIT FAILED (contact logging disabled):', err instanceof Error ? err.message : err)
  }
}

async function logContactSubmission(fields) {
  if (!supabase) return
  try {
    const { error } = await supabase.from('contact_submissions').insert(fields)
    if (error) console.error('CONTACT SUPABASE LOG FAILED:', error.message)
  } catch (error) {
    console.error('CONTACT SUPABASE LOG FAILED:', serializeError(error))
  }
}

const app = express()
// Trust exactly 1 proxy hop (Traefik). 'true' would trust all hops and allow
// clients to spoof X-Forwarded-For to bypass rate limiting.
app.set('trust proxy', 1)
const port = Number(process.env.CONTACT_API_PORT || 8787)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const contactRequestStore = new Map()
const metaEventRequestStore = new Map()
const smtpTestRequestStore = new Map()
const photoConsentRequestStore = new Map()
const reverseGeocodeRequestStore = new Map()

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

const buildMetaConfig = () => ({
  pixelId: process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID,
  accessToken: process.env.META_CAPI_TOKEN,
  testEventCode: process.env.META_TEST_EVENT_CODE,
})

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
  // cf-connecting-ip is set by Cloudflare and cannot be spoofed from the client.
  const cfConnectingIp = req.headers['cf-connecting-ip']
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.trim()) {
    return cfConnectingIp.trim()
  }
  if (Array.isArray(cfConnectingIp) && cfConnectingIp[0]) {
    return cfConnectingIp[0].trim()
  }

  // With trust proxy: 1, Express resolves req.ip to the real client IP set by
  // Traefik — raw X-Forwarded-For is not read here to prevent spoofing.
  return req.ip || req.socket?.remoteAddress || 'unknown'
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

const isStoreRateLimited = (store, ip, maxRequests = RATE_LIMIT_MAX_REQUESTS) => {
  const now = Date.now()
  const existingEntries = store.get(ip) || []
  const recentEntries = existingEntries.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recentEntries.length >= maxRequests) {
    store.set(ip, recentEntries)
    return true
  }

  recentEntries.push(now)
  store.set(ip, recentEntries)
  return false
}

const sendMetaLeadEvent = async ({
  email,
  clientIp,
  userAgent,
  sourceUrl,
  eventId,
  projectType,
  service,
  packageSlug,
}) => {
  const metaConfig = buildMetaConfig()
  const event = buildMetaLeadEvent({
    email,
    clientIp,
    userAgent,
    sourceUrl,
    eventId,
    projectType,
    service,
    packageSlug,
  })

  const result = await sendMetaEvents({
    pixelId: metaConfig.pixelId,
    accessToken: metaConfig.accessToken,
    testEventCode: metaConfig.testEventCode,
    events: [event],
  })

  if (result.skipped) {
    console.warn('META CAPI SKIPPED:', {
      reason: result.reason,
      hasPixelId: Boolean(metaConfig.pixelId),
      hasAccessToken: Boolean(metaConfig.accessToken),
    })
    return result
  }

  if (!result.ok) {
    console.error('META CAPI FAILED:', {
      status: result.status,
      body: result.body,
    })
    return result
  }

  console.log('META CAPI SENT:', {
    status: result.status,
    eventsReceived: result.body?.events_received,
  })
  return result
}

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'development'
  ? ['http://localhost:5173', 'http://localhost:4173', 'https://expose-u.com']
  : ['https://expose-u.com']
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and whitelisted origins only.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
}))
app.use(express.json({ limit: '8mb' }))
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

app.post(['/track-lead', '/api/track-lead', '/meta-event', '/api/meta-event'], async (req, res) => {
  const ip = getClientIp(req)
  if (isStoreRateLimited(metaEventRequestStore, ip, 20)) {
    return sendApiError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.')
  }

  const {
    eventName = 'Lead',
    email,
    sourceUrl,
    eventId,
    projectType,
    service,
    package: packageSlug,
  } = req.body || {}

  if (trimValue(eventName) !== 'Lead') {
    return sendApiError(res, 400, 'UNSUPPORTED_EVENT', 'Only Lead events are supported.')
  }

  try {
    const result = await sendMetaLeadEvent({
      email,
      clientIp: ip,
      userAgent: req.get('user-agent'),
      sourceUrl,
      eventId: trimValue(eventId) || randomUUID(),
      projectType,
      service: trimValue(service),
      packageSlug: trimValue(packageSlug),
    })

    if (result.skipped) {
      return sendApiError(res, 500, 'META_CONFIG_MISSING', 'Meta CAPI configuration missing.')
    }

    if (!result.ok) {
      return sendApiError(res, 502, 'META_CAPI_FAILED', 'Meta CAPI request failed.')
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error('Meta event endpoint error', serializeError(error))
    return sendApiError(res, 500, 'META_CAPI_ERROR', 'Meta CAPI request failed.')
  }
})

// Contact endpoint
app.post('/contact', async (req, res) => {
  try {
    const {
      name,
      firstName,
      lastName,
      email,
      projectType,
      service,
      serviceLabel,
      package: packageSlug,
      packageLabel,
      sourceUrl,
      referrer,
      eventId,
      companyWebsite,
      message,
    } = req.body || {}

    const ip = getClientIp(req)
    const trimmedName = trimValue(name)
    const trimmedFirstName = trimValue(firstName)
    const trimmedLastName = trimValue(lastName)
    const trimmedEmail = trimValue(email)
    const trimmedProjectType = trimValue(projectType)
    const trimmedMessage = trimValue(message)
    const trimmedService = trimValue(service)
    const trimmedServiceLabel = trimValue(serviceLabel)
    const trimmedPackage = trimValue(packageSlug)
    const trimmedPackageLabel = trimValue(packageLabel)
    const trimmedSourceUrl = trimValue(sourceUrl)
    const trimmedReferrer = trimValue(referrer)
    const trimmedEventId = trimValue(eventId) || randomUUID()
    const trimmedCompanyWebsite = trimValue(companyWebsite)

    const senderName =
      trimmedName ||
      [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ').trim() ||
      'N/A'

    console.log('CONTACT LEAD META:', {
      ts: new Date().toISOString(),
      ip,
      projectType: trimmedProjectType,
      service: trimmedService,
      package: trimmedPackage,
      sourceUrl: trimmedSourceUrl,
      referrer: trimmedReferrer,
      eventId: trimmedEventId,
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

    if (senderName === 'N/A' || !trimmedEmail) {
      console.error('CONTACT VALIDATION FAILED:', {
        ts: new Date().toISOString(),
        ip,
        hasName: senderName !== 'N/A',
        hasEmail: Boolean(trimmedEmail),
      })
      return sendApiError(res, 400, 'INVALID_PAYLOAD', 'Please provide your name and email.')
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

    const subjectType = trimmedProjectType || trimmedServiceLabel || trimmedService || ''
    const subject = subjectType
      ? `Expose.u Lead - ${subjectType}`
      : 'Expose.u Lead - Website Contact'

    const leadSummary = [
      'Lead Summary',
      ...(trimmedProjectType ? [`Project type: ${trimmedProjectType}`] : []),
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
      trimmedMessage || '(no message)',
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

    await logContactSubmission({
      name: senderName,
      email: trimmedEmail,
      project_type: trimmedProjectType || null,
      service: trimmedService || null,
      service_label: trimmedServiceLabel || null,
      package: trimmedPackage || null,
      package_label: trimmedPackageLabel || null,
      source_url: trimmedSourceUrl || null,
      referrer: trimmedReferrer || null,
      message: trimmedMessage || null,
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error('Contact form error', serializeError(error))
    return sendApiError(res, 500, 'EMAIL_SEND_FAILED', 'Failed to send email.')
  }
})

// Health checks (so HEAD/GET /photo-consent doesn't show 404)
app.get('/photo-consent', (_req, res) => res.status(200).send('OK'))
app.head('/photo-consent', (_req, res) => res.status(200).end())

// Photo consent signature endpoint — unlike the contact form's best-effort Supabase
// logging, storage here is the whole point of the endpoint: if Supabase isn't
// configured or the insert fails, the client needs to know so it can queue the
// signature locally and retry, rather than believing it was saved.
const DATA_URL_PREFIX = 'data:image/png;base64,'

app.post('/photo-consent', async (req, res) => {
  const ip = getClientIp(req)
  if (isStoreRateLimited(photoConsentRequestStore, ip, 20)) {
    return sendApiError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.')
  }

  if (!supabase) {
    console.error('PHOTO CONSENT DB UNAVAILABLE: Supabase not configured.')
    return sendApiError(res, 500, 'DB_UNAVAILABLE', 'Signature storage is not configured.')
  }

  const { name, locationText, latitude, longitude, locationAccuracy, capturedAt, language, signatureImage } =
    req.body || {}

  const trimmedSignature = typeof signatureImage === 'string' ? signatureImage : ''
  if (!trimmedSignature.startsWith(DATA_URL_PREFIX) || trimmedSignature.length <= DATA_URL_PREFIX.length) {
    return sendApiError(res, 400, 'INVALID_PAYLOAD', 'A signature image is required.')
  }

  const toFiniteOrNull = (value) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : null
  }

  const trimmedLanguage = trimValue(language) === 'de' ? 'de' : 'en'
  const clientCapturedAt = (() => {
    const date = new Date(capturedAt)
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
  })()

  try {
    // No .select() after insert: the anon role only has an INSERT policy (write-only,
    // by design, so subject signatures can't be browsed via the API). Requesting the
    // row back would implicitly require SELECT and fail RLS.
    const { error } = await supabase.from('photo_consent_signatures').insert({
      name: trimValue(name) || null,
      location_text: trimValue(locationText) || null,
      latitude: toFiniteOrNull(latitude),
      longitude: toFiniteOrNull(longitude),
      location_accuracy_m: toFiniteOrNull(locationAccuracy),
      signature_image: trimmedSignature,
      language: trimmedLanguage,
      client_captured_at: clientCapturedAt,
      ip,
      user_agent: req.get('user-agent') || null,
    })

    if (error) {
      console.error('PHOTO CONSENT INSERT FAILED:', error.message)
      return sendApiError(res, 500, 'DB_INSERT_FAILED', 'Could not save the signature.')
    }

    console.log('PHOTO CONSENT SAVED:', { ts: new Date().toISOString(), ip })
    return res.json({ ok: true })
  } catch (error) {
    console.error('PHOTO CONSENT ERROR:', serializeError(error))
    return sendApiError(res, 500, 'DB_INSERT_FAILED', 'Could not save the signature.')
  }
})

// Reverse-geocode proxy for the consent page's location auto-fill. Proxied
// server-side (rather than called from the browser) so we can set the
// identifying User-Agent Nominatim's usage policy requires, and keep the
// request volume/rate limited from one place.
//
// This project shoots mostly at transit stations, and Nominatim's plain
// reverse lookup usually snaps to the nearest *street*, not the station
// (e.g. Alexanderplatz's own coordinates resolve to "Mitte", the borough).
// So we first ask Overpass for the nearest actual station/halt within a
// short radius and prefer its name; only if that comes back empty do we
// fall back to Nominatim's address components.
const NOMINATIM_UA = 'expose-u-consent/1.0 (contact: alanxalves@me.com)'
const GEOCODE_TIMEOUT_MS = 4500
const STATION_SEARCH_RADIUS_M = 250

const withTimeout = async (url, options) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), GEOCODE_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

const findNearestStationName = async (lat, lon, lang) => {
  const query = `[out:json][timeout:4];(node(around:${STATION_SEARCH_RADIUS_M},${lat},${lon})["railway"~"^(station|halt)$"];node(around:${STATION_SEARCH_RADIUS_M},${lat},${lon})["public_transport"="station"];);out body 10;`

  const response = await withTimeout('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': NOMINATIM_UA },
    body: `data=${encodeURIComponent(query)}`,
  })
  if (!response.ok) return null

  const data = await response.json()
  const elements = Array.isArray(data?.elements) ? data.elements : []
  if (elements.length === 0) return null

  let nearest = null
  let nearestDistance = Infinity
  for (const el of elements) {
    const name = el.tags?.[`name:${lang}`] || el.tags?.name
    if (!name || typeof el.lat !== 'number' || typeof el.lon !== 'number') continue
    const distance = haversineMeters(lat, lon, el.lat, el.lon)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = name
    }
  }
  return nearest
}

const pickAddressLabel = (data) => {
  const address = data?.address || {}
  return (
    address.station ||
    address.railway ||
    data?.name ||
    address.road ||
    address.quarter ||
    address.neighbourhood ||
    address.suburb ||
    address.borough ||
    address.city_district ||
    null
  )
}

const findAddressLabel = async (lat, lon, lang) => {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  url.searchParams.set('zoom', '17')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', lang)

  const response = await withTimeout(url, { headers: { 'User-Agent': NOMINATIM_UA } })
  if (!response.ok) return null

  const data = await response.json()
  return pickAddressLabel(data)
}

app.get('/reverse-geocode', async (req, res) => {
  const ip = getClientIp(req)
  if (isStoreRateLimited(reverseGeocodeRequestStore, ip, 15)) {
    return sendApiError(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.')
  }

  const lat = Number(req.query.lat)
  const lon = Number(req.query.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return sendApiError(res, 400, 'INVALID_PAYLOAD', 'lat and lon query params are required.')
  }

  const lang = trimValue(req.query.lang) === 'de' ? 'de' : 'en'

  try {
    const stationName = await findNearestStationName(lat, lon, lang).catch(() => null)
    if (stationName) {
      return res.json({ ok: true, label: stationName })
    }

    const addressLabel = await findAddressLabel(lat, lon, lang).catch(() => null)
    return res.json({ ok: true, label: addressLabel || null })
  } catch (error) {
    console.error('REVERSE GEOCODE ERROR:', serializeError(error))
    return sendApiError(res, 500, 'GEOCODE_ERROR', 'Reverse geocode lookup failed.')
  }
})

app.get('/smtp-test', async (req, res) => {
  const ip = getClientIp(req)
  if (isStoreRateLimited(smtpTestRequestStore, ip)) {
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
