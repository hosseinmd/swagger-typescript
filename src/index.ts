import { readFileSync, writeFileSync } from "fs";
import { format } from "prettier";
import {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
} from "./utils";
import { SwaggerSchemas, SwaggerRequest, SwaggerJson } from "./types";

function generate() {
  try {
    const input: SwaggerJson = JSON.parse(
      readFileSync("./swagger.json", "utf8"),
    ); // Input can be any JS object (OpenAPI format)
    //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)

    let code = "";

    Object.entries(input.paths).forEach(([endPoint, value]) => {
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          const pathParams = getPathParams(options.parameters);

          let queryParams = getQueryParams(options.parameters);

          //   let requestBody =
          //     options.requestBody.content["application/json"] ||
          //     options.requestBody.content["multipart/form-data"];

          code += `
/**
 * ${options.summary}
 */
export function ${method}${generateServiceName(endPoint)}(
    ${pathParams
      .map(
        ({ name, required, schema }) =>
          `${name}${required ? "" : "?"}: ${getTsType(schema)}`,
      )
      .join(",")}
      ${pathParams.length > 0 ? "," : ""}
      ${queryParams ? `queryParams:${queryParams}` : ""}
      
) {
    
}
`;
        },
      );
    });

    Object.entries(
      (input.components.schemas as unknown) as SwaggerSchemas,
    ).forEach(([name, { type, properties, enum: Enum }]) => {
      if (type === "object") {
        let typeObject = Object.entries(properties)
          .map(([pName, value]) => ({ ...value, name: pName }))
          .reduce((prev, schema) => {
            return `${prev}${schema.name}: ${getTsType(schema)},`;
          }, "{");

        typeObject = typeObject ? typeObject + "}" : "";

        code += `
export interface ${name}${typeObject}
        `;
      }
      if (Enum) {
        code += `
export enum ${name}{${Enum.map(
          (e) => `${e}=${typeof e === "string" ? `"${e}"` : ""}`,
        )}}
`;
      }
    });

    writeFileSync(
      "./services.ts",
      format(code, { parser: "jsdoc-parser" } as any),
    );
  } catch (error) {
    console.log({ error });
  }
}

export { generate };
