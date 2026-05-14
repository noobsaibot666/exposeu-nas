import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import {
  buildMetaLeadEvent,
  hashEmail,
  sendMetaEvents,
} from '../../server/metaConversions.js'

test('hashEmail normalizes email before hashing with SHA-256', () => {
  const expected = createHash('sha256').update('lead@example.com').digest('hex')

  assert.equal(hashEmail(' Lead@Example.COM '), expected)
  assert.equal(hashEmail(''), null)
})

test('buildMetaLeadEvent includes dedupe event id and user data', () => {
  const event = buildMetaLeadEvent({
    email: 'lead@example.com',
    clientIp: '203.0.113.10',
    userAgent: 'Mozilla/5.0',
    sourceUrl: 'https://expose-u.com/contact',
    eventId: 'lead-123',
    projectType: 'Concert / Event',
    eventTime: 1_762_997_200,
  })

  assert.equal(event.event_name, 'Lead')
  assert.equal(event.event_id, 'lead-123')
  assert.equal(event.event_time, 1_762_997_200)
  assert.equal(event.action_source, 'website')
  assert.equal(event.event_source_url, 'https://expose-u.com/contact')
  assert.equal(event.user_data.client_ip_address, '203.0.113.10')
  assert.equal(event.user_data.client_user_agent, 'Mozilla/5.0')
  assert.equal(event.user_data.em.length, 1)
  assert.equal(event.custom_data.content_name, 'Concert / Event')
})

test('sendMetaEvents posts to the configured Meta Graph endpoint', async () => {
  const calls = []
  const response = await sendMetaEvents({
    pixelId: '123456789',
    accessToken: 'token value',
    events: [{ event_name: 'Lead' }],
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        status: 200,
        json: async () => ({ events_received: 1 }),
      }
    },
  })

  assert.deepEqual(response, { ok: true, status: 200, body: { events_received: 1 } })
  assert.equal(calls.length, 1)
  assert.equal(
    calls[0].url,
    'https://graph.facebook.com/v18.0/123456789/events?access_token=token+value',
  )
  assert.equal(calls[0].options.method, 'POST')
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json')
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    data: [{ event_name: 'Lead' }],
  })
})
