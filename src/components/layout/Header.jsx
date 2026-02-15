import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/produits', label: 'Catalogue' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { count, setDrawerOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-base sm:text-lg font-display font-normal text-white tracking-tight">
              Audio Synthese
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.2em] font-light transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-white/50 hover:text-white transition-colors duration-300 p-2"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-gold text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/50 hover:text-white transition-colors duration-300 p-2"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10">
          <nav className="px-4 py-6 space-y-1">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-[11px] uppercase tracking-[0.2em] font-light transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/panier"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-[11px] uppercase tracking-[0.2em] font-light text-white/50 hover:text-white transition-colors duration-300"
            >
              Panier {count > 0 && `(${count})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
