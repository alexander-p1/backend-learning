import { dynamodb, TASKS_TABLE, headers } from ('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const updates = JSON.parse(event.body);

    // Kolla om task existerar först
    const getParams = {
      TableName: TASKS_TABLE,
      Key: { id }
    };

    const existingTask = await dynamodb.get(getParams).promise();
    
    if (!existingTask.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Task hittades inte'
        })
      };
    }

    // Bygg update expression
    let updateExpression = 'SET updatedAt = :updatedAt';
    let expressionAttributeValues = {
      ':updatedAt': new Date().toISOString()
    };

    if (updates.title !== undefined) {
      updateExpression += ', title = :title';
      expressionAttributeValues[':title'] = updates.title;
    }

    if (updates.description !== undefined) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = updates.description;
    }

    if (updates.completed !== undefined) {
      updateExpression += ', completed = :completed';
      expressionAttributeValues[':completed'] = updates.completed;
    }

    const params = {
      TableName: TASKS_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Kunde inte uppdatera task',
        message: error.message
      })
    };
  }
};