import jwt from 'jsonwebtoken'

const jwtSecret = process.env.API_JWT_SECRET || 'change-this'

export function signToken(payload: object) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '12h' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret)
}
