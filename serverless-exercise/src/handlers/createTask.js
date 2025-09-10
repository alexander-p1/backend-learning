import { dynamodb, TASKS_TABLE, headers } from ('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);
    
    if (!title) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Title är obligatorisk'
        })
      };
    }

    const task = {
      id: uuidv4(),
      title,
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TASKS_TABLE,
      Item: task
    };

    await dynamodb.put(params).promise();
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(task)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Kunde inte skapa task',
        message: error.message
      })
    };
  }
};