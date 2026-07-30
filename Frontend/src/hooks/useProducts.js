import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

function normalize(data) {
  return data.map((product) => ({
    ...product,
    price: Number(product.price),
    audience: product.audience.toLowerCase(),
  }))
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    return api
      .get('/products')
      .then((data) => setProducts(normalize(data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { products, loading, error, reload }
}
