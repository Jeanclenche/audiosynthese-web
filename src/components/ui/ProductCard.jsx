import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { fmtEur, catLabel } from '../../lib/format'
import { isOrderable } from '../../lib/constants'
import { useCart } from '../../context/CartContext'

// Get first image from first color, fallback to product.image_url
function getProductImage(product) {
  const colors = (product.product_colors || []).sort((a, b) => a.position - b.position)
  if (colors.length > 0) {
    const images = (colors[0].product_images || []).sort((a, b) => a.position - b.position)
    if (images.length > 0) return images[0].image_url
  }
  return product.image_url
}

// Get color swatches for display
function getColorSwatches(product) {
  return (product.product_colors || [])
    .sort((a, b) => a.position - b.position)
    .filter(c => c.color_hex)
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const orderable = isOrderable(product.category)
  const imageUrl = getProductImage(product)
  const swatches = getColorSwatches(product)

  return (
    <div className="group border border-gray-100 bg-white hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <Link to={`/produit/${product.id}`} className="block aspect-[4/5] bg-[#f5f4f2] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-200 font-display text-4xl">A</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5">
        <p className="text-[10px] text-gold font-light uppercase tracking-[0.2em] mb-2">
          {product.brand}
        </p>
        <Link to={`/produit/${product.id}`} className="block">
          <h3 className="font-display font-normal text-[#333] text-base leading-snug group-hover:text-gold-dark transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        {swatches.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {swatches.slice(0, 5).map(c => (
              <span
                key={c.id}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: c.color_hex }}
                title={c.color_name}
              />
            ))}
            {swatches.length > 5 && (
              <span className="text-[10px] text-gray-400 font-light self-center ml-0.5">+{swatches.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xl font-light text-[#333] tracking-tight">{fmtEur(product.price_cents)}</span>

          {orderable ? (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2 px-4 py-2 border border-gold/50 text-gold text-[10px] uppercase tracking-[0.15em] font-light
                         hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              Ajouter
            </button>
          ) : (
            <Link
              to="/contact"
              className="text-[10px] uppercase tracking-[0.15em] font-light text-gold/70 hover:text-gold transition-colors duration-300"
            >
              Sur demande
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
