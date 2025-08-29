/**
 * Formata uma data para o formato YYYY-MM-DD de forma segura
 * @param {Date|string|any} dateValue - Valor que pode ser uma Date, string ou qualquer outro tipo
 * @returns {string} - Data formatada como YYYY-MM-DD
 */
function formatDateSafely(dateValue) {
    try {
        // Se já for string no formato correto, retorna diretamente
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue
        }

        // Se for uma instância de Date válida
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            return dateValue.toISOString().split('T')[0]
        }

        // Se for string, tenta converter para Date
        if (typeof dateValue === 'string') {
            const parsedDate = new Date(dateValue)
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split('T')[0]
            }
        }

        // Se chegou até aqui, não conseguiu processar
        throw new Error(`Invalid date value: ${dateValue}`)
    } catch (error) {
        // Fallback: retorna data atual ou lança erro mais descritivo
        console.error('Error formatting date:', error.message, 'Value:', dateValue)
        throw new Error(`Failed to format date: ${dateValue}`)
    }
}

/**
 * Formata um objeto agente com data segura
 * @param {Object} agente - Objeto do agente
 * @returns {Object} - Agente com data formatada
 */
function formatAgenteWithSafeDate(agente) {
    if (!agente) return null

    return {
        ...agente,
        dataDeIncorporacao: formatDateSafely(agente.dataDeIncorporacao)
    }
}

module.exports = {
    formatDateSafely,
    formatAgenteWithSafeDate
}
