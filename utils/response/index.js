const SuccessResponse = (contents) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      typeof contents === 'string' ? { message: contents } : contents
    ),
  };
};

const redirectResponse = ({ target, cookie }) => {
  if (target) {
    return {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        Location: target,
        ...(typeof cookie === 'object' && {
          'Access-Control-Expose-Headers': 'Set-Cookie',
          'Set-Cookie': Object.entries(cookie).map(
            ([key, value]) => `${key}=${value}; Path=/;`
          ),
        }),
      },
    };
  } else return null;
};

module.exports = {
  SuccessResponse,
  redirectResponse,
};
