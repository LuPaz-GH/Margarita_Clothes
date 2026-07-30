const express = require('express')
const activityLogController = require('../controllers/activityLogController')
const { authenticate } = require('../middleware/authenticate')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

router.get('/', authenticate, requireRole('ADMIN'), activityLogController.list)

module.exports = router
