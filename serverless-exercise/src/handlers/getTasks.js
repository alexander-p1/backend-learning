import { dynamodb, TASKS_TABLE, headers } from ('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const params = {
      TableName: TASKS_TABLE
    };

    const result = await dynamodb.scan(params).promise();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        tasks: result.Items,
        count: result.Count
      })
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Kunde inte hämta tasks',
        message: error.message
      })
    };
  }
};