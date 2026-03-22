// Un produit est commandable en ligne si published_online est true
export function isOrderable(product) {
  return product.published_online === true
}
