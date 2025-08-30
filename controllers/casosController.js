const casosRepository = require('../repositories/casosRepository')
const agentesRepository = require('../repositories/agentesRepository')
const { casoInputSchema, casoPutSchema, casoPatchSchema, casoIdSchema } = require('../utils/casoValidation')
const { agenteIdSchema } = require('../utils/agenteValidation')
const { formatAgenteWithSafeDate } = require('../utils/dateFormatter')

class APIError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
        this.name = 'APIError'
    }
}

// GET /casos
async function getAllCasos(req, res, next) {
    try {
        const { agente_id, status } = req.query
    
        const query = {}
    
        if (agente_id) {
            const agentValidation = agenteIdSchema.safeParse({ id: agente_id })
            if (!agentValidation.success) {
                return next(new APIError(404, 'O ID fornecido para o agente é inválido. Certifique-se de usar um ID válido.'))
            }
            query.agente_id = agentValidation.data.id
        }
    
        if (status) {
            if (!['aberto', 'solucionado'].includes(status)) {
                return next(new APIError(400, 'Status deve ser "aberto" ou "solucionado".'))
            }
            query.status = status
        }

        const casos = await casosRepository.select(query)
    
        return res.status(200).json(casos)
    } catch (error) {
        next(error)
    }
}

// GET /casos/:id
async function getCasoById(req, res, next) {
    try {
        const validation = casoIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(404, 'O ID fornecido para o caso é inválido. Certifique-se de usar um ID válido.'))
        }
        
        const { id } = validation.data

        const caso = await casosRepository.select({ id: id })
        if (!caso) {
            return next(new APIError(404, 'Caso não encontrado.'))
        }
    
        return res.status(200).json(caso)
    } catch (error) {
        next(error)
    }
}

// GET /casos/:id/agente
async function getAgenteByCaso(req, res, next) {
    try {
        const validation = casoIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(404, 'O ID fornecido para o caso é inválido. Certifique-se de usar um ID válido.'))
        }
        
        const { id } = validation.data
    
        const casoExists = await casosRepository.select({ id: id })
        if (!casoExists) {
            return next(new APIError(404, 'Caso não encontrado.'))
        }
    
        const agente = await agentesRepository.select({ id: casoExists.agente_id })
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

// GET /casos/search
async function searchInCaso(req, res, next) {
    try {
        const { q } = req.query
    
        if (!q) {
            return next(new APIError(400, 'Termo de pesquisa "q" é obrigatório.'))
        }

        const casos = await casosRepository.searchTermo(q)
    
        return res.status(200).json(casos)
    } catch (error) {
        next(error)
    }
}

// POST /casos
async function insertCaso(req, res, next) {
    try {
        const validation = casoInputSchema.safeParse(req.body)
        if (!validation.success) {
            const errors = {}
            validation.error.issues.forEach(err => {
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: 'Parâmetros inválidos',
                errors
            })
        }

        const { titulo, descricao, status, agente_id } = validation.data
    
        // Verifica se agente existe (apenas se agente_id não for null)
        if (agente_id !== null) {
            const agenteExists = await agentesRepository.select({ id: agente_id })
            if (!agenteExists) {
                return next(new APIError(404, 'Agente não encontrado.'))
            }
        }
    
        const caso = {
            titulo,
            descricao,
            status,
            agente_id
        }

        const created = await casosRepository.insert(caso)

        return res.status(201).json(created)
    } catch (error) {
        next(error)
    }
}

// PUT /casos/:id
async function putCaso(req, res, next) {
    try {
        const IDvalidation = casoIdSchema.safeParse({ id: req.params.id })
        if (!IDvalidation.success) {
            return next(new APIError(404, 'O ID fornecido para o caso é inválido. Certifique-se de usar um ID válido.'))
        }

        const bodyValidation = casoPutSchema.safeParse(req.body)
        if (!bodyValidation.success) {
            const errors = {}
            bodyValidation.error.issues.forEach(err => {
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: 'Parâmetros inválidos',
                errors
            })
        }
        
        const { id } = IDvalidation.data
        // Proteção explícita: remove qualquer 'id' que possa vir no body
        const { id: _, ...updatedFields } = bodyValidation.data
    
        const casoExists = await casosRepository.select({ id: id })
        if (!casoExists) {
            return next(new APIError(404, 'Caso não encontrado.'))
        }
    
        // Verifica se agente existe (apenas se agente_id não for null)
        if (updatedFields.agente_id !== null) {
            const agenteExists = await agentesRepository.select({ id: updatedFields.agente_id })
            if (!agenteExists) {
                return next(new APIError(404, 'Agente não encontrado.'))
            }
        }
    
        const casoUpdate = {
            titulo: updatedFields.titulo,
            descricao: updatedFields.descricao,
            status: updatedFields.status,
            agente_id: updatedFields.agente_id
        }

        const updated = await casosRepository.update(id, casoUpdate)

        return res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
}

// PATCH /casos/:id
async function patchCaso(req, res, next) {
    try {
        const IDvalidation = casoIdSchema.safeParse({ id: req.params.id })
        if (!IDvalidation.success) {
            return next(new APIError(404, 'O ID fornecido para o caso é inválido. Certifique-se de usar um ID válido.'))
        }

        const bodyValidation = casoPatchSchema.safeParse(req.body)
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
                const fieldName = err.path[0] || 'geral'
                errors[fieldName] = err.message
            })
            return res.status(400).json({
                status: 400,
                message: 'Parâmetros inválidos',
                errors
            })
        }
        
        const { id } = IDvalidation.data
        // Proteção explícita: remove qualquer 'id' que possa vir no body
        const { id: _, ...updateData } = bodyValidation.data
    
        const casoExists = await casosRepository.select({ id: id })
        if (!casoExists) {
            return next(new APIError(404, 'Caso não encontrado.'))
        }
        
        if (updateData.agente_id !== undefined && updateData.agente_id !== null) {
            const agenteExists = await agentesRepository.select({ id: updateData.agente_id })
            if (!agenteExists) {
                return next(new APIError(404, 'Agente não encontrado.'))
            }
        }
    
        // Mescla apenas os campos permitidos (sem ID)
        const casoUpdate = {
            titulo: updateData.titulo ?? casoExists.titulo,
            descricao: updateData.descricao ?? casoExists.descricao,
            status: updateData.status ?? casoExists.status,
            agente_id: updateData.agente_id ?? casoExists.agente_id
        }

        const updated = await casosRepository.update(id, casoUpdate)

        return res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
}

// DELETE /casos/:id
async function deleteCaso(req, res, next) {
    try {
        const validation = casoIdSchema.safeParse({ id: req.params.id })
        if (!validation.success) {
            return next(new APIError(404, 'O ID fornecido para o caso é inválido. Certifique-se de usar um ID válido.'))
        }
        
        const { id } = validation.data
    
        const casoExists = await casosRepository.select({ id: id })
        if (!casoExists) {
            return next(new APIError(404, 'Caso não encontrado.'))
        }
    
        await casosRepository.remove(id)
        
        return res.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    insertCaso,
    putCaso,
    patchCaso,
    deleteCaso,
    getAgenteByCaso,
    searchInCaso
}