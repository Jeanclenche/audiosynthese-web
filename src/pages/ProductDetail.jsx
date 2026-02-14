import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fmtEur, catLabel } from '../lib/format'
import { isOrderable } from '../lib/constants'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()
      setProduct(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-gray-400 font-light">
        Chargement...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-gray-400 font-light text-lg">Produit introuvable</p>
        <Link to="/produits" className="mt-6 inline-block text-[11px] uppercase tracking-[0.15em] font-light text-gold hover:text-gold-dark transition-colors duration-500">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const orderable = isOrderable(product.category)

  function handleAdd() {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-cream-dark border-b border-[#e5ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 flex items-center gap-2">
            <Link to="/" className="hover:text-charcoal transition-colors duration-500">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link to="/produits" className="hover:text-charcoal transition-colors duration-500">Catalogue</Link>
            <span className="text-gray-300">/</span>
            <Link to={`/produits/${product.category}`} className="hover:text-charcoal transition-colors duration-500">
              {catLabel(product.category)}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-charcoal truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product — 50/50 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Image — dark bg */}
        <div className="bg-[#1c1915] flex items-center justify-center p-8 sm:p-16">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full max-h-[600px] object-contain"
            />
          ) : (
            <span className="text-white/5 font-display text-9xl">A</span>
          )}
        </div>

        {/* Info — white bg */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 sm:py-16 bg-cream-light">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 hover:text-charcoal transition-colors duration-500 mb-10"
          >
            <ArrowLeft size={12} strokeWidth={1.5} /> Retour au catalogue
          </Link>

          <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em]">{product.brand}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-charcoal mt-3 tracking-tight">{product.name}</h1>

          {/* Price with gold line */}
          <div className="mt-8 pt-8 border-t border-gray-200/60">
            <p className="text-3xl sm:text-4xl font-light text-charcoal tracking-tight">{fmtEur(product.price_cents)}</p>
            <p className="text-xs text-gray-400 font-light mt-1 uppercase tracking-wider">Prix HT</p>
          </div>

          {product.description && (
            <div className="mt-8">
              <p className="text-gray-500 font-light leading-loose">{product.description}</p>
            </div>
          )}

          {/* Availability */}
          <div className="mt-6">
            {product.stock_qty > 0 ? (
              <span className="inline-flex items-center gap-2 text-xs font-light text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                En stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-light text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Sur commande
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 pt-8 border-t border-gray-200/60">
            {orderable ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-4 py-3 text-gray-400 hover:text-charcoal transition-colors duration-500 text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-light text-charcoal min-w-[2.5rem] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-4 py-3 text-gray-400 hover:text-charcoal transition-colors duration-500 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 text-sm font-light uppercase tracking-widest transition-all duration-500 ${
                    added
                      ? 'bg-green-600 text-white border border-green-600'
                      : 'border border-gold/60 text-gold hover:bg-gold hover:text-white hover:border-gold'
                  }`}
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  {added ? 'Ajoute !' : 'Ajouter au panier'}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Ce produit est disponible en magasin. Contactez-nous pour une demonstration ou un devis personnalise.
                </p>
                <Link
                  to="/contact"
                  className="btn-luxury-dark w-full"
                >
                  <Phone size={16} strokeWidth={1.5} />
                  Nous contacter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
