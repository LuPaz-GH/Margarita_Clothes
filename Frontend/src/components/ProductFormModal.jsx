import { useState } from 'react'
import { Button } from './Button'
import { categories } from '../data/categories'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

function buildInitialForm(product, defaultAudience) {
  if (product) {
    return {
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      audience: product.audience,
      image: product.image || '',
      stock: String(product.stock),
    }
  }
  return {
    name: '',
    description: '',
    price: '',
    category: '',
    audience: defaultAudience || categories[0].slug,
    image: '',
    stock: '0',
  }
}

export function ProductFormModal({ product, defaultAudience, onClose, onSaved }) {
  const { token } = useAuth()
  const [form, setForm] = useState(() => buildInitialForm(product, defaultAudience))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const { url } = await api.uploadFile('/uploads', file, token)
      setForm((prev) => ({ ...prev, image: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
      if (product) {
        await api.put(`/products/${product.id}`, payload, token)
      } else {
        await api.post('/products', payload, token)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Descripción
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Precio
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>
          <label>
            Categoría (tipo de prenda)
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Vestidos, Remeras, etc."
              required
            />
          </label>
          <label>
            Sección
            <select
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.navLabel}
                </option>
              ))}
            </select>
          </label>
          <label>
            Imagen (URL)
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </label>
          <label>
            O subí una foto desde tu compu/cel
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {uploading && <p className="upload-status">Subiendo imagen...</p>}

          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="Vista previa" />
            </div>
          )}

          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <div className="admin-form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
            </Button>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
