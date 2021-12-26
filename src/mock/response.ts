import {
  Method,
  Config,
  SwaggerJson,
  SwaggerRequest,
  SwaggerResponse,
} from "../types";
import { generateServiceName } from "../utils";

export const APPLICATION_JSON = "application/json";

export type ResponsesType = {
  [path: string]: {
    path: string;
    method: Method;
    response: {
      [status: string]: SwaggerResponse["content"];
    };
  };
};

export const extractResponses = (
  input: SwaggerJson,
  config: Config,
): ResponsesType => {
  const ret: ResponsesType = {};
  Object.entries(input.paths).forEach(([path, value]) => {
    Object.entries(value).forEach(
      ([method, options]: [string, SwaggerRequest]) => {
        const { operationId, responses } = options;
        const response: { [x: string]: any } = {};
        Object.keys(responses).forEach((statusCode: string) => {
          const { content } = responses[statusCode];
          response[statusCode] = content;
        });
        const key = generateServiceName(path, method, operationId, config);

        ret[key] = {
          method: method as Method,
          path,
          response,
        };
      },
    );
  });
  return ret;
};
