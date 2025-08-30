const agentesRepository = require('../repositories/agentesRepository')
const casosRepository = require('../repositories/casosRepository')
const { agenteInputSchema, agentePutSchema, agentePatchSchema, agenteIdSchema } = require('../utils/agenteValidation')
const { formatAgenteWithSafeDate } = require('../utils/dateFormatter')

class APIError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
        this.name = 'APIError'
    }
}

// GET /agentes
async function getAllAgentes(req, res, next) {
    try {
        const { cargo, sort } = req.query

        // Validar parâmetro sort
        if (sort && !['dataDeIncorporacao', '-dataDeIncorporacao'].includes(sort)) {
            return next(new APIError(400, 'Parâmetro sort deve ser "dataDeIncorporacao" ou "-dataDeIncorporacao"'))
        }

        // Montar query para filtros
        const query = {}
        if (cargo) {
            query.cargo = cargo
        }

        // Buscar agentes com ordenação no banco
        let agentes = await agentesRepository.select(query, sort)

        // Formatar datas de forma segura
        let agentesFormatados = []
        if (agentes) {
            agentesFormatados = agentes.map(agente => formatAgenteWithSafeDate(agente))
        }

        return res.status(200).json(agentesFormatados)
    } catch (error) {
        next(error)
    }
}

// GET /agentes/:id
async function getAgenteById(req, res, next) {
    try {
        const validation = agenteIdSchema.safeParse({ id: req.params.id })  
        if (!validation.success) {
            return next(new APIError(400, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
        }

        const { id } = validation.data

        const agente = await agentesRepository.select({ id: id })
        if (!agente) {
            return next(new APIError(404, 'Agente não encontrado.'))
        }
    
        // Formatar data de forma segura
        const agenteFormatado = formatAgenteWithSafeDate(agente)

        return res.status(200).json(agenteFormatado)
    } catch (error) {
        next(error)
    }
}

// GET /agentes/:id/casos
async function getCasosByAgente(req, res, next) {
    try {
        const validation = agenteIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(400, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
        }

        const { id } = validation.data

        const agente = await agentesRepository.select({ id: id })
        if (!agente) {
            return next(new APIError(404, 'Agente não encontrado.'))
        }

        const casos = await casosRepository.select({ agente_id: id })

        return res.status(200).json(casos)
    } catch (error) {
        next(error)
    }
}

// POST /agentes
async function insertAgente(req, res, next) {
    try {
        const validation = agenteInputSchema.safeParse(req.body)
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
    
        const { nome, dataDeIncorporacao, cargo } = validation.data
    
        const agente = {
            nome,
            dataDeIncorporacao,
            cargo
        }

        const created = await agentesRepository.insert(agente)

        // Formatar data de forma segura
        let agenteFormatado = {}
        if (created) {
            agenteFormatado = formatAgenteWithSafeDate(created)
        }

        return res.status(201).json(agenteFormatado)
    } catch (error) {
        next(error)
    }
}

// PUT /agentes/:id
async function putAgente(req, res, next) {
    try {
        const IDvalidation = agenteIdSchema.safeParse({ id: req.params.id })
        if (!IDvalidation.success) {
            return next(new APIError(400, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
        }
        
        const bodyValidation = agentePutSchema.safeParse(req.body)
        if (!bodyValidation.success) {
            const errors = {}
            bodyValidation.error.issues.forEach(err => {
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            })
        }

        const { id } = IDvalidation.data
        // Proteção explícita: remove qualquer 'id' que possa vir no body
        const { id: _, ...updatedFields } = bodyValidation.data
    
        const agenteExists = await agentesRepository.select({ id: id })
        if (!agenteExists) {
            return next(new APIError(404, 'Agente não encontrado.'))
        }
    
        const updatedAgente = {
            nome: updatedFields.nome,
            dataDeIncorporacao: updatedFields.dataDeIncorporacao,
            cargo: updatedFields.cargo
        }

        const updated = await agentesRepository.update(id, updatedAgente)

        // Formatar data de forma segura
        let agenteFormatado = {}
        if (updated) {
            agenteFormatado = formatAgenteWithSafeDate(updated)
        }

        return res.status(200).json(agenteFormatado)
    } catch (error) {
        next(error)
    }
}

// PATCH /agentes/:id
async function patchAgente(req, res, next) {
    try {
        const IDvalidation = agenteIdSchema.safeParse({ id: req.params.id })
        if (!IDvalidation.success) {
            return next(new APIError(400, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
        }

        const bodyValidation = agentePatchSchema.safeParse(req.body)
        if (!bodyValidation.success) {
            // Verifica se o erro é sobre não ter campos para atualizar
            const hasEmptyFieldsError = bodyValidation.error.issues.some(err => 
                err.message === 'Pelo menos um campo deve ser atualizado.'
            )
            if (hasEmptyFieldsError) {
                return res.status(400).json({
                    status: 400,
                    message: "Pelo menos um campo deve ser atualizado."
                })
            }
            
            const errors = {}
            bodyValidation.error.issues.forEach(err => {
                errors[err.path[0]] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            })
        }

        const { id } = IDvalidation.data
        const updateData = bodyValidation.data
    
        const agenteExists = await agentesRepository.select({ id: id })
        if (!agenteExists) {
            return next(new APIError(404, 'Agente não encontrado.'))
        }
    
        const updatedAgente = {
            ...agenteExists,
            ...updateData,
        }
        delete updatedAgente.id

        const updated = await agentesRepository.update(id, updatedAgente)

        // Formatar data de forma segura
        let agenteFormatado = {}
        if (updated) {
            agenteFormatado = formatAgenteWithSafeDate(updated)
        }

        return res.status(200).json(agenteFormatado)
    } catch (error) {
        next(error)
    }
}

// DELETE /agentes/:id
async function deleteAgente(req, res, next) {
    try {
        const validation = agenteIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(400, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
        }

        const { id } = validation.data
    
        const agenteExists = await agentesRepository.select({ id: id })
        if (!agenteExists) {
            return next(new APIError(404, 'Agente não encontrado.'))
        }
    
        await agentesRepository.remove(id)
        
        return res.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    getCasosByAgente,
    insertAgente,
    putAgente,
    patchAgente,
    deleteAgente
}