const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const NOTES_TABLE = process.env.NOTES_TABLE;

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

const validateNote = (note) => {
  const errors = [];

  if (!note.title || typeof note.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (note.title.length > 50) {
    errors.push('Title must be 50 characters or less');
  }

  if (!note.text || typeof note.text !== 'string') {
    errors.push('Text is required and must be a string');
  } else if (note.text.length > 300) {
    errors.push('Text must be 300 characters or less');
  }

  if (!note.username || typeof note.username !== 'string') {
    errors.push('Username is required and must be a string');
  }

  return errors;
};

const scanTable = async (params) => {
  try {
    return await dynamoDb.scan(params).promise();
  } catch (error) {
    console.error('DynamoDB scan error:', error);
    throw error;
  }
};

const queryTable = async (params) => {
  try {
    return await dynamoDb.query(params).promise();
  } catch (error) {
    console.error('DynamoDB query error:', error);
    throw error;
  }
};

const getItem = async (params) => {
  try {
    return await dynamoDb.get(params).promise();
  } catch (error) {
    console.error('DynamoDB get error:', error);
    throw error;
  }
};

const putItem = async (params) => {
  try {
    return await dynamoDb.put(params).promise();
  } catch (error) {
    console.error('DynamoDB put error:', error);
    throw error;
  }
};

const updateItem = async (params) => {
  try {
    return await dynamoDb.update(params).promise();
  } catch (error) {
    console.error('DynamoDB update error:', error);
    throw error;
  }
};

const deleteItem = async (params) => {
  try {
    return await dynamoDb.delete(params).promise();
  } catch (error) {
    console.error('DynamoDB delete error:', error);
    throw error;
  }
};

module.exports = {
  NOTES_TABLE,
  createResponse,
  validateNote,
  scanTable,
  queryTable,
  getItem,
  putItem,
  updateItem,
  deleteItem
};
