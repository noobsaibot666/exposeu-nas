import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
  normalizeLocalePathname,
  switchLocalePath,
} from '../../src/i18n/routing.js'

test('detects english as the default locale', () => {
  assert.equal(getLocaleFromPathname('/'), DEFAULT_LOCALE)
  assert.equal(getLocaleFromPathname('/about'), 'en')
})

test('detects german from the /de path prefix', () => {
  assert.equal(getLocaleFromPathname('/de'), 'de')
  assert.equal(getLocaleFromPathname('/de/contact'), 'de')
})

test('normalizes locale-prefixed paths back to canonical english paths', () => {
  assert.equal(normalizeLocalePathname('/de'), '/')
  assert.equal(normalizeLocalePathname('/de/contact'), '/contact')
  assert.equal(normalizeLocalePathname('/portfolio'), '/portfolio')
})

test('adds the german prefix while preserving query strings and hash fragments', () => {
  assert.equal(localizePath('/contact?service=brand-agency#form', 'de'), '/de/contact?service=brand-agency#form')
  assert.equal(localizePath('/contact?service=brand-agency#form', 'en'), '/contact?service=brand-agency#form')
})

test('switches between locale variants for the same logical page', () => {
  assert.equal(switchLocalePath('/services/artist-sessions', 'de'), '/de/services/artist-sessions')
  assert.equal(switchLocalePath('/de/services/artist-sessions?package=single-event', 'en'), '/services/artist-sessions?package=single-event')
})
