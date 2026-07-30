const express = require('express')
const { upload } = require('../middleware/upload')
const { uploadImage } = require('../controllers/uploadController')
const { authenticate } = require('../middleware/authenticate')
const { requireRole } = require('../middleware/requireRole')

const router = express.Router()

router.post(
  '/',
  authenticate,
  requireRole('EMPLEADO', 'ADMIN'),
  upload.single('image'),
  uploadImage,
)

module.exports = router
