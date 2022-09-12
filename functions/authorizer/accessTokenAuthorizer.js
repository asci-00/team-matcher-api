const jsonwebtoken = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const AWS = require('aws-sdk');
const { parseCookie } = require('../../utils/common');

console.log('authorizer function running');

const { REGION, USER_POOL_ID } = process.env;

const validateToken = async (event, context) => {
  const iss = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
  const cookies = parseCookie(event.headers.Cookie);
  const { access_token: token } = cookies;

  const { kid } = decodeTokenHeader(token);

  const { data } = await axios.get(iss + '/.well-known/jwks.json');
  const { keys: jsonWebKeys } = data;

  const jsonWebKey = getJsonWebKeyWithKID(kid, jsonWebKeys);

  context.succeed(
    generatePolicy(
      '154d4d55-3743-4b68-a6dc-bd5ddc14ba5f',
      'Allow',
      event.methodArn
    )
  );

  try {
    verifyJsonWebTokenSignature(token, jsonWebKey, iss); // issue: 왜인지 모르겠지만, callback으로 context.succeed를 발생시킬 경우 에러가 발생함

    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({ region: REGION });
    cognitoIdentityServiceProvider.getUser(
      { AccessToken: token },
      (err, data) => {
        if (err) {
          console.log(err);
          context.fail('Unauthorized');
          return;
        }

        console.log('Session not revoked');
        const { Value: sub } = data.UserAttributes[0];
        context.succeed(generatePolicy(sub, 'Allow', event.methodArn));
      }
    );
  } catch (err) {
    console.log(err);
    context.fail('Unauthorized');
  }
};

function generatePolicy(principalId, effect, resource) {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  };
  return authResponse;
}

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
  jsonwebtoken.verify(token, pem, { issuer: iss, algorithms: ['RS256'] });
}

module.exports.handler = validateToken;
