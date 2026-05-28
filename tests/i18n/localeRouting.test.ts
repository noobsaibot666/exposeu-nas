import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localizePath,
  normalizeLocalePathname,
  switchLocalePath,
} from '../../src/i18n/routing.js'
import { getMetaForPath } from '../../src/i18n/pageMetaConfig.js'
import { getLocalizedCanonicalUrl } from '../../src/i18n/seoUrl.js'
import { serviceMeta } from '../../src/data/serviceMeta.js'

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

test('maps concerts berlin to its route-specific meta', () => {
  const meta = getMetaForPath('/concerts-berlin')

  assert.equal(meta.titleKey, 'common.meta.concertsBerlin.title')
  assert.equal(meta.descriptionKey, 'common.meta.concertsBerlin.description')
  assert.equal(meta.noAlternates, undefined)
})

test('maps release content kit to its route-specific meta', () => {
  const meta = getMetaForPath('/release-content-kit')

  assert.equal(meta.titleKey, 'common.meta.releaseContentKit.title')
  assert.equal(meta.descriptionKey, 'common.meta.releaseContentKit.description')
})

test('maps ad landing pages to route-specific meta', () => {
  const exhibition = getMetaForPath('/exhibition-gallery')
  const brand = getMetaForPath('/brand-agency')

  assert.equal(exhibition.titleKey, 'common.meta.exhibitionGalleryLanding.title')
  assert.equal(exhibition.descriptionKey, 'common.meta.exhibitionGalleryLanding.description')
  assert.equal(brand.titleKey, 'common.meta.brandAgencyLanding.title')
  assert.equal(brand.descriptionKey, 'common.meta.brandAgencyLanding.description')
})

test('registers release content kit as a tracked service offer', () => {
  assert.equal(serviceMeta['release-content-kit'].slug, 'release-content-kit')
  assert.equal(serviceMeta['release-content-kit'].href, '/release-content-kit')
  assert.equal(serviceMeta['release-content-kit'].labelKey, 'services.labels.release-content-kit')
})

test('localizes canonical URLs for locale-specific pages', () => {
  assert.equal(getLocalizedCanonicalUrl('https://expose-u.com/portfolio', 'en'), 'https://expose-u.com/portfolio')
  assert.equal(getLocalizedCanonicalUrl('https://expose-u.com/portfolio', 'de'), 'https://expose-u.com/de/portfolio')
  assert.equal(getLocalizedCanonicalUrl('https://expose-u.com/', 'de'), 'https://expose-u.com/de')
})
