import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/formatPrice'
import { Button } from '../components/Button'
import { BackButton } from '../components/BackButton'
import { api } from '../api/client'

const paymentMethods = [
  {
    id: 'transferencia',
    label: 'Transferencia bancaria',
    description: 'Te enviamos el CBU/alias para transferir.',
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta de crédito/débito',
    description: 'Pagás online de forma segura.',
  },
  {
    id: 'efectivo',
    label: 'Efectivo',
    description: 'Pagás en efectivo al recibir tu pedido.',
  },
  {
    id: 'pagofacil',
    label: 'Pago Fácil / Rapipago',
    description: 'Pagás con el código que te enviamos por mail.',
  },
]

export function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [payment, setPayment] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post(
        '/orders',
        {
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          paymentMethod: payment,
          shippingAddress: `${address} — Tel: ${phone} — A nombre de: ${name}`,
        },
        token,
      )
      clearCart()
      setConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <section className="checkout-page">
        <h1>¡Gracias por tu compra!</h1>
        <p>Te vamos a contactar para coordinar la entrega.</p>
        <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="checkout-page">
        <BackButton />
        <h1>Finalizar compra</h1>
        <p>Necesitás iniciar sesión para completar tu pedido.</p>
        <Link to="/login" state={{ from: '/checkout' }}>
          <Button>Iniciar sesión</Button>
        </Link>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="checkout-page">
        <BackButton />
        <p>No tenés productos para pagar.</p>
        <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <BackButton />
      <h1>Finalizar compra</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Dirección de entrega
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </label>
          <label>
            Teléfono
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </label>

          <fieldset className="payment-methods">
            <legend>Método de pago</legend>
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`payment-option${payment === method.id ? ' selected' : ''}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={payment === method.id}
                  onChange={() => setPayment(method.id)}
                  required
                />
                <span>
                  <strong>{method.label}</strong>
                  <small>{method.description}</small>
                </span>
              </label>
            ))}
          </fieldset>

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Confirmando...' : 'Confirmar pedido'}
          </Button>
        </form>

        <aside className="order-summary">
          <h2>Tu pedido</h2>
          <ul className="order-summary-list">
            {items.map((item) => (
              <li key={item.product.id}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="order-summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
