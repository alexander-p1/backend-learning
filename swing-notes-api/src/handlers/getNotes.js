const { queryTable, createResponse, NOTES_TABLE } = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    console.log('Get notes event:', JSON.stringify(event));

    const username = event.pathParameters.username;

    if (!username) {
      return createResponse(400, {
        error: 'Username is required in path parameters'
      });
    }

    const params = {
      TableName: NOTES_TABLE,
      IndexName: 'username-index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      },
      ScanIndexForward: false // Sort by creation date descending
    };

    const result = await queryTable(params);

    return createResponse(200, {
      notes: result.Items || [],
      count: result.Count || 0
    });

  } catch (error) {
    console.error('Error getting notes:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: 'Could not retrieve notes'
    });
  }
};
