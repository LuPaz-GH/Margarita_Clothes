import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategoryBySlug } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { SearchBar } from '../components/SearchBar'
import { Pagination } from '../components/Pagination'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { ProductFormModal } from '../components/ProductFormModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'

const PAGE_SIZE = 6

export function Category() {
  const { slug } = useParams()
  const category = getCategoryBySlug(slug)
  const { products, loading, error, reload } = useProducts()
  const { user, token } = useAuth()
  const isStaff = user?.role === 'EMPLEADO' || user?.role === 'ADMIN'

  const allProducts = useMemo(
    () => products.filter((product) => product.audience === slug),
    [products, slug],
  )
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(
    () =>
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [allProducts, search],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  if (!category) {
    return (
      <section className="category-page">
        <p>Categoría no encontrada.</p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </section>
    )
  }

  function handleSearchChange(value) {
    setSearch(value)
    setPage(1)
  }

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
    <section className="category-page">
      <BackButton />
      <div className="admin-toolbar">
        <h1>{category.title}</h1>
        {isStaff && <Button onClick={openCreateForm}>+ Agregar producto</Button>}
      </div>

      {formOpen && (
        <ProductFormModal
          product={editingProduct}
          defaultAudience={slug}
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

      {!loading &&
        !error &&
        (allProducts.length === 0 ? (
          <p className="empty-state">Todavía no hay productos cargados en esta categoría.</p>
        ) : (
          <>
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder={`Buscar en ${category.title.toLowerCase()}...`}
            />

            {filtered.length === 0 ? (
              <p className="empty-state">
                No encontramos productos que coincidan con "{search}".
              </p>
            ) : (
              <>
                <div className="product-grid">
                  {paginated.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isStaff={isStaff}
                      onEdit={openEditForm}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        ))}
    </section>
  )
}
