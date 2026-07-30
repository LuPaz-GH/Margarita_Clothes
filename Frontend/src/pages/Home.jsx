import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { ProductFormModal } from '../components/ProductFormModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Button } from '../components/Button'
import { imageFallbackHandler } from '../utils/placeholderImage'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'

export function Home() {
  const { products, loading, error, reload } = useProducts()
  const { user, token } = useAuth()
  const isStaff = user?.role === 'EMPLEADO' || user?.role === 'ADMIN'
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  function openCreateForm() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  async function confirmDelete() {
    await api.delete(`/products/${deleteTarget.id}`, token)
    setDeleteTarget(null)
    reload()
  }

  return (
    <section className="home-page">
      <h1>Encontrá tu estilo</h1>
      <div className="category-banners">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/categoria/${category.slug}`}
            className="category-card"
          >
            <img
              src={category.image}
              alt={category.bannerLabel}
              onError={imageFallbackHandler(category.bannerLabel, '500x600')}
            />
            <span>{category.bannerLabel}</span>
          </Link>
        ))}
      </div>

      <div className="admin-toolbar">
        <h2>Destacados</h2>
        {isStaff && <Button onClick={openCreateForm}>+ Agregar producto</Button>}
      </div>

      {formOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false)
            reload()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar producto"
          message={`¿Eliminar "${deleteTarget.name}"? Vas a poder verlo solo en el panel de administración.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {loading && <p className="empty-state">Cargando productos...</p>}
      {error && <p className="empty-state">No pudimos cargar el catálogo: {error}</p>}
      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isStaff={isStaff}
              onEdit={openEditForm}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}
    </section>
  )
}
