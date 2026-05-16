const { Pool } = require('pg');
require('dotenv').config();

// Support both individual credentials and DATABASE_URL
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }
    });

// Wrapper to make it compatible with mysql2 promise syntax
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return [result.rows, result.fields];
};

module.exports = { query };
