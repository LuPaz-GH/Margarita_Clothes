import { NavLink, useNavigate } from 'react-router-dom'
import { categories } from '../data/categories'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isStaff = user?.role === 'EMPLEADO' || user?.role === 'ADMIN'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Margarita Clothes
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          {categories.map((category) => (
            <NavLink key={category.slug} to={`/categoria/${category.slug}`}>
              {category.navLabel}
            </NavLink>
          ))}
          {isStaff && <NavLink to="/admin">Panel</NavLink>}
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">
                Hola, {user.name?.split(' ')[0] || user.email || 'usuario'}
              </span>
              <button type="button" className="navbar-link-btn" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login">Ingresar</NavLink>
          )}
          <NavLink to="/cart" className="navbar-cart">
            Carrito
            {count > 0 && <span className="navbar-cart-badge">{count}</span>}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
