/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  
  await knex('agentes').insert([
    { nome: "Gustavo Rodrigues", dataDeIncorporacao: "2024-08-01", cargo: "Inspetor" },
    { nome: "Tatiane Ribeiro", dataDeIncorporacao: "2022-03-19", cargo: "Delegado" }
  ]);
};
