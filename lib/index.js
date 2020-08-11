"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs_1 = require("fs");
const prettier_1 = require("prettier");
const utils_1 = require("./utils");
function generate() {
    try {
        const input = JSON.parse(fs_1.readFileSync("./swagger.json", "utf8")); // Input can be any JS object (OpenAPI format)
        //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)
        let code = "";
        Object.entries(input.paths).forEach(([endPoint, value]) => {
            Object.entries(value).forEach(([method, options]) => {
                const pathParams = utils_1.getPathParams(options.parameters);
                let queryParams = utils_1.getQueryParams(options.parameters);
                //   let requestBody =
                //     options.requestBody.content["application/json"] ||
                //     options.requestBody.content["multipart/form-data"];
                code += `
/**
 * ${options.summary}
 */
export function ${method}${utils_1.generateServiceName(endPoint)}(
    ${pathParams
                    .map(({ name, required, schema }) => `${name}${required ? "" : "?"}: ${utils_1.getTsType(schema)}`)
                    .join(",")}
      ${pathParams.length > 0 ? "," : ""}
      ${queryParams ? `queryParams:${queryParams}` : ""}
      
) {
    
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
    }
    catch (error) {
        console.log({ error });
    }
}
exports.generate = generate;
//# sourceMappingURL=index.js.map