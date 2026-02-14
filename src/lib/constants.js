// Categories vitrine : affichage uniquement, bouton "Nous contacter"
export const VITRINE_CATEGORIES = ['speakers', 'amplifiers', 'dac', 'headphones']

// Categories commandables : ajout au panier possible
export const ORDERABLE_CATEGORIES = ['cables', 'accessories']

export function isOrderable(category) {
  return ORDERABLE_CATEGORIES.includes(category)
}
