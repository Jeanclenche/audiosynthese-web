import { createContext, useContext, useState, useCallback } from 'react'
import {
  getCart, saveCart, addToCart as addItem, updateCartQty as updateQty,
  removeFromCart as removeItem, clearCart as clear, cartTotal, cartCount,
} from '../lib/cart'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(getCart)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const addToCart = useCallback((product, qty = 1, color = null) => {
    const updated = addItem(product, qty, color)
    setItems(updated)
    setDrawerOpen(true)
  }, [])

  const updateCartQuantity = useCallback((productId, colorId, qty) => {
    const updated = updateQty(productId, colorId, qty)
    setItems(updated)
  }, [])

  const removeFromCart = useCallback((productId, colorId) => {
    const updated = removeItem(productId, colorId)
    setItems(updated)
  }, [])

  const clearCartItems = useCallback(() => {
    clear()
    setItems([])
  }, [])

  const total = cartTotal(items)
  const count = cartCount(items)

  return (
    <CartContext.Provider value={{
      items, total, count,
      addToCart, updateCartQuantity, removeFromCart, clearCartItems,
      drawerOpen, setDrawerOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
