const axios = require('axios');
const qs = require('qs');
const login = async (req, res) => {
  // const db = await connection();

  const { code } = req.query;
  console.log(code);
  const {
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    TOKEN_REQUEST_URI,
    LOGIN_REQUEST_URI,
    LOGIN_REDIRECT_URI,
  } = process.env;

  try {
    const {
      data: { id_token, access_token, refresh_token },
    } = await axios({
      url: TOKEN_REQUEST_URI,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: qs.stringify({
        redirect_uri: LOGIN_REQUEST_URI,
        grant_type: 'authorization_code',
        client_secret: OAUTH_CLIENT_SECRET,
        client_id: OAUTH_CLIENT_ID,
        scope: 'email',
        code,
      }),
    });

    res
      .cookie('refresh_token', refresh_token)
      .cookie('access_token', access_token)
      .redirect(LOGIN_REDIRECT_URI);
  } catch (err) {
    console.log(err.response.data);
    res.status(401).send({ error: 'Unauthorized' });
  }
};

module.exports = login;
