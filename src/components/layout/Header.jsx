import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut, Package, Settings } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/produits', label: 'Catalogue' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { count, setDrawerOpen } = useCart()
  const { user, customer, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    setDropdownOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate('/')
  }

  const linkClass = "text-[11px] uppercase tracking-[0.2em] font-light transition-colors duration-300"

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
                  `${linkClass} ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth + Cart + mobile menu */}
          <div className="flex items-center gap-2">
            {/* Desktop auth */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-white/50 hover:text-white transition-colors duration-300 p-2"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#333] truncate">{customer?.full_name || 'Mon compte'}</p>
                        <p className="text-xs text-gray-400 font-light truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/mon-compte"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-[#333] transition-colors"
                      >
                        <Settings size={14} strokeWidth={1.5} /> Mon compte
                      </Link>
                      <Link
                        to="/mes-commandes"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-[#333] transition-colors"
                      >
                        <Package size={14} strokeWidth={1.5} /> Mes commandes
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors border-t border-gray-100"
                      >
                        <LogOut size={14} strokeWidth={1.5} /> Se deconnecter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className={`${linkClass} text-white/50 hover:text-white`}
                >
                  Se connecter
                </Link>
              )}
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="relative text-white/50 hover:text-white transition-colors duration-300 p-2"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm">
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
                  `block px-4 py-3 ${linkClass} ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/panier"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 ${linkClass} text-white/50 hover:text-white`}
            >
              Panier {count > 0 && `(${count})`}
            </Link>

            <div className="border-t border-white/10 mt-3 pt-3">
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs text-white/70 font-light">{customer?.full_name || user.email}</p>
                  </div>
                  <Link
                    to="/mon-compte"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 ${linkClass} text-white/50 hover:text-white`}
                  >
                    Mon compte
                  </Link>
                  <Link
                    to="/mes-commandes"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 ${linkClass} text-white/50 hover:text-white`}
                  >
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`block w-full text-left px-4 py-3 ${linkClass} text-white/50 hover:text-red-400`}
                  >
                    Se deconnecter
                  </button>
                </>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 ${linkClass} text-white/50 hover:text-white`}
                >
                  Se connecter
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
