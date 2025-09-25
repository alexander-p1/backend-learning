import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import { createAccountSchema } from "../middlewares/schemas/index.js";
import httpErrorHandler from "@middy/http-error-handler";

const lambdaHandler = (event) => {
  const account = event.body; // { username, email, password }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, account }),
  };
};

export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(createAccountSchema) }))
  .use(httpErrorHandler())
  .handler(lambdaHandler);
