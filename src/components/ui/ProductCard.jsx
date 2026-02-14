import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { fmtEur, catLabel } from '../../lib/format'
import { isOrderable } from '../../lib/constants'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const orderable = isOrderable(product.category)

  return (
    <div className="group">
      {/* Image container — dark background */}
      <Link to={`/produit/${product.id}`} className="block aspect-[4/5] bg-[#1c1915] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/10 font-display text-4xl">A</span>
          </div>
        )}
      </Link>

      {/* Info — light background */}
      <div className="bg-cream-dark p-5">
        <p className="text-[10px] text-gold font-light uppercase tracking-[0.2em] mb-2">
          {product.brand}
        </p>
        <Link to={`/produit/${product.id}`} className="block">
          <h3 className="font-display font-normal text-charcoal text-base leading-snug group-hover:text-gold-dark transition-colors duration-500 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200/60">
          <span className="text-xl font-light text-charcoal tracking-tight">{fmtEur(product.price_cents)}</span>

          {orderable ? (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 px-4 py-2 border border-gold/50 text-gold text-[10px] uppercase tracking-[0.15em] font-light
                         hover:bg-gold hover:text-white hover:border-gold transition-all duration-500"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              Ajouter
            </button>
          ) : (
            <Link
              to="/contact"
              className="text-[10px] uppercase tracking-[0.15em] font-light text-gold/70 hover:text-gold transition-colors duration-500"
            >
              Sur demande
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
