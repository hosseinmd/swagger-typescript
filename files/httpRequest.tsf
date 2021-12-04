/**
 * AUTO_GENERATED Do not change this file directly, use config.ts file instead
 *
 * @version 5
 */
import axios, { AxiosRequestConfig, CancelToken } from "axios";
import { getAxiosInstance, Security, SwaggerResponse } from "./config";

/**
 * Cancellation handled here, you can cancel request by call promise.cancel()
 *
 * @example
 *   const promise = getUsers();
 *   setTimeout(() => promise.cancel(), 30000);
 *   const { data } = await promise;
 *
 * @param getPromise
 * @returns
 */
function cancellation<T>(
  getPromise: (cancelToken: CancelToken) => Promise<T>,
): Promise<T> {
  const source = axios.CancelToken.source();
  const promise = getPromise(source.token);
  //@ts-ignore
  promise.cancel = () => {
    source.cancel("request canceled");
  };

  return promise;
}

export const Http = {
  getRequest(
    url: string,
    queryParams: any | undefined,
    //@ts-ignore
    _requestBody: undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).get(url, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).post(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).put(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  patchRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).patch(url, requestBody, {
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
  deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    security: Security,
    configOverride?: AxiosRequestConfig,
  ): Promise<SwaggerResponse<any>> {
    return cancellation((cancelToken) =>
      getAxiosInstance(security).delete(url, {
        data: requestBody,
        cancelToken,
        params: queryParams,
        ...configOverride,
      }),
    );
  },
};
