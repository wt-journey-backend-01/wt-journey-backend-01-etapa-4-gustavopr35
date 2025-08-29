const { z } = require('zod')

// Schema para criação (POST) - não exige id
const usuarioInputSchema = z.object({
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
  email: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo email é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo email é do tipo string.'
      }
    }
  }).min(1, { message: 'campo email não pode ser vazio.' }),
  senha: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo senha é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo senha é do tipo string.'
      }
    }
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, { message: 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra minúscula, uma maiúscula, um número e um caractere especial.' })
}).strict()

const usuarioLoginSchema = z.object({
  email: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo email é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo email é do tipo string.'
      }
    }
  }).min(1, { message: 'campo email não pode ser vazio.' }),
  senha: z.string({
    error: (iss) => {
      if (!iss.input) {
        return 'Campo senha é obrigatório.'
      }
      if (iss.code === 'invalid_type') {
        return 'Campo senha é do tipo string.'
      }
    }
  }).min(1, { message: 'campo senha não pode ser vazio.' }),
}).strict()

// Schema para validar apenas o id (param)
const usuarioIdSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive({ message: 'ID deve ser um número inteiro positivo.' }))
})

module.exports = {
  usuarioInputSchema,
  usuarioLoginSchema,
  usuarioIdSchema
}