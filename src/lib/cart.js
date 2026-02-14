const CART_KEY = 'audiosynthese_cart'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(product, qty = 1) {
  const items = getCart()
  const idx = items.findIndex(i => i.product_id === product.id)
  if (idx >= 0) {
    items[idx].qty += qty
  } else {
    items.push({
      product_id: product.id,
      name: `${product.brand} ${product.name}`,
      price_cents: product.price_cents,
      qty,
      image_url: product.image_url || '',
    })
  }
  saveCart(items)
  return items
}

export function updateCartQty(productId, qty) {
  let items = getCart()
  if (qty <= 0) {
    items = items.filter(i => i.product_id !== productId)
  } else {
    const idx = items.findIndex(i => i.product_id === productId)
    if (idx >= 0) items[idx].qty = qty
  }
  saveCart(items)
  return items
}

export function removeFromCart(productId) {
  const items = getCart().filter(i => i.product_id !== productId)
  saveCart(items)
  return items
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}

export function cartTotal(items) {
  return items.reduce((sum, i) => sum + i.price_cents * i.qty, 0)
}

export function cartCount(items) {
  return items.reduce((sum, i) => sum + i.qty, 0)
}
