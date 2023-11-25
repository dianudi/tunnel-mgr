import knex from "knex";

const db = knex({
  client: "better-sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./database/db.sqlite3",
  },
});

export default db;
