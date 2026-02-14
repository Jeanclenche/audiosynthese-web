import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#201b17]">
      {/* Gold separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="font-display font-normal text-white text-base tracking-tight">
            Audio Synthese
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-8">
            {[
              { to: '/produits', label: 'Catalogue' },
              { to: '/contact', label: 'Contact' },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] uppercase tracking-[0.2em] font-light text-white/40 hover:text-white transition-colors duration-500"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-white/30 font-light tracking-wide">
            &copy; {new Date().getFullYear()} Audio Synthese
          </p>
        </div>
      </div>
    </footer>
  )
}
