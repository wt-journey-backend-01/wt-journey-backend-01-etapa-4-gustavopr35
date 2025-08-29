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

// DELETE /users/:id
async function deleteUser(req, res, next) {
    try {
        const validation = usuarioIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(400, 'O ID fornecido para o usuário é inválido. Certifique-se de usar um ID válido.'))
        }

        const { id } = validation.data

        const usuarioExists = await usuariosRepository.select({ id: id })
        if (!usuarioExists) {
            return next(new APIError(404, 'Usuário não encontrado.'))
        }

        await usuariosRepository.remove(id)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMe,
    deleteUser
}