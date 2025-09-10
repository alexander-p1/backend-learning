const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

exports.handler = async (event) => {
  try {
    console.log('Authorizer event:', JSON.stringify(event));
    
    const token = event.authorizationToken;
    const methodArn = event.methodArn;
    
    if (!token) {
      throw new Error('Unauthorized');
    }

    // Remove 'Bearer ' prefix if present
    const apiKey = token.replace('Bearer ', '');
    const expectedApiKey = process.env.API_KEY;

    if (apiKey === expectedApiKey) {
      return generatePolicy('user', 'Allow', methodArn);
    } else {
      throw new Error('Unauthorized');
    }
  } catch (error) {
    console.error('Authorization failed:', error.message);
    throw new Error('Unauthorized');
  }
};
