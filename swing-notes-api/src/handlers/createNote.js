const { v4: uuidv4 } = require('uuid');
const { putItem, createResponse, validateNote, NOTES_TABLE } = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    console.log('Create note event:', JSON.stringify(event));

    const username = event.pathParameters.username;
    
    if (!username) {
      return createResponse(400, {
        error: 'Username is required in path parameters'
      });
    }

    let noteData;
    try {
      noteData = JSON.parse(event.body);
    } catch (parseError) {
      return createResponse(400, {
        error: 'Invalid JSON in request body'
      });
    }

    // Add username to note data
    noteData.username = username;

    // Validate note data
    const validationErrors = validateNote(noteData);
    if (validationErrors.length > 0) {
      return createResponse(400, {
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const now = new Date().toISOString();
    const note = {
      id: uuidv4(),
      username: username,
      title: noteData.title.trim(),
      text: noteData.text.trim(),
      createdAt: now,
      modifiedAt: now
    };

    const params = {
      TableName: NOTES_TABLE,
      Item: note
    };

    await putItem(params);

    return createResponse(200, {
      message: 'Note created successfully',
      note: note
    });

  } catch (error) {
    console.error('Error creating note:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: 'Could not create note'
    });
  }
};
