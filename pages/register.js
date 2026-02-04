import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTheme } from '../lib/theme'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  function ThemeToggle() {
    const { theme, toggle } = useTheme()
    return (
      <button onClick={toggle} aria-pressed={theme === 'dark'} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" title="Toggle dark mode">
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM16 10a.75.75 0 01.75.75H18a.75.75 0 010 0h-1.25A.75.75 0 0116 10zM2 10a.75.75 0 01.75.75H4a.75.75 0 010 0H2.75A.75.75 0 012 10zM14.95 14.95a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM4.1 4.1a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06L4.1 5.16a.75.75 0 010-1.06zM14.95 5.05a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM4.1 15.9a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.293 13.293a8 8 0 11-10.586-10.586 8 8 0 0010.586 10.586z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    )
  }
  const onSubmit = async (data) => {
    setError('')
    try {
      await axios.post('/api/register', { email: data.email, username: data.username, password: data.password })
      setSuccess('Berhasil mendaftar. Silakan login.')
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-2xl mb-4 font-semibold">Register</h1>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Field wajib diisi',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
          })}
          className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="example@gmail.com"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p className="text-red-500 mb-2 text-sm">{errors.email.message}</p>}

        <label className="block mb-2">Username</label>
        <input {...register('username', { required: true })} className="w-full mb-3 p-2 border rounded" />
        {errors.username && <p className="text-red-500 mb-2">Field wajib diisi</p>}

        <label className="block mb-2">Password</label>
        <input type="password" {...register('password', { required: true, minLength: 6 })} className="w-full mb-3 p-2 border rounded" />
        {errors.password && <p className="text-red-500 mb-2">Password minimal 6 karakter</p>}

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <button className="w-full bg-[#0b3650] hover:bg-[#09283a] text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50">Daftar</button>
        <p className="mt-4 text-sm">Sudah punya akun? <Link href="/login" className="text-blue-900">Login</Link></p>        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>      
        </form>
    </div>
  )
}