"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs_1 = require("fs");
const prettier_1 = require("prettier");
const utils_1 = require("./utils");
const strings_1 = require("./strings");
function generate() {
    let code = strings_1.SERVICE_BEGINNING;
    try {
        const input = JSON.parse(fs_1.readFileSync("./swagger.json", "utf8")); // Input can be any JS object (OpenAPI format)
        //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)
        Object.entries(input.paths).forEach(([endPoint, value]) => {
            Object.entries(value).forEach(([method, options]) => {
                const pathParams = utils_1.getPathParams(options.parameters);
                let queryParams = utils_1.getQueryParams(options.parameters);
                let requestBody = getBodyContent(options.requestBody);
                let responses = getBodyContent(options.responses);
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
                    ? `${getDefineParam("requestBody", true, requestBody)},`
                    : ""}
      configOverride:AxiosRequestConfig
      
)${responses && `:${utils_1.getTsType(responses)}`} {
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
function getBodyContent(responses) {
    if (!responses) {
        return responses;
    }
    return Object.values(responses[200].content)[0].schema;
}
function getDefineParam(name, required = false, schema) {
    return `${name}${required ? "" : "?"}: ${utils_1.getTsType(schema)}`;
}
//# sourceMappingURL=index.js.map