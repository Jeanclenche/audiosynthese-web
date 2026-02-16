export function fmtEur(cents) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const CATEGORIES = [
  { value: 'speakers', label: 'Enceintes' },
  { value: 'amplifiers', label: 'Amplificateurs' },
  { value: 'dac', label: 'DAC' },
  { value: 'headphones', label: 'Casques' },
  { value: 'cables', label: 'Cables' },
  { value: 'accessories', label: 'Accessoires' },
]

export function catLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label || value
}
