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
      <header className="share-page__header">
        <div>
          <p className="share-page__eyebrow">Exposeu delivery</p>
          <h1>{project.title}</h1>
          <p className="share-page__meta">{project.service_type ?? 'Project'} · {project.plan_tier ?? 'Custom'}</p>
        </div>
        <div className="share-page__badge">expose.u</div>
      </header>
      <section className="share-page__section">
        <h2>Downloads</h2>
        <ul className="share-page__list">
          {files.map((file) => (
            <li key={file.id}>
              <a href={`${apiBase}/share/${token}/files/${file.id}`}>{file.filename}</a>
            </li>
          ))}
        </ul>
      </section>
      <section className="share-page__section">
        <h2>Delivery links</h2>
        <ul className="share-page__list">
          {deliveries.map((delivery) => (
            <li key={delivery.title}>
              <a href={delivery.url} target="_blank" rel="noreferrer">
                {delivery.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default SharePage
