module.exports = {
  findUserByEmail(knex, { email }) {
    const query = knex.select('*').from('dev.user').where('email', email);
    return query;
  },
  getAllUser(knex) {
    const query = knex.select('*').from('dev.user').orderBy('name');
    return query;
  },
};
