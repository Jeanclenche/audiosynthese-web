import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fmtEur, fmtDate } from '../lib/format'
import { useAuth } from '../context/AuthContext'

const STATUS_MAP = {
  draft: { label: 'En attente', cls: 'bg-yellow-100 text-yellow-700' },
  sent: { label: 'Confirmee', cls: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Payee', cls: 'bg-green-100 text-green-700' },
  void: { label: 'Annulee', cls: 'bg-red-100 text-red-700' },
}

export default function Orders() {
  const { customer } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customer) return
    supabase
      .from('invoices')
      .select('*, invoice_lines(*, products(name, brand, image_url))')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [customer])

  return (
    <>
      <section className="bg-[#f5f5f5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight">Mes commandes</h1>
          <p className="text-sm text-gray-400 font-light mt-3">Historique de vos achats</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} strokeWidth={1} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-400 font-light mb-6">Aucune commande pour le moment</p>
            <Link to="/produits" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-gold hover:text-gold-dark transition-colors duration-300">
              <ShoppingBag size={14} strokeWidth={1.5} />
              Decouvrir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const st = STATUS_MAP[order.status] || STATUS_MAP.draft
              return (
                <div key={order.id} className="border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm font-light text-[#333]">{order.invoice_number}</span>
                      <span className="text-xs text-gray-400 font-light ml-3">{fmtDate(order.created_at)}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>

                  {order.invoice_lines && order.invoice_lines.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {order.invoice_lines.map(line => (
                        <div key={line.id} className="flex items-center gap-4">
                          {line.products?.image_url ? (
                            <img src={line.products.image_url} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-light text-[#333] truncate">
                              {line.products ? `${line.products.brand} ${line.products.name}` : 'Produit supprime'}
                            </p>
                            <p className="text-xs text-gray-400 font-light">x{line.qty}</p>
                          </div>
                          <span className="text-sm font-light text-[#333]">{fmtEur(line.line_total)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <span className="font-display text-lg font-normal text-[#333]">{fmtEur(order.total)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
