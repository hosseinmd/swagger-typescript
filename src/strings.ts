import { readFileSync } from "fs";
import path from "path";
const HTTP_REQUEST = readFileSync(
  path.resolve(__dirname, "./files/httpRequest.tsf"),
);

const SERVICE_BEGINNING = `
// AUTO_GENERATED Do not change this file directly change config.ts file instead
import { AxiosRequestConfig } from "axios";
import { SwaggerResponse, responseWrapper } from "./config";
import { Http, overrideConfig } from "./httpRequest";

function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      let re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });
  
    return path;
}
`;

const CONFIG = `
// Please add your custom config
import { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

async function getBaseConfig(): Promise<AxiosRequestConfig> {
  return {
    baseURL: "",
    headers: {
      "Content-Encoding": "UTF-8",
      Accept: "application/json",
      "Content-Type": "application/json-patch+json",
    },
  };
}

function errorCatch(error: AxiosError): any {
  if (error.response) {
    throw new Exception({
      message: error.response.data,
      status: error.response.status,
      response: error.response,
    });
  }

  if (error.isAxiosError) {
    throw new Exception({
      message: "noInternetConnection",
    });
  }

  throw error;
}

interface ErrorParam {
  message: string;
  status?: number;
  response?: AxiosResponse;
}

class Exception extends Error {
  message: string;
  status?: number;
  response?: AxiosResponse;

  constructor({ message, status, response }: ErrorParam) {
    super();
    this.message = message;
    this.status = status;
    this.response = response;
  }

  isApiException = true;
}

// export type SwaggerResponse<R> = R;

export interface SwaggerResponse<R> extends AxiosResponse<R> {}

async function responseWrapper(
  response: AxiosResponse<any>,
): Promise<SwaggerResponse<any>> {
  return response;
}

export { getBaseConfig, errorCatch, Exception, responseWrapper };
`;

export { HTTP_REQUEST, SERVICE_BEGINNING, CONFIG };
