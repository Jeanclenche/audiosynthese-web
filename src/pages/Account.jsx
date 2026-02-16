import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Save, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, customer, signOut, updateProfile } = useAuth()

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    company_name: '',
    billing_address: '',
    shipping_same_as_billing: true,
    shipping_address: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (customer) {
      setForm({
        full_name: customer.full_name || '',
        phone: customer.phone || '',
        company_name: customer.company_name || '',
        billing_address: customer.billing_address || '',
        shipping_same_as_billing: customer.shipping_same_as_billing ?? true,
        shipping_address: customer.shipping_address || '',
      })
    }
  }, [customer])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        company_name: form.company_name,
        billing_address: form.billing_address,
        shipping_same_as_billing: form.shipping_same_as_billing,
        shipping_address: form.shipping_same_as_billing ? form.billing_address : form.shipping_address,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-200 text-sm font-light text-[#333] outline-none focus:border-gold/80 transition-colors duration-300 bg-white placeholder:text-gray-400"

  return (
    <>
      <section className="bg-[#f5f5f5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight">Mon compte</h1>
          <p className="text-sm text-gray-400 font-light mt-3">Gerez vos informations personnelles</p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs text-gray-400 font-light">Nom complet</span>
            <input type="text" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
          </label>

          <label className="block">
            <span className="text-xs text-gray-400 font-light">Email</span>
            <input type="email" value={user?.email || ''} disabled className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Telephone</span>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="06 12 34 56 78" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Societe</span>
              <input type="text" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Nom de societe" className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="text-xs text-gray-400 font-light">Adresse de facturation</span>
            <textarea value={form.billing_address} onChange={e => setForm({ ...form, billing_address: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.shipping_same_as_billing} onChange={e => setForm({ ...form, shipping_same_as_billing: e.target.checked })} className="w-4 h-4 accent-gold" />
            <span className="text-xs text-gray-500 font-light">Adresse de livraison identique a la facturation</span>
          </label>

          {!form.shipping_same_as_billing && (
            <label className="block">
              <span className="text-xs text-gray-400 font-light">Adresse de livraison</span>
              <textarea value={form.shipping_address} onChange={e => setForm({ ...form, shipping_address: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
            </label>
          )}

          {error && (
            <div className="border border-red-200 text-red-600 px-5 py-4 text-sm font-light">{error}</div>
          )}

          {success && (
            <div className="border border-green-200 text-green-600 px-5 py-4 text-sm font-light">Profil mis a jour</div>
          )}

          <button type="submit" disabled={saving} className="btn-luxury-dark w-full disabled:opacity-50">
            <Save size={16} strokeWidth={1.5} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
          <Link to="/mes-commandes" className="text-sm text-gold hover:text-gold-dark font-light transition-colors duration-300">
            Voir mes commandes
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 font-light transition-colors duration-300">
            <LogOut size={14} strokeWidth={1.5} />
            Se deconnecter
          </button>
        </div>
      </div>
    </>
  )
}
