import { formatPrice } from '../utils/formatPrice'
import { imageFallbackHandler } from '../utils/placeholderImage'
import { useCart } from '../hooks/useCart'
import { Button } from './Button'

export function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  return (
    <div className="cart-item">
      <img
        src={product.image}
        alt={product.name}
        onError={imageFallbackHandler(product.name, '150x188')}
      />
      <div className="cart-item-info">
        <h4>{product.name}</h4>
        <p>{formatPrice(product.price)}</p>
      </div>
      <div className="cart-item-quantity">
        <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)}>
          -
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)}>
          +
        </button>
      </div>
      <p className="cart-item-subtotal">{formatPrice(product.price * quantity)}</p>
      <Button variant="secondary" onClick={() => removeFromCart(product.id)}>
        Quitar
      </Button>
    </div>
  )
}
