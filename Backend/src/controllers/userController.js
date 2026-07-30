const userService = require('../services/userService')
const userHooks = require('../hooks/userHooks')

async function listStaff(req, res, next) {
  try {
    const users = await userService.listStaff()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !['EMPLEADO', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        error: 'name, email, password y role (EMPLEADO o ADMIN) son obligatorios.',
      })
    }

    const user = await userService.createStaff({ name, email, password, role })
    await userHooks.afterStaffCreate(req.user, user)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

async function update(req, res, next) {
  try {
    const existing = await userService.getById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    const { name, email, role, password } = req.body
    if (role && !['EMPLEADO', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'role debe ser EMPLEADO o ADMIN.' })
    }
    if (password && password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    const user = await userService.update(req.params.id, { name, email, role, password })
    await userHooks.afterStaffUpdate(req.user, user, {
      name,
      email,
      role,
      passwordChanged: Boolean(password),
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

async function setActive(req, res, next) {
  try {
    const existing = await userService.getById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    const user = await userService.setActive(req.params.id, req.body.active)
    await userHooks.afterStaffActiveChange(req.user, user)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = { listStaff, createStaff, update, setActive }
