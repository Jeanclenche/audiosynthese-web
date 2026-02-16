import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-200 text-sm font-light text-[#333] outline-none focus:border-gold/80 transition-colors duration-300 bg-white placeholder:text-gray-400"

  return (
    <>
      <section className="bg-[#f5f5f5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight">Connexion</h1>
          <p className="text-sm text-gray-400 font-light mt-3">Accedez a votre espace personnel</p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs text-gray-400 font-light">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jean@exemple.com"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-xs text-gray-400 font-light">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className={inputClass}
            />
          </label>

          {error && (
            <div className="border border-red-200 text-red-600 px-5 py-4 text-sm font-light">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-luxury-dark w-full disabled:opacity-50">
            <LogIn size={16} strokeWidth={1.5} />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-light mt-8">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-gold hover:text-gold-dark transition-colors duration-300">
            Creer un compte
          </Link>
        </p>
      </div>
    </>
  )
}
