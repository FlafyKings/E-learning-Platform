//DATABASE
const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  // Change using:
  // SELECT *
  // FROM pg_settings
  // WHERE name = 'port';
  password: "postgres",
  database: "LepszyUPEL",
});

module.exports = client;
