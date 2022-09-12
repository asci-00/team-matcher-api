const handler = async (event, context, callback) => {
  console.log(event.queryStringParameters);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: 'success! good', rows: [] }),
  });
};

module.exports.handler = handler;
