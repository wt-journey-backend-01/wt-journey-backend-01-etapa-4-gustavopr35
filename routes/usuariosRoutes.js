const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/me', authMiddleware, usuariosController.getMe)
router.delete('/:id', authMiddleware, usuariosController.deleteUser)

module.exports = router