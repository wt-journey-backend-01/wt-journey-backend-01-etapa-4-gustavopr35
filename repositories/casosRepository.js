const db = require('../db/db')

async function select(query = {}) {
    try {
        const selected = await db('casos').where(query)
        const isSingular = Object.keys(query).length === 1 && 'id' in query

        if (!selected || selected.length === 0) {
            return isSingular ? false : []
        }

        return isSingular ? selected[0] : selected

    } catch (error) {
        console.error(error)
        return false
    }
}

async function insert(object) {
    try {
        const inserted = await db('casos').insert(object).returning('*')

        if (!inserted) {
            return false
        }

        return inserted[0]

    } catch (error) {
        console.error(error)
        return false
    }
}

async function update(id, updatedObject) {
    try {
        // Remove id do objeto para evitar alteração da chave primária
        const { id: _, ...dataToUpdate } = updatedObject

        const updated = await db('casos').where({id: id}).update(dataToUpdate).returning('*')

        if (!updated) {
            return false
        }

        return updated[0]

    } catch (error) {
        console.error(error)
        return false
    }
}

async function remove(id) {
    try {
        const removed = await db('casos').where({id: id}).del()

        if (!removed) {
            return false
        }

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

async function searchTermo(termo) {
    try {
        const casos = await db('casos')
            .where('titulo', 'ilike', `%${termo}%`)
            .orWhere('descricao', 'ilike', `%${termo}%`)

        return casos
    } catch (error) {
        console.error(error)
        return false
    }
}

module.exports = {
    select,
    insert,
    update,
    remove,
    searchTermo
}