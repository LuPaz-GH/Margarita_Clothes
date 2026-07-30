const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token de autenticación.' })
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}

module.exports = { authenticate }
