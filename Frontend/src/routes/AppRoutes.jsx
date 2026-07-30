import { Routes, Route, useParams } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Category } from '../pages/Category'
import { ProductDetail } from '../pages/ProductDetail'
import { Cart } from '../pages/Cart'
import { Checkout } from '../pages/Checkout'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { AdminLayout } from '../pages/admin/AdminLayout'
import { AdminProducts } from '../pages/admin/AdminProducts'
import { AdminOrders } from '../pages/admin/AdminOrders'
import { AdminEmployees } from '../pages/admin/AdminEmployees'
import { AdminActivity } from '../pages/admin/AdminActivity'
import { ProtectedRoute } from '../components/ProtectedRoute'

function CategoryRoute() {
  const { slug } = useParams()
  return <Category key={slug} />
}

function ProductDetailRoute() {
  const { id } = useParams()
  return <ProductDetail key={id} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categoria/:slug" element={<CategoryRoute />} />
      <Route path="/product/:id" element={<ProductDetailRoute />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['EMPLEADO', 'ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProducts />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route
          path="employees"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="activity"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminActivity />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
