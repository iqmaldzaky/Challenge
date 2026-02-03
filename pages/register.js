import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-6 rounded shadow">
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

        <button className="w-full bg-blue-600 text-white py-2 rounded">Daftar</button>

        <p className="mt-4 text-sm">Sudah punya akun? <Link href="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  )
}