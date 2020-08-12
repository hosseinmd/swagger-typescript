import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

function getBaseUrl() {
  return "";
}

const axios = Axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Encoding": "UTF-8",
    Accept: "application/json",
    "Content-Type": "application/json-patch+json",
  },
});

const Http = {
  async getRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await axios.get(url, { params: queryParams, ...configOverride });
    } catch (error) {
      throwError(error);
    }
  },
  async postRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await axios.post(url, requestBody, {
        params: queryParams,
        ...configOverride,
      });
    } catch (error) {
      throwError(error);
    }
  },
  async putRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await axios.put(url, requestBody, {
        params: queryParams,
        ...configOverride,
      });
    } catch (error) {
      throwError(error);
    }
  },
  async deleteRequest(
    url: string,
    queryParams: any | undefined,
    requestBody: any | undefined,
    configOverride?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    try {
      return await axios.get(url, { params: queryParams, ...configOverride });
    } catch (error) {
      throwError(error);
    }
  },
};

interface ErrorParam {
  message: string;
  status?: number;
  response?: string;
}

class Exception extends Error {
  message: string;
  status?: number;
  response?: string;

  constructor({ message, status, response }: ErrorParam) {
    super();
    this.message = message;
    this.status = status;
    this.response = response;
  }

  isApiException = true;
}

function throwError(error) {
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

export { Http, Exception };
