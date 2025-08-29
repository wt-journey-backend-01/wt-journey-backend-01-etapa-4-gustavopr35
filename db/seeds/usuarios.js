/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const bcrypt = require('bcryptjs')
  
  // Deletes ALL existing entries
  await knex('usuarios').del()

  // Hash das senhas de exemplo
  const senhaHashada = await bcrypt.hash('MinhaSenh@123', 10)

  await knex('usuarios').insert([
    {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: senhaHashada
    },
    {
      nome: 'Maria Santos',
      email: 'maria@exemplo.com', 
      senha: senhaHashada
    },
    {
      nome: 'Pedro Oliveira',
      email: 'pedro@exemplo.com',
      senha: senhaHashada
    }
  ]);
};
