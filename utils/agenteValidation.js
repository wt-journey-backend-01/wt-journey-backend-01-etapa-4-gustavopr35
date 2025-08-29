const { z } = require('zod')

// Schema para criação (POST) - não exige id
const agenteInputSchema = z.object({
  nome: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo nome é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo nome é do tipo string.'
      }
    }
  }).min(1, { message: 'campo nome não pode ser vazio.' }),
  dataDeIncorporacao: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo dataDeIncorporacao é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo dataDeIncorporacao é do tipo string.'
      }
    }
  })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'dataDeIncorporacao deve estar no formato YYYY-MM-DD.' })
    .refine(date => new Date(date) <= new Date(), { message: 'dataDeIncorporacao não pode ser uma data futura.' }),
  cargo: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo cargo é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo cargo é do tipo string.'
      }
    }
  }).min(1, { message: 'Cargo não pode ser vazio.' })
})

// Schema para atualização total (PUT) - igual ao de criação, mas rigoroso
const agentePutSchema = agenteInputSchema.strict()

// Schema para atualização parcial (PATCH) - todos campos opcionais, mas só permite os válidos
const agentePatchSchema = z.object({
  nome: z.string().min(1, { message: 'Nome não pode ser vazio.' }).optional(),
  dataDeIncorporacao: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'dataDeIncorporacao deve estar no formato YYYY-MM-DD.' })
    .refine(date => new Date(date) <= new Date(), { message: 'dataDeIncorporacao não pode ser uma data futura.' })
    .optional(),
  cargo: z.string().min(1, { message: 'Cargo não pode ser vazio.' }).optional()
}).refine(obj => Object.keys(obj).length > 0, { message: 'Pelo menos um campo deve ser atualizado.' })

// Schema para validar apenas o id (param)
const agenteIdSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val > 0, { message: 'ID deve ser um número inteiro positivo.' })
})

module.exports = {
  agenteInputSchema,
  agentePutSchema,
  agentePatchSchema,
  agenteIdSchema
}