import { query, createUser } from '../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, username, password } = req.body
  if (!email || !username || !password) return res.status(400).json({ error: 'Semua field wajib diisi' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Format email tidak valid' })

  const existing = await query('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username])
  if (existing.length > 0) return res.status(409).json({ error: 'Email atau username sudah terdaftar' })

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const userId = await createUser({ email, username, passwordHash })
    return res.status(201).json({ ok: true, userId })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}