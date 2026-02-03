import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { query } from '../lib/db'
import axios from 'axios'

export default function Dashboard({ user }) {
  const logout = async () => {
    await axios.post('/api/logout')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-sm text-gray-600 mb-4">Halo, <strong>{user.username}</strong> ({user.email})</p>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token || null
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } }
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const rows = await query('SELECT id, email, username FROM users WHERE id = ? LIMIT 1', [payload.id])
    if (!rows[0]) throw new Error('User not found')
    return { props: { user: rows[0] } }
  } catch (e) {
    return { redirect: { destination: '/login', permanent: false } }
  }
}