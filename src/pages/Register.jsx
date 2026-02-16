import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    billingAddress: '',
    shippingSameAsBilling: true,
    shippingAddress: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)

  function set(field) {
    return e => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm(f => ({ ...f, [field]: val }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      const result = await signUp(form)
      // If email confirmation is required, user won't have a session yet
      if (result.user && !result.session) {
        setConfirmEmail(true)
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      if (err.message?.includes('already registered')) {
        setError('Un compte existe deja avec cet email')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-200 text-sm font-light text-[#333] outline-none focus:border-gold/80 transition-colors duration-300 bg-white placeholder:text-gray-400"

  if (confirmEmail) {
    return (
      <>
        <section className="bg-[#f5f5f5] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight">Verifiez votre email</h1>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <p className="text-sm text-gray-500 font-light mb-6">
            Un email de confirmation a ete envoye a <strong className="font-medium">{form.email}</strong>.
            Cliquez sur le lien dans l'email pour activer votre compte.
          </p>
          <Link to="/connexion" className="text-gold hover:text-gold-dark text-sm font-light transition-colors duration-300">
            Retour a la connexion
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <section className="bg-[#f5f5f5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight">Creer un compte</h1>
          <p className="text-sm text-gray-400 font-light mt-3">Inscrivez-vous pour passer commande</p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs text-gray-400 font-light">Nom complet *</span>
            <input type="text" required value={form.fullName} onChange={set('fullName')} placeholder="Jean Dupont" className={inputClass} />
          </label>

          <label className="block">
            <span className="text-xs text-gray-400 font-light">Email *</span>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="jean@exemple.com" className={inputClass} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Mot de passe *</span>
              <input type="password" required value={form.password} onChange={set('password')} placeholder="Min. 6 caracteres" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Confirmation *</span>
              <input type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Confirmer" className={inputClass} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Telephone</span>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="06 12 34 56 78" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Societe</span>
              <input type="text" value={form.companyName} onChange={set('companyName')} placeholder="Nom de societe" className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="text-xs text-gray-400 font-light">Adresse de facturation *</span>
            <textarea required value={form.billingAddress} onChange={set('billingAddress')} placeholder="123 rue de Paris, 75001 Paris" rows={2} className={`${inputClass} resize-none`} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.shippingSameAsBilling} onChange={set('shippingSameAsBilling')} className="w-4 h-4 accent-gold" />
            <span className="text-xs text-gray-500 font-light">Adresse de livraison identique a la facturation</span>
          </label>

          {!form.shippingSameAsBilling && (
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Adresse de livraison</span>
              <textarea value={form.shippingAddress} onChange={set('shippingAddress')} placeholder="Adresse de livraison" rows={2} className={`${inputClass} resize-none`} />
            </label>
          )}

          {error && (
            <div className="border border-red-200 text-red-600 px-5 py-4 text-sm font-light">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-luxury-dark w-full disabled:opacity-50">
            <UserPlus size={16} strokeWidth={1.5} />
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 font-light mt-8">
          Deja un compte ?{' '}
          <Link to="/connexion" className="text-gold hover:text-gold-dark transition-colors duration-300">
            Se connecter
          </Link>
        </p>
      </div>
    </>
  )
}
