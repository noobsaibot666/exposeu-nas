import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiBase } from '../components/api'
import '../styles/share.css'

type ShareProject = {
  id: number
  title: string
  service_type: string | null
  plan_tier: string | null
}

type ShareFile = {
  id: number
  filename: string
}

type ShareDelivery = {
  title: string
  url: string
}

function SharePage() {
  const { token } = useParams()
  const [project, setProject] = useState<ShareProject | null>(null)
  const [files, setFiles] = useState<ShareFile[]>([])
  const [deliveries, setDeliveries] = useState<ShareDelivery[]>([])
  const [activeDelivery, setActiveDelivery] = useState<ShareDelivery | null>(null)

  useEffect(() => {
    if (!token) return
    fetch(`${apiBase}/share/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project)
        setFiles(data.files)
        setDeliveries(data.deliveries)
      })
  }, [token])

  if (!project) {
    return <div className="share-page">Loading...</div>
  }

  return (
    <div className="share-page">
      <div className="share-page__container">
        <header className="share-page__header">
          <div>
            <p className="eyebrow">Exposeu delivery</p>
            <h1>{project.title}</h1>
            <p className="share-page__meta">{project.service_type ?? 'Project'} · {project.plan_tier ?? 'Custom'}</p>
          </div>
          <div className="share-page__header-actions">
            <a className="share-page__dashboard" href="/">
              Dashboard
            </a>
            <div className="share-page__badge">expose.u</div>
          </div>
        </header>
        <section className="share-page__section">
        <div className="share-page__section-header">
          <div>
            <p className="eyebrow">Assets</p>
            <h2>Downloads</h2>
            <p className="share-page__meta">Final files ready for client delivery.</p>
          </div>
        </div>
        <ul className="share-page__list">
          {files.map((file) => (
            <li key={file.id}>
              <a href={`${apiBase}/share/${token}/files/${file.id}`}>{file.filename}</a>
            </li>
          ))}
        </ul>
        </section>
        <section className="share-page__section">
        <div className="share-page__section-header">
          <div>
            <p className="eyebrow">Review</p>
            <h2>Delivery links</h2>
            <p className="share-page__meta">Open a secure link when you are ready.</p>
          </div>
        </div>
        <ul className="share-page__list">
          {deliveries.map((delivery) => (
            <li key={delivery.title}>
              <button
                type="button"
                className="share-page__link"
                onClick={() => setActiveDelivery(delivery)}
              >
                {delivery.title}
              </button>
            </li>
          ))}
        </ul>
        </section>
      </div>
      {activeDelivery && (
        <div className="share-modal" role="dialog" aria-modal="true">
          <div className="share-modal__overlay" onClick={() => setActiveDelivery(null)} />
          <div className="share-modal__content">
            <div>
              <p className="eyebrow">Delivery link</p>
              <h3>Link ready to download</h3>
              <p className="share-page__meta">
                {activeDelivery.title}
              </p>
            </div>
            <a
              className="share-modal__action"
              href={activeDelivery.url}
              target="_blank"
              rel="noreferrer"
            >
              Click here to download
            </a>
            <button type="button" className="share-modal__close" onClick={() => setActiveDelivery(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharePage
