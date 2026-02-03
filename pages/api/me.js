import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { query } from '../../lib/db'

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const rows = await query('SELECT id, email, username FROM users WHERE id = ? LIMIT 1', [payload.id])
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    return res.json({ user: rows[0] })
  } catch (e) {
    return res.status(401).json({ error: 'Token tidak valid' })
  }
}