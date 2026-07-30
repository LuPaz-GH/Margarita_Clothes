const authService = require('../services/authService')

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' })
    }

    // El rol siempre arranca en CLIENTE por esta vía. Los roles EMPLEADO/ADMIN
    // se asignan a mano en la base o desde una pantalla de admin, nunca los
    // elige quien se registra.
    const user = await authService.register({ name, email, password, role: 'CLIENTE' })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' })
    }

    const result = await authService.login({ email, password })
    res.json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }
