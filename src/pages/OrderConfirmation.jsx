import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { fmtEur } from '../lib/format'

export default function OrderConfirmation() {
  const { state } = useLocation()

  if (!state?.invoiceNumber) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
      {/* Gold check icon */}
      <div className="w-20 h-20 mx-auto flex items-center justify-center mb-10">
        <CheckCircle size={56} className="text-gold" strokeWidth={1} />
      </div>

      <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#222] tracking-tight">
        Commande confirmee
      </h1>

      <p className="mt-6 text-gray-400 font-light leading-relaxed max-w-md mx-auto">
        Merci pour votre commande. Notre equipe va la traiter et vous contactera prochainement.
      </p>

      {/* Order number */}
      <div className="mt-10 inline-block">
        <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">Numero de commande</p>
        <p className="font-display text-2xl font-normal text-[#222]">{state.invoiceNumber}</p>
        {state.total && (
          <>
            <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mt-5 mb-2">Montant total TTC</p>
            <p className="font-display text-xl font-normal text-[#222]">{fmtEur(state.total)}</p>
          </>
        )}
      </div>

      {/* Next steps */}
      <div className="mt-10 py-6 border-t border-b border-gray-100 max-w-md mx-auto">
        <p className="text-sm text-gray-500 font-light leading-relaxed">
          Nous vous contacterons par email ou telephone pour confirmer la disponibilite
          des articles et organiser le reglement. Aucun paiement n'est preleve en ligne.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/produits" className="btn-luxury">
          Continuer mes achats <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-light uppercase tracking-widest text-gray-400 border border-gray-200 hover:text-[#222] hover:border-gray-400 transition-all duration-300"
        >
          Retour a l'accueil
        </Link>
      </div>
    </div>
  )
}
