const express = require('express')
const productController = require('../controllers/productController')
const { authenticate } = require('../middleware/authenticate')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

// Públicas: lo que ve cualquier cliente en la tienda.
router.get('/', productController.list)
router.get('/:id', productController.getOne)

// Solo empleados/admin, y solo con sesión iniciada.
router.get(
  '/admin/all',
  authenticate,
  requireRole('EMPLEADO', 'ADMIN'),
  productController.listAll,
)
router.post('/', authenticate, requireRole('EMPLEADO', 'ADMIN'), productController.create)
router.put('/:id', authenticate, requireRole('EMPLEADO', 'ADMIN'), productController.update)
router.delete(
  '/:id',
  authenticate,
  requireRole('EMPLEADO', 'ADMIN'),
  productController.remove,
)

module.exports = router
