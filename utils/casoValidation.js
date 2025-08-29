const { z } = require('zod')

// Schema para criação (POST) - não exige id
const casoInputSchema = z.object({
    titulo: z.string({
        error: (iss) => {
            if (!iss.input) {
                return 'Campo titulo é obrigatório.'
            }
            if (iss.code === 'invalid_type') {
                return 'Campo titulo é do tipo string.'
            }
        }
    }).min(1, { message: 'Titulo não pode ser vazio.' }),
    descricao: z.string({
        error: (iss) => {
            if (!iss.input) {
                return 'Campo descricao é obrigatório.'
            }
            if (iss.code === 'invalid_type') {
                return 'Campo descricao é do tipo string.'
            }
        }
    }).min(1, { message: 'Descricao não pode ser vazio.' }),
    status: z.enum(['aberto', 'solucionado'], {
        error: (iss) => {
            if (!iss.input) {
                return 'Campo status é obrigatório.'
            }
            if (iss.code === 'invalid_value') {
                return 'Status deve ser aberto ou solucionado.'
            }
            if (iss.code === 'invalid_type') {
                return 'Campo status é do tipo string.'
            }
        }
    }),
    agente_id: z.number({
        error: (iss) => {
            if (!iss.input) {
                return 'Campo agente_id é obrigatório.'
            }
            if (iss.code === 'invalid_type') {
                return 'Campo agente_id é do tipo number.'
            }
        }
    }).int({ message: 'agente_id deve ser um número inteiro.' }).positive({ message: 'agente_id deve ser um número positivo.' }).nullable()
}).strict()

// Schema para atualização total (PUT) - igual ao de criação
const casoPutSchema = casoInputSchema.strict()

// Schema para atualização parcial (PATCH) - todos campos opcionais, mas só permite os válidos
const casoPatchSchema = z.object({
    titulo: z.string().min(1, { message: 'Campo "titulo" é obrigatório.' }).optional(),
    descricao: z.string().min(1, { message: 'Campo "descricao" é obrigatório.' }).optional(),
    status: z.enum(['aberto', 'solucionado'], {
        invalid_type_error: 'Status deve ser "aberto" ou "solucionado".'
    }).optional(),
    agente_id: z.number().int({ message: 'agente_id deve ser um número inteiro.' }).positive({ message: 'agente_id deve ser um número positivo.' }).nullable().optional()
}).strict().refine(obj => Object.keys(obj).length > 0, { message: 'Pelo menos um campo deve ser atualizado.' })

// Schema para validar apenas o id (param)
const casoIdSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive({ message: 'ID deve ser um número inteiro positivo.' }))
})

module.exports = {
    casoInputSchema,
    casoPutSchema,
    casoPatchSchema,
    casoIdSchema
}