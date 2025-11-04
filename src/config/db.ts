const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Database URL not found in .env file!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database.');
});

pool.query('SELECT NOW()')
  .then(() => console.log('✅  PostgreSQL connection successful!'))
  .catch(() => console.error('❌ PostgreSQL connection failed'));
  
module.exports = pool;
