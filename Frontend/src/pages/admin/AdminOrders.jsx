import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/formatPrice'

const STATUSES = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'DEVUELTO', 'CANCELADO']

export function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadOrders() {
    api
      .get('/orders', token)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [token])

  async function handleStatusChange(orderId, status) {
    try {
      await api.put(`/orders/${orderId}/status`, { status }, token)
      loadOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Pedidos</h2>
      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="empty-state">Todavía no hay pedidos.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.user.name}
                    <br />
                    <small>{order.user.email}</small>
                  </td>
                  <td className="col-wrap">
                    {order.items
                      .map((item) => `${item.product.name} ×${item.quantity}`)
                      .join(', ')}
                  </td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{order.paymentMethod || '—'}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
