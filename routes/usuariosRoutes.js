const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/usuarios/me', authMiddleware, usuariosController.getMe)
router.delete('/users/:id', usuariosController.deleteUser)

module.exports = router