"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_BEGINNING = exports.HTTP_REQUEST = void 0;
const REQUEST_PARAMS = "url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride?:AxiosRequestConfig";
const REQUEST_RESPONSE = "Promise<AxiosResponse<any>>";
const HTTP_REQUEST = `
import Axios,{ AxiosRequestConfig, AxiosResponse } from "axios";
  
function getBaseUrl(){
  return ''
}

const axios = Axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Encoding': 'UTF-8',
    Accept: 'application/json',
    'Content-Type': 'application/json-patch+json',
  },
});

const Http={
    async getRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
      try {
        return await axios.get(url, {params:queryParams,...configOverride});
      } catch (error) {
        throwError(error);
      }
    },
    async postRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
      try {
        return await axios.post(url, requestBody, {params:queryParams,...configOverride});
      } catch (error) {
        throwError(error);
      }
    },
    async putRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
      try {
        return await axios.put(url, requestBody, {params:queryParams,...configOverride});
      } catch (error) {
        throwError(error);
      }
    },
    async deleteRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
      try {
        return await axios.get(url, {params:queryParams,...configOverride});
      } catch (error) {
        throwError(error);
      }
    },
}

interface ErrorParam {
  message: string;
  status?: number;
  response?: string;
}

 class Exception extends Error {
  message: string;
  status?: number;
  response?: string;

  constructor({message, status, response}: ErrorParam) {
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
      response:error.response,
    });
  }

  if (error.isAxiosError) {
    throw new Exception({
      message: 'noInternetConnection',
    });
  }

  throw error;
}


export {Http,Exception}
`;
exports.HTTP_REQUEST = HTTP_REQUEST;
const SERVICE_BEGINNING = `
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Http } from "./httpRequest";

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