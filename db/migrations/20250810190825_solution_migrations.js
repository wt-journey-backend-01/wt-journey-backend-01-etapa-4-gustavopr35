/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('agentes', (table) => {
        table.increments('id').primary()
        table.string('nome').notNullable()
        table.date('dataDeIncorporacao').notNullable()
        table.string('cargo').notNullable()
    })
    .createTable('casos', (table) => {
        table.increments('id').primary()
        table.string('titulo').notNullable()
        table.string('descricao').notNullable()
        table.enu('status', ['aberto', 'solucionado'], {
            useNative: false,
            enumName: 'status'
        })
        table.integer('agente_id').nullable().references('id').inTable('agentes').onDelete('set null')
    })
    .createTable('usuarios', (table) => {
        table.increments('id').primary()
        table.string('nome').notNullable()
        table.string('email').unique().notNullable()
        table.string('senha').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('casos').dropTable('agentes').dropTable('usuarios')
};
