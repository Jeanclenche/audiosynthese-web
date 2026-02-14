import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, catLabel } from '../lib/format'
import ProductCard from '../components/ui/ProductCard'

export default function Catalog() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('brand')
        .order('name')

      if (category) {
        if (category === 'cables') {
          query = query.in('category', ['cables', 'accessories'])
        } else {
          query = query.eq('category', category)
        }
      }

      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [category])

  const filtered = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }, [products, search])

  const title = category ? catLabel(category) : 'Tous nos produits'

  return (
    <div className="min-h-screen">
      {/* Header section */}
      <div className="bg-[#f7f7f5] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav className="text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 mb-8 flex items-center gap-2">
            <Link to="/" className="hover:text-[#222] transition-colors duration-300">Accueil</Link>
            <span className="text-gray-300">/</span>
            {category ? (
              <>
                <Link to="/produits" className="hover:text-[#222] transition-colors duration-300">Catalogue</Link>
                <span className="text-gray-300">/</span>
                <span className="text-[#222]">{catLabel(category)}</span>
              </>
            ) : (
              <span className="text-[#222]">Catalogue</span>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#222] tracking-tight">{title}</h1>
              <p className="text-sm text-gray-400 font-light mt-2">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 bg-white w-full sm:w-80">
              <Search size={14} className="text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm font-light flex-1 text-[#222] placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            to="/produits"
            className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] font-light border transition-all duration-300 ${
              !category
                ? 'border-gold text-gold'
                : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-[#222]'
            }`}
          >
            Tout
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c.value}
              to={`/produits/${c.value}`}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] font-light border transition-all duration-300 ${
                category === c.value
                  ? 'border-gold text-gold'
                  : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-[#222]'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24 text-gray-400 font-light">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <SlidersHorizontal size={40} className="mx-auto text-gray-200 mb-4" strokeWidth={1} />
            <p className="text-gray-400 font-light">Aucun produit trouve</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-[11px] uppercase tracking-[0.15em] font-light text-gold hover:text-gold-dark transition-colors duration-300"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
