const usuariosRepository = require('../repositories/usuariosRepository')
const { usuarioInputSchema, usuarioLoginSchema, usuarioIdSchema } = require('../utils/usuarioValidation')

class APIError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
        this.name = 'APIError'
    }
}

// GET /usuarios/me
async function getMe(req, res, next) {
    try {
        const usuario = await usuariosRepository.select({ id: req.user.id })
        if (!usuario) {
            return next(new APIError(404, 'Usuário não encontrado.'))
        }

        const { senha, ...usuarioSemSenha } = usuario
        res.status(200).json(usuarioSemSenha)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMe,
}