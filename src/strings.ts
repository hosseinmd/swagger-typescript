const HTTP_REQUEST = `
// AUTO_GENERATED Do not change this file directly change config.ts file instead
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getBaseConfig, errorCatch } from "./config";

const Http = {
  async getRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.get(
        url,
        overrideConfig(await getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        }),
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.post(
        url,
        requestBody,
        overrideConfig(await getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        }),
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.put(
        url,
        requestBody,
        overrideConfig(await getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        }),
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.get(
        url,
        overrideConfig(await getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        }),
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
};

function overrideConfig(
  config?: AxiosRequestConfig,
  configOverride?: AxiosRequestConfig,
): AxiosRequestConfig {
  return {
    ...config,
    ...configOverride,
    headers: {
      ...config?.headers,
      ...configOverride?.headers,
    },
  };
}

export { Http, overrideConfig };
`;

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
