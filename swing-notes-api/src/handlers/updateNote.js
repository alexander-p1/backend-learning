const { getItem, updateItem, createResponse, NOTES_TABLE } = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    console.log('Update note event:', JSON.stringify(event));

    const noteId = event.pathParameters.id;
    
    if (!noteId) {
      return createResponse(400, {
        error: 'Note ID is required in path parameters'
      });
    }

    let updateData;
    try {
      updateData = JSON.parse(event.body);
    } catch (parseError) {
      return createResponse(400, {
        error: 'Invalid JSON in request body'
      });
    }

    // Check if note exists
    const getParams = {
      TableName: NOTES_TABLE,
      Key: { id: noteId }
    };

    const existingNote = await getItem(getParams);
    
    if (!existingNote.Item) {
      return createResponse(404, {
        error: 'Note not found'
      });
    }

    // Validate update data
    const errors = [];
    
    if (updateData.title !== undefined) {
      if (typeof updateData.title !== 'string') {
        errors.push('Title must be a string');
      } else if (updateData.title.length > 50) {
        errors.push('Title must be 50 characters or less');
      } else if (updateData.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      }
    }

    if (updateData.text !== undefined) {
      if (typeof updateData.text !== 'string') {
        errors.push('Text must be a string');
      } else if (updateData.text.length > 300) {
        errors.push('Text must be 300 characters or less');
      } else if (updateData.text.trim().length === 0) {
        errors.push('Text cannot be empty');
      }
    }

    if (errors.length > 0) {
      return createResponse(400, {
        error: 'Validation failed',
        details: errors
      });
    }

    // Build update expression
    let updateExpression = 'SET modifiedAt = :modifiedAt';
    const expressionAttributeValues = {
      ':modifiedAt': new Date().toISOString()
    };

    if (updateData.title !== undefined) {
      updateExpression += ', title = :title';
      expressionAttributeValues[':title'] = updateData.title.trim();
    }

    if (updateData.text !== undefined) {
      updateExpression += ', #text = :text';
      expressionAttributeValues[':text'] = updateData.text.trim();
    }

    const updateParams = {
      TableName: NOTES_TABLE,
      Key: { id: noteId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    // Add ExpressionAttributeNames if we're updating text (reserved word)
    if (updateData.text !== undefined) {
      updateParams.ExpressionAttributeNames = {
        '#text': 'text'
      };
    }

    const result = await updateItem(updateParams);

    return createResponse(200, {
      message: 'Note updated successfully',
      note: result.Attributes
    });

  } catch (error) {
    console.error('Error updating note:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: 'Could not update note'
    });
  }
};
