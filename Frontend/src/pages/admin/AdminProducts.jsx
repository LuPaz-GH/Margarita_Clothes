import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button'
import { ProductFormModal } from '../../components/ProductFormModal'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { formatPrice } from '../../utils/formatPrice'

export function AdminProducts() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [view, setView] = useState('active')

  function loadProducts() {
    api
      .get('/products/admin/all', token)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [token])

  const activeProducts = useMemo(() => products.filter((p) => !p.deletedAt), [products])
  const deletedProducts = useMemo(() => products.filter((p) => p.deletedAt), [products])
  const visibleProducts = view === 'active' ? activeProducts : deletedProducts

  function openCreateForm() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEditForm(product) {
    setEditingProduct({ ...product, audience: product.audience.toLowerCase() })
    setFormOpen(true)
  }

  async function confirmDelete() {
    try {
      await api.delete(`/products/${deleteTarget.id}`, token)
      setDeleteTarget(null)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h2>Productos</h2>
        <Button onClick={openCreateForm}>+ Nuevo producto</Button>
      </div>

      <div className="admin-subtabs">
        <button
          type="button"
          className={view === 'active' ? 'is-active' : ''}
          onClick={() => setView('active')}
        >
          Activos ({activeProducts.length})
        </button>
        <button
          type="button"
          className={view === 'deleted' ? 'is-active' : ''}
          onClick={() => setView('deleted')}
        >
          Eliminados ({deletedProducts.length})
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {formOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            loadProducts()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Eliminar "${deleteTarget.name}"? Vas a poder verlo en la pestaña "Eliminados".`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {loading ? (
        <p className="empty-state">Cargando...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="empty-state">
          {view === 'active' ? 'No hay productos activos.' : 'No hay productos eliminados.'}
        </p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Sección</th>
                <th>Precio</th>
                <th>Stock</th>
                {view === 'active' ? (
                  <>
                    <th>Creado por</th>
                    <th>Editado por</th>
                    <th>Acciones</th>
                  </>
                ) : (
                  <th>Eliminado por</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.audience}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  {view === 'active' ? (
                    <>
                      <td>{product.createdBy?.name || '—'}</td>
                      <td>{product.updatedBy?.name || '—'}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-link-btn"
                            onClick={() => openEditForm(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="admin-link-btn admin-link-btn-danger"
                            onClick={() => setDeleteTarget(product)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <td>{product.deletedBy?.name || '—'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
