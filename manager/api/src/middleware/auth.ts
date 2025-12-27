import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/tokens.js'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Missing auth token.' })
  }

  const [, token] = header.split(' ')
  if (!token) {
    return res.status(401).json({ error: 'Invalid auth token.' })
  }

  try {
    req.user = verifyToken(token)
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid auth token.' })
  }
}
