const COMMON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const handler = async (event, context, callback) => {
  console.log('test');
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: 'success! good', rows: [] }),
    headers: COMMON_HEADERS,
  });
};

module.exports.handler = handler;
