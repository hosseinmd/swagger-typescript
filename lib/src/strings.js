"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_BEGINNING = exports.HTTP_REQUEST = void 0;
const HTTP_REQUEST = `
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
        overrideConfig(getBaseConfig(), {
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
        overrideConfig(getBaseConfig(), {
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
        overrideConfig(getBaseConfig(), {
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
        overrideConfig(getBaseConfig(), {
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
  config: AxiosRequestConfig,
  configOverride: AxiosRequestConfig,
): AxiosRequestConfig {
  return {
    ...config,
    ...configOverride,
    headers: {
      ...config.headers,
      ...configOverride.headers,
    },
  };
}

export { Http, overrideConfig };
`;
exports.HTTP_REQUEST = HTTP_REQUEST;
const SERVICE_BEGINNING = `
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Http, overrideConfig } from "./httpRequest";

function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      let re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });
  
    return path;
}
`;
exports.SERVICE_BEGINNING = SERVICE_BEGINNING;
//# sourceMappingURL=strings.js.map