import { createHash } from 'node:crypto'

const GRAPH_API_VERSION = 'v18.0'

const trimValue = (value) => (typeof value === 'string' ? value.trim() : '')

export const hashEmail = (email) => {
  const normalized = trimValue(email).toLowerCase()
  if (!normalized) return null
  return createHash('sha256').update(normalized).digest('hex')
}

export const buildMetaLeadEvent = ({
  email,
  clientIp,
  userAgent,
  sourceUrl,
  eventId,
  projectType,
  eventTime = Math.floor(Date.now() / 1000),
}) => {
  const emailHash = hashEmail(email)
  const userData = {
    ...(emailHash ? { em: [emailHash] } : {}),
    ...(trimValue(clientIp) ? { client_ip_address: trimValue(clientIp) } : {}),
    ...(trimValue(userAgent) ? { client_user_agent: trimValue(userAgent) } : {}),
  }

  return {
    event_name: 'Lead',
    event_time: eventTime,
    ...(trimValue(eventId) ? { event_id: trimValue(eventId) } : {}),
    action_source: 'website',
    ...(trimValue(sourceUrl) ? { event_source_url: trimValue(sourceUrl) } : {}),
    user_data: userData,
    ...(trimValue(projectType) ? { custom_data: { content_name: trimValue(projectType) } } : {}),
  }
}

export const sendMetaEvents = async ({
  pixelId,
  accessToken,
  events,
  testEventCode,
  fetchImpl = fetch,
}) => {
  const trimmedPixelId = trimValue(pixelId)
  const trimmedAccessToken = trimValue(accessToken)
  const data = Array.isArray(events) ? events : []

  if (!trimmedPixelId || !trimmedAccessToken || data.length === 0) {
    return {
      ok: false,
      skipped: true,
      reason: 'missing_config_or_events',
    }
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${trimmedPixelId}/events`)
  url.searchParams.set('access_token', trimmedAccessToken)

  const response = await fetchImpl(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      ...(trimValue(testEventCode) ? { test_event_code: trimValue(testEventCode) } : {}),
    }),
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  return {
    ok: response.ok,
    status: response.status,
    body,
  }
}
