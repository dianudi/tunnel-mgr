/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("tunnels", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("subdomain").notNullable().unique();
    table.string("host").notNullable();
    table.integer("port").notNullable();
    table.boolean("enable").defaultTo("false");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("tunnels");
}

export { up, down };
