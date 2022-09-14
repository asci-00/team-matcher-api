const login = require('./login');

const router = require('express').Router();

router.get('/login', (req, res) => {
  console.log('[login function running]');
  const { CODE_REQUEST_URI, LOGIN_REQUEST_URI } = process.env;

  return res.send({
    redirect_uri: CODE_REQUEST_URI + LOGIN_REQUEST_URI,
  });
});

router.get('/auth/google', login);

module.exports = router;
