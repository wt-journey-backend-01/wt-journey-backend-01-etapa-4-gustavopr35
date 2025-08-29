/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('casos').del()
  
  await knex('casos').insert([
    { 
      titulo: "Vandalismo", 
      descricao: "Durante a madrugada de 21/11/2024, diversas paredes de um prédio público foram pichadas e vidros foram quebrados.",
      status: "solucionado",
      agente_id: 1
    },
    {
      titulo: "Homicídio", 
      descricao: "Disparos foram reportados às 22:33 do dia 10/07/2021 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
      status: "aberto",
      agente_id: 2
    }
  ]);
};
