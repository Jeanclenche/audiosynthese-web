import { Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { fmtEur } from '../../lib/format'

export default function CartDrawer() {
  const { items, total, count, updateCartQuantity, removeFromCart, drawerOpen, setDrawerOpen } = useCart()

  if (!drawerOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream-light flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-display text-lg font-normal text-charcoal">
            Panier
            <span className="text-sm text-gray-400 font-sans font-light ml-2">({count})</span>
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-gray-400 hover:text-charcoal transition-colors duration-500 p-1"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Gold accent line */}
        <div className="h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <ShoppingBag size={40} strokeWidth={1} />
              <p className="mt-4 text-sm font-light text-gray-400">Votre panier est vide</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="mt-6 text-[11px] uppercase tracking-[0.15em] font-light text-gold hover:text-gold-dark transition-colors duration-500"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.product_id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                  {/* Thumbnail */}
                  <div className="w-16 h-20 bg-[#1c1915] flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/10 font-display text-sm">A</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-charcoal truncate">{item.name}</p>
                    <p className="text-sm text-gray-400 font-light mt-0.5">{fmtEur(item.price_cents)}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.qty - 1)}
                        className="w-7 h-7 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-charcoal hover:text-charcoal transition-colors duration-500"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-light w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.qty + 1)}
                        className="w-7 h-7 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-charcoal hover:text-charcoal transition-colors duration-500"
                      >
                        <Plus size={10} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="ml-auto text-gray-300 hover:text-red-400 transition-colors duration-500"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-[0.15em] font-light text-gray-400">Total HT</span>
              <span className="font-display text-xl font-normal text-charcoal">{fmtEur(total)}</span>
            </div>
            <Link
              to="/panier"
              onClick={() => setDrawerOpen(false)}
              className="btn-luxury-dark w-full"
            >
              Voir le panier
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
