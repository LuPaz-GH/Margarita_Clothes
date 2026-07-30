import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { CartItem } from '../components/CartItem'
import { Button } from '../components/Button'
import { BackButton } from '../components/BackButton'
import { formatPrice } from '../utils/formatPrice'

export function Cart() {
  const { items, total } = useCart()

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <BackButton />
        <h1>Tu carrito está vacío</h1>
        <Link to="/">
          <Button>Ir a la tienda</Button>
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <BackButton />
      <h1>Tu carrito</h1>
      <div className="cart-list">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <p>Total: {formatPrice(total)}</p>
        <Link to="/checkout">
          <Button>Ir a pagar</Button>
        </Link>
      </div>
    </section>
  )
}
