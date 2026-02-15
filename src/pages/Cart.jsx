import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { fmtEur } from '../lib/format'

export default function Cart() {
  const { items, total, count, updateCartQuantity, removeFromCart } = useCart()

  const taxRate = 0.20
  const taxCents = Math.round(total * taxRate)
  const ttcCents = total + taxCents

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link to="/produits" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 hover:text-[#333] transition-colors duration-300 mb-10">
        <ArrowLeft size={12} strokeWidth={1.5} /> Continuer mes achats
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#333] tracking-tight mb-12">
        Mon panier
        <span className="text-gray-300 font-sans text-2xl font-light ml-3">({count})</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" strokeWidth={1} />
          <p className="text-lg text-gray-400 font-light">Votre panier est vide</p>
          <Link to="/produits" className="btn-luxury mt-8">
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items list */}
          <div className="lg:col-span-2 divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.product_id} className="flex gap-5 py-8 first:pt-0">
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#f5f4f2] flex-shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-200 font-display text-sm">A</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-light text-[#333]">{item.name}</p>
                  <p className="text-sm text-gray-400 font-light mt-1">{fmtEur(item.price_cents)} / unite</p>

                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.qty - 1)}
                        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-[#333] transition-colors duration-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-light w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.qty + 1)}
                        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-[#333] transition-colors duration-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="text-[#333] font-light">{fmtEur(item.price_cents * item.qty)}</span>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-300"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8f8f8] border-l-2 border-gold/30 p-8 sticky top-24">
              <h3 className="font-display text-lg font-normal text-[#333] mb-6">Recapitulatif</h3>

              <div className="space-y-4 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sous-total HT</span>
                  <span className="text-[#333]">{fmtEur(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TVA (20%)</span>
                  <span className="text-[#333]">{fmtEur(taxCents)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-[#333]">Total TTC</span>
                  <span className="font-display text-2xl font-normal text-[#333]">{fmtEur(ttcCents)}</span>
                </div>
              </div>

              <Link to="/commander" className="btn-luxury-dark w-full mt-8">
                Passer commande
              </Link>
              <p className="text-[10px] text-gray-400 font-light text-center mt-4 tracking-wide">
                Pas de paiement en ligne
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
