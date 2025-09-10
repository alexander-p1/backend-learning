const { getItem, deleteItem, createResponse, NOTES_TABLE } = require('../utils/dynamodb');

exports.handler = async (event) => {
  try {
    console.log('Delete note event:', JSON.stringify(event));

    const noteId = event.pathParameters.id;
    
    if (!noteId) {
      return createResponse(400, {
        error: 'Note ID is required in path parameters'
      });
    }

    // Check if note exists before deleting
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

    // Delete the note
    const deleteParams = {
      TableName: NOTES_TABLE,
      Key: { id: noteId }
    };

    await deleteItem(deleteParams);

    return createResponse(200, {
      message: 'Note deleted successfully',
      deletedNote: existingNote.Item
    });

  } catch (error) {
    console.error('Error deleting note:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: 'Could not delete note'
    });
  }
};
