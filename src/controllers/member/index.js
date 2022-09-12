const authorizer = require('@/services/authorizer');
const getConnection = require('@/utils/dbconnect');
const router = require('express').Router();

const readMember = async (req, res) => {
  const client = await getConnection();

  const result = await client.query('SELECT * FROM dev.user');

  console.log(result);
  client.release();
  res.send({ message: 'success! good', rows: [] });
};

router.get('/', authorizer, readMember);

module.exports = router;
