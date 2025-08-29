const db = require('../db/db')

async function select(query = {}, sort = null) {
    try {
        let queryBuilder = db('agentes')

        // Aplicar filtros
        if (Object.keys(query).length > 0) {
            queryBuilder = queryBuilder.where(query)
        }

        // Aplicar ordenação
        if (sort) {
            const direction = sort.startsWith('-') ? 'desc' : 'asc'
            const column = sort.replace('-', '')
            queryBuilder = queryBuilder.orderBy(column, direction)
        }

        const selected = await queryBuilder.select()
        const isSingular = Object.keys(query).length === 1 && 'id' in query

        if (!selected || selected.length === 0) {
            return false
        }

        return isSingular ? selected[0] : selected

    } catch (error) {
        console.error(error)
        return false
    }
}

async function insert(object) {
    try {

        const inserted = await db('agentes').insert(object, ["*"])

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

        const updated = await db('agentes').where({id: id}).update(dataToUpdate, ["*"])

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

        const removed = await db('agentes').where({id: id}).del()

        if (!removed) {
            return false
        }

        return true
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
}