// Please add your custom config
import { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

function getBaseConfig(): AxiosRequestConfig {
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
