import {
  Method,
  SwaggerConfig,
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
    response: SwaggerResponse["content"];
  };
};

export const extractResponses = (
  input: SwaggerJson,
  config: SwaggerConfig,
): ResponsesType => {
  const ret: ResponsesType = {};
  Object.entries(input.paths).forEach(([path, value]) => {
    Object.entries(value).forEach(
      ([method, options]: [string, SwaggerRequest]) => {
        const { operationId, responses } = options;
        Object.keys(responses).forEach((statusCode: string) => {
          const response = responses[statusCode];
          const { content } = response;
          const key =
            generateServiceName(path, method, operationId, config) +
            `_${statusCode}`;

          ret[key] = {
            method: method as Method,
            path,
            response: content,
          };
        });
      },
    );
  });
  return ret;
};
