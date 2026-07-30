const express = require('express')
const userController = require('../controllers/userController')
const { authenticate } = require('../middleware/authenticate')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

router.use(authenticate, requireRole('ADMIN'))

router.get('/', userController.listStaff)
router.post('/', userController.createStaff)
router.put('/:id', userController.update)
router.patch('/:id/active', userController.setActive)

module.exports = router
