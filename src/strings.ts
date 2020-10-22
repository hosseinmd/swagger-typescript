import { readFileSync } from "fs";
import path from "path";
const HTTP_REQUEST = readFileSync(
  path.resolve(__dirname, "../files/httpRequest.tsf"),
).toString();

const CONFIG = readFileSync(
  path.resolve(__dirname, "../files/config.tsf"),
).toString();

const APIS_BEGINNING = `// APIS grouped by tags of OAS
`;

const SERVICE_BEGINNING = `
// AUTO_GENERATED Do not change this file directly change config.ts file instead
import { AxiosRequestConfig } from "axios";
import { SwaggerResponse, responseWrapper } from "./config";
import { Http, overrideConfig } from "./httpRequest";

//@ts-ignore
const __DEV__ = process.env.NODE_ENV !== "production";

function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      const re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });

    return path;
}
`;

const DEPRECATED_WARM_MESSAGE =
  "This endpoint deprecated and will be remove. Please use an alternative";

export { HTTP_REQUEST, SERVICE_BEGINNING, CONFIG, DEPRECATED_WARM_MESSAGE, APIS_BEGINNING };
