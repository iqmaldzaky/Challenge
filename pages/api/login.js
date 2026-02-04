import { getUserByIdentifier } from '../../lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { isBlocked, incrFailed, resetAttempts } from '../../lib/rateLimit'

const RATE_LIMIT_OPTS = { windowMs: 60 * 1000, max: 5 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { identifier, password } = req.body
  if (!identifier || !password) return res.status(400).json({ error: 'Harap isi semua field' })

  const { blocked, remaining, reset } = isBlocked(req, RATE_LIMIT_OPTS)
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_OPTS.max)
  res.setHeader('X-RateLimit-Remaining', remaining)

  if (blocked) {
    res.setHeader('Retry-After', String(reset))
    return res.status(429).json({ error: `Terlalu banyak percobaan. Coba lagi dalam ${reset}s` })
  }

  try {
    const user = await getUserByIdentifier(identifier)
    if (!user) {
      incrFailed(req, RATE_LIMIT_OPTS)
      return res.status(401).json({ error: 'Email atau Username salah' })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      incrFailed(req, RATE_LIMIT_OPTS)
      return res.status(401).json({ error: 'Password salah' })
    }

    resetAttempts(req)

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    }))

    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}