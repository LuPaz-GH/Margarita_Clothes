const express = require('express')
const authRoutes = require('./authRoutes')
const productRoutes = require('./productRoutes')
const activityLogRoutes = require('./activityLogRoutes')
const orderRoutes = require('./orderRoutes')
const userRoutes = require('./userRoutes')
const uploadRoutes = require('./uploadRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/activity-logs', activityLogRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/uploads', uploadRoutes)

module.exports = router
