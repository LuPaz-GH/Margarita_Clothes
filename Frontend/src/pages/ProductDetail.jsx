import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import { imageFallbackHandler } from '../utils/placeholderImage'
import { useCart } from '../hooks/useCart'
import { Button } from '../components/Button'
import { BackButton } from '../components/BackButton'
import { api } from '../api/client'

export function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    api
      .get(`/products/${id}`)
      .then((data) => {
        if (!cancelled) {
          setProduct({ ...data, price: Number(data.price), audience: data.audience.toLowerCase() })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <section className="product-detail-page">
        <BackButton />
        <p>Cargando producto...</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="product-detail-page">
        <BackButton />
        <p>Producto no encontrado.</p>
        <Link to="/">
          <Button>Volver a la tienda</Button>
        </Link>
      </section>
    )
  }

  const hasStock = product.stock > 0

  return (
    <section className="product-detail-page">
      <BackButton />
      <div className="product-detail-layout">
        <img
          src={product.image}
          alt={product.name}
          onError={imageFallbackHandler(product.name)}
        />
        <div>
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p>{product.description}</p>
          <p className="price">{formatPrice(product.price)}</p>
          <p className={`stock ${hasStock ? '' : 'stock-empty'}`}>
            {hasStock ? `Stock disponible: ${product.stock}` : 'Sin stock'}
          </p>
          <Button onClick={() => addToCart(product)} disabled={!hasStock}>
            {hasStock ? 'Agregar al carrito' : 'Sin stock'}
          </Button>
        </div>
      </div>
    </section>
  )
}
