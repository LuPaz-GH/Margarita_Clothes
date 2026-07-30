import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'

const actionLabels = {
  CREAR_PRODUCTO: 'Creó un producto',
  EDITAR_PRODUCTO: 'Editó un producto',
  ELIMINAR_PRODUCTO: 'Eliminó un producto',
  CREAR_EMPLEADO: 'Creó un empleado',
  EDITAR_EMPLEADO: 'Editó un empleado',
  ACTIVAR_EMPLEADO: 'Activó un empleado',
  DESACTIVAR_EMPLEADO: 'Desactivó un empleado',
  CAMBIAR_ESTADO_PEDIDO: 'Cambió el estado de un pedido',
}

function formatAction(action) {
  return actionLabels[action] || action
}

function formatDetails(details) {
  if (!details) return ''
  try {
    const parsed = JSON.parse(details)
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' · ')
  } catch {
    return details
  }
}

export function AdminActivity() {
  const { token } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/activity-logs', token)
      .then(setLogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div>
      <h2>Actividad de empleados</h2>
      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="empty-state">Cargando...</p>
      ) : logs.length === 0 ? (
        <p className="empty-state">Todavía no hay actividad registrada.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {new Date(log.createdAt).toLocaleDateString('es-AR')}
                    <br />
                    <small>{new Date(log.createdAt).toLocaleTimeString('es-AR')}</small>
                  </td>
                  <td>
                    {log.user.name} <small>({log.user.role})</small>
                  </td>
                  <td>{formatAction(log.action)}</td>
                  <td className="col-wrap">{formatDetails(log.details)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
