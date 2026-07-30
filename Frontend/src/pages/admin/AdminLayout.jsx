import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AdminLayout() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <section className="admin-page">
      <h1>Panel de gestión</h1>
      <nav className="admin-tabs">
        <NavLink to="/admin/products" end>
          Productos
        </NavLink>
        <NavLink to="/admin/orders">Pedidos</NavLink>
        {isAdmin && <NavLink to="/admin/employees">Empleados</NavLink>}
        {isAdmin && <NavLink to="/admin/activity">Actividad</NavLink>}
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </section>
  )
}
