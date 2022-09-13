const authorizer = require('@/services/authorization/authorizer');
const { getAllUser } = require('@/services/authorization/user');
const router = require('express').Router();

const readMemberList = async (req, res) => {
  const data = await getAllUser();

  console.log(data);

  // console.log(result);
  // client.release();
  res.send({ message: 'success! good', rows: [...data] });
};

router.get('/', authorizer, readMemberList);

module.exports = router;
