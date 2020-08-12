// AUTO_GENERATED Do not change this file directly change config.ts file instead
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getBaseConfig, errorCatch } from "./config";

const Http = {
  async getRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.get(
        url,
        overrideConfig(getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        })
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.post(
        url,
        requestBody,
        overrideConfig(getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        })
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.put(
        url,
        requestBody,
        overrideConfig(getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        })
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
  async deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    try {
      return await Axios.get(
        url,
        overrideConfig(getBaseConfig(), {
          params: queryParams,
          ...configOverride,
        })
      );
    } catch (error) {
      return errorCatch(error);
    }
  },
};

function overrideConfig(
  config: AxiosRequestConfig,
  configOverride: AxiosRequestConfig
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
