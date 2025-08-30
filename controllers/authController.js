const usuariosRepository = require('../repositories/usuariosRepository')
const { usuarioInputSchema, usuarioLoginSchema, usuarioIdSchema } = require('../utils/usuarioValidation')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

class APIError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
        this.name = 'APIError'
    }
}

// POST /auth/register
async function register(req, res, next) {
    try {
        const validation = usuarioInputSchema.safeParse(req.body)
        if (!validation.success) {
            const errors = {}
            validation.error.issues.forEach(err => {
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            })
        }
        const { nome, email, senha } = validation.data

        const usuarioExists = await usuariosRepository.select({ email: email })
        if (usuarioExists) {
            return next(new APIError(400, 'O email fornecido já está em uso.'))
        }

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(senha, salt)

        const usuario = await usuariosRepository.insert({
            nome,
            email,
            senha: hashSenha
        })

        if (!usuario) {
            return next(new APIError(500, 'Internal Server Error'))
        }

        return res.status(201).json({ nome: usuario.nome, email: usuario.email })
    } catch (error) {
        next(error)
    }
}

// POST /auth/login
async function login(req, res, next) {
    try {
        const validation = usuarioLoginSchema.safeParse(req.body)
        if (!validation.success) {
            const errors = {}
            validation.error.issues.forEach(err => {
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            })
        }
        const { email, senha } = validation.data

        const usuarioExists = await usuariosRepository.select({ email: email })
        if (!usuarioExists) {
            return next(new APIError(401, 'Email ou senha inválidos.'))
        }

        const isPasswordValid = await bcrypt.compare(senha, usuarioExists.senha)
        if (!isPasswordValid) {
            return next(new APIError(401, 'Email ou senha inválidos.'))
        }

        const token = generateToken({ id: usuarioExists.id, email: usuarioExists.email })

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'lax',
        //     maxAge: 60 * 60 * 1000,
        //     path: '/',
        // })

        return res.status(200).json({
            access_token: token
        })
    } catch (error) {
        next(error)
    }
}

// POST /auth/logout
async function logout(req, res) {
    // res.clearCookie('token', { path: '/' })
    // return res.status(200).json({
    //     status: 200,
    //     message: 'Logout efetuado com sucesso.'
    // })
    try {
        req.user = undefined

        return res.status(200).json({
            message: 'Logout efetuado com sucesso.'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    logout,
}