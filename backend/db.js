const { Pool } = require('pg');

const pool = new Pool({
  user: 'sasi',
  host: 'localhost',
  database: 'mydb',
  password: 'bsnl123',
  port: 5432,
});

module.exports = pool;
