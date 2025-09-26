import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({
  region: "eu-north-1",
});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Couldn't fetch any notes" }),
    };
  }
};
