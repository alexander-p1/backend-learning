import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({
  region: "eu-north-1",
});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { title, content } = JSON.parse(event.body);

    const note = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
    );

    const orderedNote = {
      title: note.title,
      content: note.content,
      id: note.id,
      createdAt: note.createdAt,
    };

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(orderedNote),
    };
  } catch (error) {
    console.error("Error creating note", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Couldn't create note" }),
    };
  }
};
