const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const getConnection = async () => {
  return require('knex')({
    client: 'pg',
    connection: { ...config },
    pool: {
      min: 0,
      max: 10,
    },
    ssl: { rejectUnauthorized: false },
  });
};

module.exports = getConnection;
