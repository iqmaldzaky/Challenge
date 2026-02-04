// Simple in-memory rate limiter for login attempts (per-IP)
// - Counts only failed login attempts
// - Limits to `max` attempts within `windowMs` ms
// NOTE: In-memory Map is suitable for development / single-instance deployments only.
// For production horizontal setups, use a shared store like Redis with atomic INCR/EXPIRE.

const store = new Map()

const defaultOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 5,
}

function getIpKey(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

export function getStats(req, options = {}) {
  const { windowMs, max } = { ...defaultOptions, ...options }
  const ip = getIpKey(req)
  const entry = store.get(ip)
  if (!entry) return { count: 0, max, remaining: max, reset: 0 }
  const now = Date.now()
  if (now - entry.start >= windowMs) {
    store.delete(ip)
    return { count: 0, max, remaining: max, reset: 0 }
  }
  const remaining = Math.max(0, max - entry.count)
  const reset = Math.ceil((windowMs - (now - entry.start)) / 1000)
  return { count: entry.count, max, remaining, reset }
}

export function incrFailed(req, options = {}) {
  const { windowMs } = { ...defaultOptions, ...options }
  const ip = getIpKey(req)
  const now = Date.now()
  const entry = store.get(ip)
  if (!entry || now - entry.start >= windowMs) {
    store.set(ip, { count: 1, start: now })
    return { count: 1 }
  }
  entry.count += 1
  store.set(ip, entry)
  return { count: entry.count }
}

export function resetAttempts(req) {
  const ip = getIpKey(req)
  store.delete(ip)
}

export function isBlocked(req, options = {}) {
  const { max } = { ...defaultOptions, ...options }
  const s = getStats(req, options)
  return { blocked: s.count >= max, remaining: s.remaining, reset: s.reset }
}

// For testing / debugging
export function _clearAll() {
  store.clear()
}
