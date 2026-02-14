import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

const categories = [
  { value: 'speakers', label: 'Enceintes', desc: 'Haute-fidelite' },
  { value: 'amplifiers', label: 'Amplificateurs', desc: 'Audiophile' },
  { value: 'headphones', label: 'Casques', desc: 'Ecoute personnelle' },
  { value: 'cables', label: 'Cables & Accessoires', desc: 'Commander en ligne' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8)
      setFeatured(data || [])
    }
    load()
  }, [])

  return (
    <>
      {/* Hero — clean, white */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 lg:py-44">
          <div className="max-w-3xl animate-fade-up">
            <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em] mb-6">
              Audio haut de gamme
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-[#222]">
              L'excellence sonore
              <br />
              <span className="text-gray-300">a portee de main</span>
            </h1>
            <p className="mt-8 text-lg font-light text-gray-400 leading-relaxed max-w-xl animate-fade-up-delay">
              Decouvrez notre selection d'enceintes, amplificateurs, DAC et casques
              des plus grandes marques.
            </p>
            <p className="mt-4 font-display italic text-gray-300 text-lg animate-fade-up-delay">
              L'art du son, sans compromis.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up-delay-2">
              <Link to="/produits" className="btn-luxury">
                Decouvrir <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-light uppercase tracking-widest text-gray-400 border border-gray-200 hover:text-[#222] hover:border-gray-400 transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — subtle gray background */}
      <section className="bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-16">
            <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em] mb-4">Collections</p>
            <h2 className="font-display text-4xl sm:text-5xl font-normal text-[#222] tracking-tight">
              Nos univers
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map(cat => (
              <Link
                key={cat.value}
                to={`/produits/${cat.value}`}
                className="group relative p-8 sm:p-10 text-center bg-white border border-gray-100 hover:border-gold/30 transition-all duration-300"
              >
                {/* Gold top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <h3 className="font-display text-lg font-normal text-[#222] group-hover:text-gold-dark transition-colors duration-300">
                  {cat.label}
                </h3>
                <p className="mt-2 text-xs font-light text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products — white background */}
      {featured.length > 0 && (
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em] mb-4">Selection</p>
                <h2 className="font-display text-4xl sm:text-5xl font-normal text-[#222] tracking-tight">
                  Derniers produits
                </h2>
              </div>
              <Link
                to="/produits"
                className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-light text-gray-400 hover:text-gold transition-colors duration-300"
              >
                Tout voir <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="sm:hidden mt-10 text-center">
              <Link to="/produits" className="btn-luxury">
                Tout voir
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA — subtle background */}
      <section className="bg-[#f7f7f5] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em] mb-4">A votre service</p>
          <h2 className="font-display text-4xl sm:text-5xl font-normal text-[#222] tracking-tight max-w-2xl mx-auto">
            Une question ? Un projet audio ?
          </h2>
          <p className="mt-6 text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Notre equipe est a votre disposition pour vous conseiller
            et vous accompagner dans le choix de votre equipement.
          </p>
          <div className="mt-10">
            <Link to="/contact" className="btn-luxury">
              Nous contacter <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
