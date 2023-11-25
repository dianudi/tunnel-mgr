// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./database/db.sqlite3",
    },
    migrations: {
      directory: "migrations",
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "better-sqlite3",
    connection: {
      filename: "./database/db.sqlite3",
    },
    migrations: {
      directory: "migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "better-sqlite3",
    connection: {
      filename: "./database/db.sqlite3",
    },
    migrations: {
      directory: "migrations",
      tableName: "knex_migrations",
    },
  },
};
