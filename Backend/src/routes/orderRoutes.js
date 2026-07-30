const express = require('express')
const orderController = require('../controllers/orderController')
const { authenticate } = require('../middleware/authenticate')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

router.post('/', authenticate, orderController.create)
router.get('/me', authenticate, orderController.listMine)
router.get('/', authenticate, requireRole('ADMIN', 'EMPLEADO'), orderController.listAll)
router.put(
  '/:id/status',
  authenticate,
  requireRole('ADMIN', 'EMPLEADO'),
  orderController.updateStatus,
)

module.exports = router
