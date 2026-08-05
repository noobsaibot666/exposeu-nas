import { useEffect, useMemo, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import SignaturePad, { type SignaturePadHandle } from '../components/SignaturePad'
import './PhotoConsent.css'

type Mode = 'dark' | 'light'
type Lang = 'en' | 'de'

const PENDING_QUEUE_KEY = 'photoConsentPendingQueue'

function resolvePhotoConsentEndpoint(): string {
  const raw = String(import.meta.env.VITE_CONTACT_API_BASE || '').trim()
  if (!raw) return '/api/photo-consent'
  const base = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
  return `${base.replace(/\/+$/, '')}/api/photo-consent`
}

const PALETTE: Record<Mode, { bg: string; text: string; textMuted: string; border: string; ink: string }> = {
  dark: {
    bg: '#050507',
    text: '#f5f5f4',
    textMuted: 'rgba(245, 245, 244, 0.6)',
    border: 'rgba(245, 245, 244, 0.18)',
    ink: '#f5f5f4',
  },
  light: {
    bg: '#fbfbfa',
    text: '#0b0b0c',
    textMuted: 'rgba(11, 11, 12, 0.6)',
    border: 'rgba(11, 11, 12, 0.14)',
    ink: '#0b0b0c',
  },
}

const COPY: Record<
  Lang,
  {
    heading: string
    lede: string
    terms: string[]
    nameLabel: string
    namePlaceholder: string
    signLabel: string
    clear: string
    signHint: string
    logSummary: string
    locationLabel: string
    locationPlaceholder: string
    loggedAutomatically: string
    gpsCaptured: string
    gpsUnavailable: string
    saveBtn: string
    saving: string
    startOver: string
    savedTitle: string
    savedBody: string
    savedPendingBody: string
    nextPerson: string
    error: string
    consentText: string
    fieldSignature: string
    fieldDate: string
    fieldLocation: string
    fieldName: string
    fieldNameEmpty: string
  }
> = {
  en: {
    heading: 'Photo Release',
    lede: "You’re being photographed as part of a personal art project. Before you sign, please read this:",
    terms: [
      'Your photo, and any handwritten text you add, may be exhibited and/or published.',
      'You do not need to give your legal name — sign however you like: initials, a nickname, or leave it blank.',
      'This is voluntary. You can say no at any time, for any reason.',
    ],
    nameLabel: 'Name (optional)',
    namePlaceholder: 'Leave blank if you prefer',
    signLabel: 'Sign to confirm you agree',
    clear: 'Clear',
    signHint: 'Sign here with your finger',
    logSummary: "Photographer’s log (optional)",
    locationLabel: 'Location / station',
    locationPlaceholder: 'e.g. S-Bahn Alexanderplatz',
    loggedAutomatically: 'Logged automatically',
    gpsCaptured: 'GPS location captured',
    gpsUnavailable: 'GPS location not available',
    saveBtn: 'Save Signed Release',
    saving: 'Saving…',
    startOver: 'Start Over',
    savedTitle: 'Saved',
    savedBody: 'The signed release has been saved.',
    savedPendingBody: "Saved on this device. It'll sync automatically once you're back online.",
    nextPerson: 'Next Person',
    error: 'Could not save the record. Try again, or take a screenshot as a backup.',
    consentText:
      'I agree that my photo, and any handwritten text I add, may be exhibited and/or published. I understand I do not need to give my legal name, and that I gave this consent verbally before the photo was taken.',
    fieldSignature: 'Signature',
    fieldDate: 'Date',
    fieldLocation: 'Location',
    fieldName: 'Name given',
    fieldNameEmpty: '(none — anonymous)',
  },
  de: {
    heading: 'Fotoerlaubnis',
    lede:
      'Du wirst im Rahmen eines persönlichen Kunstprojekts fotografiert. Bitte lies dir Folgendes durch, bevor du unterschreibst:',
    terms: [
      'Dein Foto und jeder handschriftliche Text, den du hinzufügst, können ausgestellt und/oder veröffentlicht werden.',
      'Du musst deinen echten Namen nicht angeben — unterschreibe, wie du möchtest: mit Initialen, einem Spitznamen oder gar nicht.',
      'Das Ganze ist freiwillig. Du kannst jederzeit und ohne Angabe von Gründen ablehnen.',
    ],
    nameLabel: 'Name (optional)',
    namePlaceholder: 'Leer lassen, wenn du möchtest',
    signLabel: 'Unterschreibe, um dein Einverständnis zu bestätigen',
    clear: 'Löschen',
    signHint: 'Hier mit dem Finger unterschreiben',
    logSummary: 'Fotografen-Log (optional)',
    locationLabel: 'Ort / Station',
    locationPlaceholder: 'z. B. S-Bahn Alexanderplatz',
    loggedAutomatically: 'Automatisch erfasst',
    gpsCaptured: 'GPS-Standort erfasst',
    gpsUnavailable: 'GPS-Standort nicht verfügbar',
    saveBtn: 'Unterschriebene Freigabe speichern',
    saving: 'Wird gespeichert…',
    startOver: 'Neu beginnen',
    savedTitle: 'Gespeichert',
    savedBody: 'Die unterschriebene Freigabe wurde gespeichert.',
    savedPendingBody: 'Auf diesem Gerät gespeichert. Wird automatisch synchronisiert, sobald du wieder online bist.',
    nextPerson: 'Nächste Person',
    error: 'Der Eintrag konnte nicht gespeichert werden. Versuche es erneut oder mach einen Screenshot als Sicherung.',
    consentText:
      'Ich stimme zu, dass mein Foto und jeder handschriftliche Text, den ich hinzufüge, ausgestellt und/oder veröffentlicht werden können. Mir ist bewusst, dass ich meinen echten Namen nicht angeben muss und dass ich dieser Einwilligung bereits mündlich zugestimmt habe, bevor das Foto aufgenommen wurde.',
    fieldSignature: 'Unterschrift',
    fieldDate: 'Datum',
    fieldLocation: 'Ort',
    fieldName: 'Angegebener Name',
    fieldNameEmpty: '(keiner — anonym)',
  },
}

interface GeoState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  status: 'pending' | 'granted' | 'unavailable'
}

interface PendingSignature {
  name: string
  locationText: string
  latitude: number | null
  longitude: number | null
  locationAccuracy: number | null
  capturedAt: string
  language: Lang
  signatureImage: string
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

async function buildRecordImage(options: {
  name: string
  location: string
  signatureDataUrl: string
  mode: Mode
  lang: Lang
}): Promise<string> {
  await document.fonts.ready
  const copy = COPY[options.lang]

  return new Promise((resolve, reject) => {
    const colors = PALETTE[options.mode]
    const width = 1000
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = 1400 // provisional, cropped below
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas not supported'))
      return
    }

    const marginX = 64
    const contentWidth = width - marginX * 2
    let y = 90

    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = colors.text
    ctx.font = '700 40px Satoshi, "Helvetica Neue", Arial, sans-serif'
    ctx.fillText(copy.heading, marginX, y)
    y += 70

    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(marginX, y)
    ctx.lineTo(width - marginX, y)
    ctx.stroke()
    y += 56

    ctx.fillStyle = colors.text
    ctx.font = '400 26px Satoshi, "Helvetica Neue", Arial, sans-serif'
    const lines = wrapText(ctx, copy.consentText, contentWidth)
    for (const line of lines) {
      ctx.fillText(line, marginX, y)
      y += 38
    }
    y += 40

    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(marginX, y)
    ctx.lineTo(width - marginX, y)
    ctx.stroke()
    y += 56

    ctx.fillStyle = colors.textMuted
    ctx.font = '400 20px Satoshi, "Helvetica Neue", Arial, sans-serif'
    const now = new Date()
    const dateLabel = now.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    ctx.fillText(`${copy.fieldDate}: ${dateLabel}`, marginX, y)
    y += 34
    ctx.fillText(`${copy.fieldLocation}: ${options.location || '—'}`, marginX, y)
    y += 34
    ctx.fillText(`${copy.fieldName}: ${options.name || copy.fieldNameEmpty}`, marginX, y)
    y += 60

    ctx.fillStyle = colors.textMuted
    ctx.font = '400 20px Satoshi, "Helvetica Neue", Arial, sans-serif'
    ctx.fillText(copy.fieldSignature, marginX, y)
    y += 24

    const sigBoxHeight = 260
    const sigBoxTop = y
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1.5
    ctx.strokeRect(marginX, sigBoxTop, contentWidth, sigBoxHeight)

    const sigImg = new Image()
    sigImg.onload = () => {
      const padding = 16
      const boxW = contentWidth - padding * 2
      const boxH = sigBoxHeight - padding * 2
      const scale = Math.min(boxW / sigImg.width, boxH / sigImg.height)
      const drawW = sigImg.width * scale
      const drawH = sigImg.height * scale
      const drawX = marginX + (contentWidth - drawW) / 2
      const drawY = sigBoxTop + (sigBoxHeight - drawH) / 2
      ctx.drawImage(sigImg, drawX, drawY, drawW, drawH)

      const finalHeight = sigBoxTop + sigBoxHeight + 60
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = width
      finalCanvas.height = finalHeight
      const finalCtx = finalCanvas.getContext('2d')
      if (!finalCtx) {
        reject(new Error('Canvas not supported'))
        return
      }
      finalCtx.drawImage(canvas, 0, 0, width, finalHeight, 0, 0, width, finalHeight)
      resolve(finalCanvas.toDataURL('image/png'))
    }
    sigImg.onerror = () => reject(new Error('Could not load signature'))
    sigImg.src = options.signatureDataUrl
  })
}

function getPreferredMode(): Mode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getPreferredLang(): Lang {
  if (typeof navigator === 'undefined') return 'en'
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

function getInitialGeoStatus(): GeoState['status'] {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return 'unavailable'
  return 'pending'
}

function readQueue(): PendingSignature[] {
  try {
    const raw = localStorage.getItem(PENDING_QUEUE_KEY)
    return raw ? (JSON.parse(raw) as PendingSignature[]) : []
  } catch {
    return []
  }
}

function writeQueue(queue: PendingSignature[]) {
  try {
    localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue))
  } catch {
    /* storage unavailable — nothing more we can do client-side */
  }
}

async function submitSignature(payload: PendingSignature): Promise<boolean> {
  const res = await fetch(resolvePhotoConsentEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.ok
}

async function flushQueue() {
  const queue = readQueue()
  if (queue.length === 0) return

  const remaining: PendingSignature[] = []
  for (const item of queue) {
    try {
      const ok = await submitSignature(item)
      if (!ok) remaining.push(item)
    } catch {
      remaining.push(item)
    }
  }
  writeQueue(remaining)
}

function PhotoConsent() {
  const sigPadRef = useRef<SignaturePadHandle>(null)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [hasSignature, setHasSignature] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [dbSynced, setDbSynced] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [mode, setMode] = useState<Mode>(getPreferredMode)
  const [lang, setLang] = useState<Lang>(getPreferredLang)
  const [geo, setGeo] = useState<GeoState>(() => ({
    latitude: null,
    longitude: null,
    accuracy: null,
    status: getInitialGeoStatus(),
  }))

  const copy = COPY[lang]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => setMode(e.matches ? 'light' : 'dark')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    flushQueue()
    window.addEventListener('online', flushQueue)
    return () => window.removeEventListener('online', flushQueue)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          status: 'granted',
        })
      },
      () => {
        setGeo((g) => ({ ...g, status: 'unavailable' }))
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  }, [])

  const canSave = hasSignature && status !== 'saving'

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    [],
  )

  const handleSave = async () => {
    const dataUrl = sigPadRef.current?.toDataURL()
    if (!dataUrl) return

    setStatus('saving')
    setErrorMessage('')

    const payload: PendingSignature = {
      name: name.trim(),
      locationText: location.trim(),
      latitude: geo.latitude,
      longitude: geo.longitude,
      locationAccuracy: geo.accuracy,
      capturedAt: new Date().toISOString(),
      language: lang,
      signatureImage: dataUrl,
    }

    let synced = false
    try {
      synced = await submitSignature(payload)
      if (!synced) {
        const queue = readQueue()
        queue.push(payload)
        writeQueue(queue)
      }
    } catch {
      const queue = readQueue()
      queue.push(payload)
      writeQueue(queue)
      synced = false
    }

    try {
      const recordUrl = await buildRecordImage({ name, location, signatureDataUrl: dataUrl, mode, lang })

      const filenameSafeLocation = location.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      const filename = `consent_${new Date().toISOString().slice(0, 10)}${
        filenameSafeLocation ? `_${filenameSafeLocation}` : ''
      }.png`

      const blob = await (await fetch(recordUrl)).blob()
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: copy.heading })
      } else {
        const link = document.createElement('a')
        link.href = recordUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setDbSynced(synced)
      setStatus('saved')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setDbSynced(synced)
        setStatus('saved')
        return
      }
      setStatus('error')
      setErrorMessage(copy.error)
    }
  }

  const handleReset = () => {
    sigPadRef.current?.clear()
    setName('')
    setLocation('')
    setHasSignature(false)
    setStatus('idle')
    setErrorMessage('')
  }

  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'))
  const toggleLang = () => setLang((l) => (l === 'en' ? 'de' : 'en'))

  if (status === 'saved') {
    return (
      <main className="photo-consent" data-mode={mode}>
        <div className="photo-consent__card photo-consent__card--done">
          <div className="photo-consent__done-check">&#10003;</div>
          <h1>{copy.savedTitle}</h1>
          <p>{dbSynced ? copy.savedBody : copy.savedPendingBody}</p>
          <button type="button" className="photo-consent__btn photo-consent__btn--primary" onClick={handleReset}>
            {copy.nextPerson}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="photo-consent" data-mode={mode}>
      <div className="photo-consent__card">
        <div className="photo-consent__top">
          <button type="button" className="photo-consent__lang-toggle" onClick={toggleLang} aria-label="Toggle language">
            {lang === 'en' ? 'DE' : 'EN'}
          </button>
          <button
            type="button"
            className="photo-consent__mode-toggle"
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <h1 className="photo-consent__title">{copy.heading}</h1>

        <p className="photo-consent__lede">{copy.lede}</p>

        <ul className="photo-consent__terms">
          {copy.terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>

        <label className="photo-consent__field">
          <span>{copy.nameLabel}</span>
          <input
            type="text"
            inputMode="text"
            placeholder={copy.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </label>

        <div className="photo-consent__sign-block">
          <div className="photo-consent__sign-label">
            <span>{copy.signLabel}</span>
            {hasSignature && (
              <button
                type="button"
                className="photo-consent__clear"
                onClick={() => {
                  sigPadRef.current?.clear()
                }}
              >
                {copy.clear}
              </button>
            )}
          </div>
          <SignaturePad ref={sigPadRef} onChange={setHasSignature} strokeColor={PALETTE[mode].ink} />
        </div>

        <details className="photo-consent__log">
          <summary>{copy.logSummary}</summary>
          <label className="photo-consent__field">
            <span>{copy.locationLabel}</span>
            <input
              type="text"
              inputMode="text"
              placeholder={copy.locationPlaceholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete="off"
            />
          </label>
          <p className="photo-consent__log-date">
            {copy.loggedAutomatically}: {dateLabel} &middot;{' '}
            {geo.status === 'granted' ? copy.gpsCaptured : copy.gpsUnavailable}
          </p>
        </details>

        {status === 'error' && <p className="photo-consent__error">{errorMessage}</p>}

        <button
          type="button"
          className="photo-consent__btn photo-consent__btn--primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          {status === 'saving' ? copy.saving : copy.saveBtn}
        </button>

        <button type="button" className="photo-consent__btn photo-consent__btn--ghost" onClick={handleReset}>
          {copy.startOver}
        </button>
      </div>
    </main>
  )
}

export default PhotoConsent
