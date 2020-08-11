import { AxiosRequestConfig, AxiosResponse } from "axios";

const Http = {
  getRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {},
  postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {},
  putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {},
  deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {},
};

export { Http };
