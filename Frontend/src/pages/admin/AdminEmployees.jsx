import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/Button'

const emptyForm = { name: '', email: '', password: '', role: 'EMPLEADO' }

export function AdminEmployees() {
  const { token } = useAuth()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('active')

  function loadStaff() {
    api
      .get('/users', token)
      .then(setStaff)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadStaff, [token])

  const activeStaff = useMemo(() => staff.filter((member) => member.active), [staff])
  const inactiveStaff = useMemo(() => staff.filter((member) => !member.active), [staff])
  const visibleStaff = view === 'active' ? activeStaff : inactiveStaff

  function openCreateForm() {
    setEditingStaff(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEditForm(member) {
    setEditingStaff(member)
    setForm({ name: member.name, email: member.email, password: '', role: member.role })
    setFormOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingStaff) {
        await api.put(
          `/users/${editingStaff.id}`,
          {
            name: form.name,
            email: form.email,
            role: form.role,
            ...(form.password ? { password: form.password } : {}),
          },
          token,
        )
      } else {
        await api.post('/users', form, token)
      }
      setForm(emptyForm)
      setEditingStaff(null)
      setFormOpen(false)
      loadStaff()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(member) {
    try {
      await api.patch(`/users/${member.id}/active`, { active: !member.active }, token)
      loadStaff()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h2>Empleados</h2>
        <Button onClick={formOpen ? () => setFormOpen(false) : openCreateForm}>
          {formOpen ? 'Cancelar' : '+ Nuevo empleado'}
        </Button>
      </div>

      <div className="admin-subtabs">
        <button
          type="button"
          className={view === 'active' ? 'is-active' : ''}
          onClick={() => setView('active')}
        >
          Activos ({activeStaff.length})
        </button>
        <button
          type="button"
          className={view === 'inactive' ? 'is-active' : ''}
          onClick={() => setView('inactive')}
        >
          Desactivados ({inactiveStaff.length})
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {formOpen && (
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
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            {editingStaff ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingStaff ? 'Dejar en blanco para no cambiarla' : ''}
              required={!editingStaff}
            />
          </label>
          <label>
            Rol
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <div className="admin-form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editingStaff ? 'Guardar cambios' : 'Crear empleado'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Cargando...</p>
      ) : visibleStaff.length === 0 ? (
        <p className="empty-state">
          {view === 'active' ? 'No hay empleados activos.' : 'No hay empleados desactivados.'}
        </p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleStaff.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => openEditForm(member)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`admin-link-btn${member.active ? ' admin-link-btn-danger' : ''}`}
                        onClick={() => toggleActive(member)}
                      >
                        {member.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
