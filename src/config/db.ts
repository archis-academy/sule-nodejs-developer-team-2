// db.js
const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Database url env dosyasında bulunamadı!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('PostgreSQL veritabanına bağlandı.');
});

pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL bağlantısı başarılı!'))
  .catch(() => console.error('❌ PostgreSQL bağlantısı başarısız:'));
  
module.exports = pool;
