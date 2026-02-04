import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTheme } from '../lib/theme'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()

  const validateIdentifier = (value) => {
    if (!value) return 'Field wajib diisi'
    if (value.includes('@')) {
      // email
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

  function ThemeToggle() {
    const { theme, toggle } = useTheme()
    return (
      <button
        onClick={toggle}
        aria-pressed={theme === 'dark'}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        title="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM16 10a.75.75 0 01.75.75H18a.75.75 0 010 0h-1.25A.75.75 0 0116 10zM2 10a.75.75 0 01.75.75H4a.75.75 0 010 0H2.75A.75.75 0 012 10zM14.95 14.95a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM4.1 4.1a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06L4.1 5.16a.75.75 0 010-1.06zM14.95 5.05a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM4.1 15.9a.75.75 0 011.06 0l.88.88a.75.75 0 11-1.06 1.06l-.88-.88a.75.75 0 010-1.06zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.293 13.293a8 8 0 11-10.586-10.586 8 8 0 0010.586 10.586z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 relative ${loading ? 'overflow-hidden' : ''}`}>
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md min-h-[60vh] md:min-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* left */}
          <div className="p-8 md:p-12 flex flex-col">
            <header className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={theme === 'dark' ? '/images/btgp.png' : '/images/btg.png'} alt="logo" className="w-12 h-12 object-cover" />
                  <span className="text-lg font-semibold -ml-2">IqmalDzaky</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>

              </div>
            </header>

            <div className="flex-1 flex items-center">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
                <h1 className="text-3xl mb-2 font-bold">Welcome Back!</h1>
                <p className="text-sm text-gray-500 mb-6">Please enter login details below</p>

                <label className="block mb-2 text-sm font-medium">Email atau Username</label>
                <input
                  {...register('identifier', { validate: validateIdentifier })}
                  className="w-full mb-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="example@gmail.com atau username"
                  aria-invalid={errors.identifier ? 'true' : 'false'}
                  disabled={loading}
                />
                {errors.identifier && <p className="text-red-500 mb-2 text-sm">{errors.identifier.message}</p>}

                <label className="block mb-2 text-sm font-medium">Password</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type={show ? 'text' : 'password'}
                    {...register('password', { required: 'Field wajib diisi', minLength: { value: 6, message: 'Password minimal 6 karakter' } })}
                    className="flex-1 min-w-0 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="••••••••"
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    // className="flex-shrink-0 px-3 py-2 rounded bg-gray-100 text-sm"
                    className="flex-shrink-0 px-3 py-2 rounded bg-gray-100 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 mb-2 text-sm">{errors.password.message}</p>}

                {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center bg-[#0b3650] text-white py-3 rounded ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#09283a]'} focus:outline-none focus:ring-2 focus:ring-[#0b3650]/50`}
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Sign in'}
                </button>

                <p className="mt-4 text-center text-sm">Belum punya akun? <Link href="/register" className="text-blue-900 hover:text-blue-900">Daftar</Link></p>
              </form>
            </div>
          </div>

          {/* right*/}
          <div
            className="hidden md:block bg-blue-900"
            style={{
              backgroundImage: "url('/images/bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div role="status" className="flex flex-col items-center">
            <svg className="animate-spin h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-white mt-4">Mohon Tunggu...</span>
          </div>
        </div>
      )}

    </div>
  )
}