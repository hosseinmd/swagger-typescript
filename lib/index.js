"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs_1 = require("fs");
const prettier_1 = require("prettier");
const utils_1 = require("./utils");
const strings_1 = require("./strings");
function generate() {
    let code = `
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
    try {
        const input = JSON.parse(fs_1.readFileSync("./swagger.json", "utf8")); // Input can be any JS object (OpenAPI format)
        //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)
        Object.entries(input.paths).forEach(([endPoint, value]) => {
            Object.entries(value).forEach(([method, options]) => {
                var _a, _b;
                const pathParams = utils_1.getPathParams(options.parameters);
                let queryParams = utils_1.getQueryParams(options.parameters);
                let requestBody = ((_a = options.requestBody) === null || _a === void 0 ? void 0 : _a.content["application/json"]) || ((_b = options.requestBody) === null || _b === void 0 ? void 0 : _b.content["multipart/form-data"]);
                let pathParamsRefString = pathParams.reduce((prev, { name }) => `${prev}${name},`, "{");
                pathParamsRefString = pathParamsRefString
                    ? pathParamsRefString + "}"
                    : "";
                code += `
/**
 * ${options.summary}
 */
export async function ${method}${utils_1.generateServiceName(endPoint)}(
    ${pathParams
                    .map(({ name, required, schema }) => getDefineParam(name, required, schema))
                    .join(",")}
      ${pathParams.length > 0 ? "," : ""}
      ${queryParams ? `queryParams:${queryParams},` : ""}
      ${requestBody
                    ? `${getDefineParam("requestBody", true, requestBody.schema)},`
                    : ""}
      configOverride:AxiosRequestConfig
      
) {
    return await Http.${method}Request(
      template("${endPoint}",${pathParamsRefString}),
      ${queryParams ? "queryParams" : "undefined"},
      ${requestBody ? "requestBody" : "undefined"},
      configOverride,
    )
}
`;
            });
        });
        Object.entries(input.components.schemas).forEach(([name, { type, properties, enum: Enum }]) => {
            if (type === "object") {
                let typeObject = Object.entries(properties)
                    .map(([pName, value]) => (Object.assign(Object.assign({}, value), { name: pName })))
                    .reduce((prev, schema) => {
                    return `${prev}${schema.name}: ${utils_1.getTsType(schema)},`;
                }, "{");
                typeObject = typeObject ? typeObject + "}" : "";
                code += `
export interface ${name}${typeObject}
        `;
            }
            if (Enum) {
                code += `
export enum ${name}{${Enum.map((e) => `${e}=${typeof e === "string" ? `"${e}"` : ""}`)}}
`;
            }
        });
        fs_1.writeFileSync("./services.ts", prettier_1.format(code, { parser: "jsdoc-parser" }));
        fs_1.writeFileSync("./httpRequest.ts", prettier_1.format(strings_1.HTTP_REQUEST, { parser: "jsdoc-parser" }));
    }
    catch (error) {
        console.log({ error });
    }
}
exports.generate = generate;
function getDefineParam(name, required = false, schema) {
    return `${name}${required ? "" : "?"}: ${utils_1.getTsType(schema)}`;
}
//# sourceMappingURL=index.js.map