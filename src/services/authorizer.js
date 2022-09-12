const axios = require('axios');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

const authorizer = async (req, res, next) => {
  console.log('[authorizer function running]');
  const { REGION, USER_POOL_ID } = process.env;

  const iss = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
  const { access_token: token } = req.cookies;

  if (!token) res.status(401).send({ error: 'Unauthorized' });
  else {
    const { kid } = decodeTokenHeader(token);
    console.log(kid);
    const { data } = await axios.get(iss + '/.well-known/jwks.json');
    const { keys: jsonWebKeys } = data;

    const jsonWebKey = getJsonWebKeyWithKID(kid, jsonWebKeys);

    try {
      verifyJsonWebTokenSignature(token, jsonWebKey, iss);
      console.log('success');
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
};

function decodeTokenHeader(token) {
  const [headerEncoded] = token.split('.');
  const buff = Buffer.from(headerEncoded, 'base64');
  const text = buff.toString('ascii');
  return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid, jsonWebKeys) {
  for (let jwk of jsonWebKeys) {
    if (jwk.kid === kid) {
      return jwk;
    }
  }
  return null;
}

function verifyJsonWebTokenSignature(token, jsonWebKey, iss) {
  const pem = jwkToPem(jsonWebKey);
  jwt.verify(token, pem, { issuer: iss, algorithms: ['RS256'] });
}

module.exports = authorizer;
