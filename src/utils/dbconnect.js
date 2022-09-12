const { Pool } = require('pg');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  pool: {
    min: 0,
    max: 10,
  },
};

const getConnection = async () => {
  const pool = new Pool(config);
  return pool.connect();
};

module.exports = getConnection;
