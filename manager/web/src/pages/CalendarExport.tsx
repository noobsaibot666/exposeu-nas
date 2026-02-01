import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { apiBase, apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import './CalendarExport.css'

function CalendarExport() {
  const { token } = useAuth()
  const [calendarToken, setCalendarToken] = useState('')
  const [includeSteps, setIncludeSteps] = useState(true)
  const [mode, setMode] = useState<'due' | 'range'>('due')
  const [status, setStatus] = useState('')
  const location = useLocation()
  const projectId = new URLSearchParams(location.search).get('projectId')

  useEffect(() => {
    if (!token) return
    apiRequest<{ token: string }>('/calendar/token', {}, token)
      .then((data) => {
        setCalendarToken(data.token)
        setStatus('')
      })
      .catch((error) => {
        const message =
          error instanceof Error && error.message ? error.message : 'Unable to load calendar token.'
        setStatus(message)
      })
  }, [token])

  const feedUrl = useMemo(() => {
    if (!calendarToken) return ''
    const params = new URLSearchParams()
    params.set('includeSteps', includeSteps ? '1' : '0')
    params.set('mode', mode)
    if (projectId) params.set('projectId', projectId)
    return `${apiBase}/calendar/${calendarToken}?${params.toString()}`
  }, [calendarToken, includeSteps, mode, projectId])

  const handleDownload = () => {
    if (projectId) {
      const params = new URLSearchParams()
      params.set('includeSteps', includeSteps ? '1' : '0')
      params.set('mode', mode)
      window.location.href = `${apiBase}/calendar/project/${projectId}?${params.toString()}`
      return
    }
    if (!feedUrl) return
    window.location.href = feedUrl
  }

  const handleCopy = async () => {
    if (!feedUrl) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(feedUrl)
        setStatus('Link copied.')
        return
      }
    } catch {
      // fall back to manual copy
    }

    const textarea = document.createElement('textarea')
    textarea.value = feedUrl
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const success = document.execCommand('copy')
      setStatus(success ? 'Link copied.' : 'Copy failed. Please copy manually.')
    } catch {
      setStatus('Copy failed. Please copy manually.')
    } finally {
      document.body.removeChild(textarea)
    }
  }

  return (
    <Layout title="Calendar export">
      <div className="calendar-export">
        <section className="calendar-export__card">
          <div>
            <p className="eyebrow">Sync</p>
            <h3>Subscribe in Google or Apple Calendar</h3>
            <p className="muted">
              Use the private link below to keep {projectId ? 'this project' : 'all projects'} synced.
            </p>
          </div>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={includeSteps}
              onChange={(event) => setIncludeSteps(event.target.checked)}
            />
            Include workflow step due dates
          </label>
          <label>
            Event type
            <select value={mode} onChange={(event) => setMode(event.target.value === 'range' ? 'range' : 'due')}>
              <option value="due">Due date only</option>
              <option value="range">Start → Due range</option>
            </select>
          </label>
          <div className="calendar-export__link">
            <input readOnly value={feedUrl || 'Loading...'} />
            <button type="button" className="button button--ghost" onClick={handleCopy} disabled={!feedUrl}>
              Copy link
            </button>
          </div>
          {status && <p className="muted">{status}</p>}
          <p className="muted">Add this URL as a subscribed calendar in Google/Apple.</p>
        </section>

        <section className="calendar-export__card">
          <div>
            <p className="eyebrow">Download</p>
            <h3>Download iCal file</h3>
            <p className="muted">
              One-time export of {projectId ? 'this project' : 'all project'} due dates.
            </p>
          </div>
          <button type="button" className="button calendar-export__download" onClick={handleDownload}>
            Download .ics
          </button>
        </section>
      </div>
    </Layout>
  )
}

export default CalendarExport
