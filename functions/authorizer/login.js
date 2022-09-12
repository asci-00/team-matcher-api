const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('qs');
const { redirectResponse } = require('../../utils/response');

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CODE_REQUEST_URI,
  TOKEN_REQUEST_URI,
  LOGIN_REQUEST_URI,
  LOGIN_REDIRECT_URI,
} = process.env;

const login = async (event, context, callback) => {
  if (!event.queryStringParameters?.code) {
    callback(null, redirectResponse({ target: CODE_REQUEST_URI }));
  } else {
    // 토큰 요청
    await requestToken(event.queryStringParameters.code, context, callback);
  }
};

const requestToken = async (code, context, callback) => {
  try {
    const {
      data: { id_token, access_token, refresh_token, token_type },
    } = await axios({
      url: TOKEN_REQUEST_URI,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: qs.stringify({
        redirect_uri: LOGIN_REQUEST_URI,
        grant_type: 'authorization_code',
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        scope: 'email',
        code,
      }),
    });

    // const { email } = jwt.decode(id_token, { completed: true });
    // todo: email check logic

    callback(
      null,
      redirectResponse({
        target: LOGIN_REDIRECT_URI,
        cookie: { refresh_token, access_token },
      })
    );
  } catch (err) {
    console.log(err.response);
    context.fail(err.response.data?.message);
  }
};

module.exports.handler = login;
