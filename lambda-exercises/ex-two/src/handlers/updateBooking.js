// src/handlers/updateBooking.js
import { ddbDocClient } from "../../dbClient.js";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
  try {
    // Get booking ID from URL
    const bookingId = event.pathParameters?.id;
    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing booking ID" }),
      };
    }

    // Get data to update'
    const updates = JSON.parse(event.body || "{}");

    // Check if we have something to update
    if (Object.keys(updates).length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No data to update" }),
      };
    }

    // Add timestamp for when it was updated
    updates.updatedAt = new Date().toISOString();

    // Update the booking in database
    const result = await ddbDocClient.send(
      new UpdateCommand({
        TableName: process.env.BOOKINGS_TABLE,
        Key: { bookingId: bookingId },
        UpdateExpression: `SET ${Object.keys(updates)
          .map((key) => `#${key} = :${key}`)
          .join(", ")}`,
        ExpressionAttributeNames: Object.fromEntries(
          Object.keys(updates).map((key) => [`#${key}`, key])
        ),
        ExpressionAttributeValues: Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [`:${key}`, value])
        ),
        ReturnValues: "ALL_NEW",
      })
    );

    // Return the updated booking
    return {
      statusCode: 200,
      body: JSON.stringify({ booking: result.Attributes }),
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update booking" }),
    };
  }
};
