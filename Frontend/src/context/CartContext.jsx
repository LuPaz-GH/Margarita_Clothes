import { useMemo, useState } from 'react'
import { CartContext } from './cart-context'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addToCart(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...current, { product, quantity }]
    })
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
