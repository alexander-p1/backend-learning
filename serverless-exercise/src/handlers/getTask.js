import { dynamodb, TASKS_TABLE, headers } from ('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: TASKS_TABLE,
      Key: { id }
    };

    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Task hittades inte'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Kunde inte hämta task',
        message: error.message
      })
    };
  }
};