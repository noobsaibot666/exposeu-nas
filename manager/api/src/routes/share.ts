import { Router } from 'express'
import path from 'path'
import { query } from '../db.js'

const router = Router()
const uploadDir = process.env.API_UPLOAD_DIR || '/uploads'

router.get('/:token', async (req, res) => {
  const token = req.params.token
  const link = await query('SELECT project_id FROM share_links WHERE token = $1', [token])
  const linkRow = link.rows[0]
  if (!linkRow) return res.status(404).json({ error: 'Not found.' })

  const project = await query('SELECT id, title, service_type, plan_tier FROM projects WHERE id = $1', [linkRow.project_id])
  const files = await query('SELECT id, filename, stored_path, created_at FROM files WHERE project_id = $1', [linkRow.project_id])
  const deliveries = await query('SELECT title, url, created_at FROM deliveries WHERE project_id = $1', [linkRow.project_id])

  return res.json({
    project: project.rows[0],
    files: files.rows,
    deliveries: deliveries.rows,
  })
})

router.get('/:token/files/:fileId', async (req, res) => {
  const token = req.params.token
  const fileId = Number(req.params.fileId)
  const link = await query('SELECT project_id FROM share_links WHERE token = $1', [token])
  const linkRow = link.rows[0]
  if (!linkRow) return res.status(404).json({ error: 'Not found.' })

  const file = await query('SELECT filename, stored_path FROM files WHERE id = $1 AND project_id = $2', [
    fileId,
    linkRow.project_id,
  ])
  const fileRow = file.rows[0]
  if (!fileRow) return res.status(404).json({ error: 'File not found.' })

  const resolved = path.resolve(uploadDir, path.basename(fileRow.stored_path))
  return res.download(resolved, fileRow.filename)
})

export default router
