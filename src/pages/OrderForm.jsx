import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fmtEur } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function OrderForm() {
  const navigate = useNavigate()
  const { items, total, clearCartItems } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const taxRate = 0.20
  const taxCents = Math.round(total * taxRate)
  const ttcCents = total + taxCents

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-lg text-gray-400 font-light">Votre panier est vide</p>
        <Link to="/produits" className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] font-light text-gold hover:text-gold-dark transition-colors duration-300">
          Voir le catalogue
        </Link>
      </div>
    )
  }

  async function generateWebInvoiceNumber() {
    const year = new Date().getFullYear()
    const prefix = `WEB-${year}-`
    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .like('invoice_number', `${prefix}%`)
      .order('invoice_number', { ascending: false })
      .limit(1)
    let seq = 1
    if (data && data.length > 0 && data[0].invoice_number) {
      const last = parseInt(data[0].invoice_number.replace(prefix, ''), 10)
      if (!isNaN(last)) seq = last + 1
    }
    return `${prefix}${String(seq).padStart(4, '0')}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      let customerId
      if (form.email) {
        const { data: existing } = await supabase
          .from('customers')
          .select('id')
          .eq('email', form.email)
          .single()

        if (existing) {
          customerId = existing.id
        }
      }

      if (!customerId) {
        const { data: newCustomer, error: custErr } = await supabase
          .from('customers')
          .insert({
            full_name: form.name,
            email: form.email || null,
            phone: form.phone,
            address: form.address,
            notes: 'Client cree via le site web',
          })
          .select()
          .single()

        if (custErr) throw custErr
        customerId = newCustomer.id
      }

      const invoiceNumber = await generateWebInvoiceNumber()

      const webNote = [
        `Nom : ${form.name}`,
        form.email ? `Email : ${form.email}` : '',
        form.phone ? `Tel : ${form.phone}` : '',
        form.address ? `Adresse : ${form.address}` : '',
        form.note ? `Note : ${form.note}` : '',
      ].filter(Boolean).join('\n')

      const { data: invoice, error: invErr } = await supabase
        .from('invoices')
        .insert({
          customer_id: customerId,
          status: 'draft',
          source: 'web',
          invoice_number: invoiceNumber,
          subtotal: total,
          tax_total: taxCents,
          total: ttcCents,
          web_note: webNote,
          due_date: new Date().toISOString().slice(0, 10),
        })
        .select()
        .single()

      if (invErr) throw invErr

      const lineRows = items.map(item => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        qty: item.qty,
        unit_price_cents: item.price_cents,
        discount_cents: 0,
        line_total: item.price_cents * item.qty,
        vat_rate: 20,
      }))
      const { error: lineErr } = await supabase.from('invoice_lines').insert(lineRows)
      if (lineErr) throw lineErr

      for (const item of items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock_qty')
          .eq('id', item.product_id)
          .single()
        if (prod) {
          await supabase
            .from('products')
            .update({ stock_qty: Math.max(0, prod.stock_qty - item.qty) })
            .eq('id', item.product_id)
          await supabase.from('stock_movements').insert({
            product_id: item.product_id,
            delta: -item.qty,
            reason: 'web_order',
            note: `Commande web ${invoiceNumber}`,
            ref_invoice_id: invoice.id,
          })
        }
      }

      clearCartItems()
      navigate('/confirmation', { state: { invoiceNumber, total: ttcCents } })
    } catch (err) {
      console.error('Order error:', err)
      setError(err.message || 'Une erreur est survenue')
      setSubmitting(false)
    }
  }

  const inputClass = "mt-1 block w-full px-4 py-3 border border-gray-200 text-sm font-light text-[#333] outline-none focus:border-gold/80 transition-colors duration-300 bg-white placeholder:text-gray-400"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link to="/panier" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 hover:text-[#333] transition-colors duration-300 mb-10">
        <ArrowLeft size={12} strokeWidth={1.5} /> Retour au panier
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight mb-12">Passer commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-light text-gold mb-6">Vos informations</h2>

            <div className="space-y-5">
              <label className="block">
                <span className="text-xs text-gray-400 font-light">Nom complet *</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-400 font-light">Email *</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="jean@exemple.com"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-400 font-light">Telephone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-400 font-light">Adresse (optionnel)</span>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="123 rue de Paris, 75001 Paris"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-400 font-light">Note (optionnel)</span>
                <textarea
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="Informations complementaires..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="border border-red-200 text-red-600 px-5 py-4 text-sm font-light">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury-dark w-full disabled:opacity-50"
          >
            <Send size={16} strokeWidth={1.5} />
            {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
          </button>

          <p className="text-[10px] text-gray-400 font-light text-center tracking-wide">
            Aucun paiement en ligne. Notre equipe vous contactera pour confirmer votre commande.
          </p>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#f8f8f8] border-l-2 border-gold/30 p-8 sticky top-24">
            <h2 className="font-display text-lg font-normal text-[#333] mb-6">Votre commande</h2>

            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product_id} className="flex justify-between text-sm font-light">
                  <div className="min-w-0 flex-1">
                    <p className="text-[#333] truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">x{item.qty}</p>
                  </div>
                  <span className="text-[#333] ml-4">{fmtEur(item.price_cents * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-gray-400">Sous-total HT</span>
                <span className="text-[#333]">{fmtEur(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TVA (20%)</span>
                <span className="text-[#333]">{fmtEur(taxCents)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[#333]">Total TTC</span>
                <span className="font-display text-xl font-normal text-[#333]">{fmtEur(ttcCents)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
