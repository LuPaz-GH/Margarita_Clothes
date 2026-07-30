import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import { imageFallbackHandler } from '../utils/placeholderImage'

export function ProductCard({ product, isStaff, onEdit, onDelete }) {
  function handleEditClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onEdit(product)
  }

  function handleDeleteClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onDelete(product)
  }

  return (
    <div className="product-card-wrapper">
      {isStaff && (
        <div className="product-card-staff-actions">
          <button type="button" onClick={handleEditClick}>
            Editar
          </button>
          <button type="button" className="is-danger" onClick={handleDeleteClick}>
            Eliminar
          </button>
        </div>
      )}
      <Link to={`/product/${product.id}`} className="product-card">
        <img
          src={product.image}
          alt={product.name}
          onError={imageFallbackHandler(product.name)}
        />
        <h3>{product.name}</h3>
        <p>{formatPrice(product.price)}</p>
      </Link>
    </div>
  )
}
