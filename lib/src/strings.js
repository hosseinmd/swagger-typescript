"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_BEGINNING = exports.HTTP_REQUEST = void 0;
const HTTP_REQUEST = `
import { AxiosRequestConfig} from "axios";
  
const Http={
    getRequest(url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride:AxiosRequestConfig){

    },
    postRequest(url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride:AxiosRequestConfig){
        
    },
    putRequest(url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride:AxiosRequestConfig){
        
    },
    deleteRequest(url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride:AxiosRequestConfig){
        
    },
}

export {Http}
`;
exports.HTTP_REQUEST = HTTP_REQUEST;
const SERVICE_BEGINNING = `
import { AxiosRequestConfig} from "axios";
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