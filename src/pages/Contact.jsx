import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <div>
      {/* Dark header section */}
      <section className="bg-[#15120e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <p className="text-[11px] text-gold font-light uppercase tracking-[0.3em] mb-6">Contact</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
            Contactez-nous
          </h1>
          <p className="mt-6 text-white/40 font-light max-w-lg mx-auto leading-relaxed">
            Une question sur un produit ? Besoin de conseils pour votre installation audio ?
            Notre equipe est a votre ecoute.
          </p>
        </div>
      </section>

      {/* Contact info — white */}
      <section className="bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          {/* Contact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <Phone size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">Telephone</p>
              <p className="text-charcoal font-light">01 23 45 67 89</p>
            </div>

            <div className="text-center">
              <Mail size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">Email</p>
              <p className="text-charcoal font-light">contact@audiosynthese.fr</p>
            </div>

            <div className="text-center">
              <MapPin size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">Adresse</p>
              <p className="text-charcoal font-light">Paris, France</p>
            </div>

            <div className="text-center">
              <Clock size={24} className="text-gold mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-light text-gray-400 mb-2">Horaires</p>
              <p className="text-charcoal font-light text-sm leading-relaxed">
                Lun - Ven : 10h - 19h<br />
                Sam : 10h - 18h
              </p>
            </div>
          </div>

          {/* Info sections */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="border-t-2 border-gold/30 pt-8">
              <h3 className="font-display text-xl font-normal text-charcoal mb-3">Ecoute & Demonstration</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Nous vous invitons a venir ecouter nos produits en magasin.
                Prenez rendez-vous pour une seance d'ecoute personnalisee.
              </p>
            </div>

            <div className="border-t-2 border-gold/30 pt-8">
              <h3 className="font-display text-xl font-normal text-charcoal mb-3">Commandes en ligne</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Les cables et accessoires sont disponibles a la commande en ligne.
                Pour les enceintes, amplificateurs, DAC et casques, contactez-nous.
              </p>
            </div>

            <div className="border-t-2 border-gold/30 pt-8">
              <h3 className="font-display text-xl font-normal text-charcoal mb-3">Service apres-vente</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Nous assurons le suivi et le SAV de tous les produits
                que nous commercialisons. N'hesitez pas a nous contacter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
