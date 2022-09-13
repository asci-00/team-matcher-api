const getConnection = require('@/utils/dbconnect');
const query = require('./query');

const findUserByEmail = async (email) => {
  const knex = await getConnection();
  return query.findUserByEmail(knex, { email });
};

const getAllUser = async () => {
  const knex = await getConnection();
  return query.getAllUser(knex);
};

module.exports = {
  findUserByEmail,
  getAllUser,
};
