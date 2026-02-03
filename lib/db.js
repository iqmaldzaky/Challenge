import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_db',
  waitForConnections: true,
  connectionLimit: 10,
})

export async function query(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function getUserByIdentifier(identifier) {
  const rows = await query(
    'SELECT id, email, username, password_hash FROM users WHERE email = ? OR username = ? LIMIT 1',
    [identifier, identifier]
  )
  return rows[0]
}

export async function createUser({ email, username, passwordHash }) {
  const res = await query(
    'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
    [email, username, passwordHash]
  )
  return res.insertId
}