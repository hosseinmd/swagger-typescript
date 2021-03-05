import { OpenAPIObject, PathItemObject } from "openapi3-ts";

export const APPLICATION_JSON = "application/json";

export type ResponsesType = {
  [path: string]: {
    [APPLICATION_JSON]: { schema: any };
  };
};

export const extractResponses = (obj: OpenAPIObject): ResponsesType => {
  const ret: any = {};
  Object.keys(obj.paths).forEach((path) => {
    const methods: PathItemObject = obj.paths[path];
    Object.keys(methods).forEach((method: string) => {
      const api = methods[method];
      const { responses } = api;
      Object.keys(responses).forEach((statusCode: string) => {
        const response = responses[statusCode];
        const { content } = response;
        const key = `${path}_${method}_${statusCode}`;
        ret[key] = content;
      });
    });
  });
  return ret;
};
