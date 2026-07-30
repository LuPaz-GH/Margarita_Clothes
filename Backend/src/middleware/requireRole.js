function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tenés permiso para hacer esto.' })
    }
    next()
  }
}

module.exports = { requireRole }
