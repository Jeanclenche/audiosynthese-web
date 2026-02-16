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

// Unique key for a cart item: product_id + color_id
function itemKey(item) {
  return `${item.product_id}_${item.color_id || ''}`
}

export function addToCart(product, qty = 1, color = null) {
  const items = getCart()
  const colorId = color?.id || null
  const idx = items.findIndex(i => i.product_id === product.id && (i.color_id || null) === colorId)
  if (idx >= 0) {
    items[idx].qty += qty
  } else {
    items.push({
      product_id: product.id,
      name: `${product.brand} ${product.name}`,
      price_cents: product.price_cents,
      qty,
      image_url: product.image_url || '',
      color_id: colorId,
      color_name: color?.color_name || '',
    })
  }
  saveCart(items)
  return items
}

export function updateCartQty(productId, colorId, qty) {
  let items = getCart()
  const cId = colorId || null
  if (qty <= 0) {
    items = items.filter(i => !(i.product_id === productId && (i.color_id || null) === cId))
  } else {
    const idx = items.findIndex(i => i.product_id === productId && (i.color_id || null) === cId)
    if (idx >= 0) items[idx].qty = qty
  }
  saveCart(items)
  return items
}

export function removeFromCart(productId, colorId) {
  const cId = colorId || null
  const items = getCart().filter(i => !(i.product_id === productId && (i.color_id || null) === cId))
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
