import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateIdentifier = (value) => {
    if (!value) return 'Field wajib diisi'
    if (value.includes('@')) {
      // simple email regex
      if (!/^\S+@\S+\.\S+$/.test(value)) return 'Format email tidak valid'
    }
    return true
  }

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      await axios.post('/api/login', { identifier: data.identifier, password: data.password })
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl mb-4 font-semibold text-center">Masuk ke Akun Anda</h1>

        <label className="block mb-2 text-sm font-medium">Email atau Username</label>
        <input
          {...register('identifier', { validate: validateIdentifier })}
          className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="example@gmail.com atau username"
          aria-invalid={errors.identifier ? 'true' : 'false'}
        />
        {errors.identifier && <p className="text-red-500 mb-2 text-sm">{errors.identifier.message}</p>}

        <label className="block mb-2 text-sm font-medium">Password</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type={show ? 'text' : 'password'}
            {...register('password', { required: 'Field wajib diisi', minLength: { value: 6, message: 'Password minimal 6 karakter' } })}
            className="flex-1 min-w-0 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="flex-shrink-0 px-3 py-2 rounded bg-gray-100 text-sm"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="text-red-500 mb-2 text-sm">{errors.password.message}</p>}

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <button
          type="submit"
          className={`w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm">Belum punya akun? <Link href="/register" className="text-blue-600">Daftar</Link></p>
      </form>
    </div>
  )
}