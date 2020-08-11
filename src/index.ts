import { readFileSync, writeFileSync } from "fs";
import { format } from "prettier";
import {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
} from "./utils";
import { SwaggerSchemas, SwaggerRequest, SwaggerJson, Schema } from "./types";
import { HTTP_REQUEST } from "./strings";

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
    const input: SwaggerJson = JSON.parse(
      readFileSync("./swagger.json", "utf8"),
    ); // Input can be any JS object (OpenAPI format)
    //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)

    Object.entries(input.paths).forEach(([endPoint, value]) => {
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          const pathParams = getPathParams(options.parameters);

          let queryParams = getQueryParams(options.parameters);

          let requestBody =
            options.requestBody?.content["application/json"] ||
            options.requestBody?.content["multipart/form-data"];

          let pathParamsRefString = pathParams.reduce(
            (prev, { name }) => `${prev}${name},`,
            "{",
          );
          pathParamsRefString = pathParamsRefString
            ? pathParamsRefString + "}"
            : "";

          code += `
/**
 * ${options.summary}
 */
export async function ${method}${generateServiceName(endPoint)}(
    ${pathParams
      .map(({ name, required, schema }) =>
        getDefineParam(name, required, schema),
      )
      .join(",")}
      ${pathParams.length > 0 ? "," : ""}
      ${queryParams ? `queryParams:${queryParams},` : ""}
      ${
        requestBody
          ? `${getDefineParam("requestBody", true, requestBody.schema)},`
          : ""
      }
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

    writeFileSync(
      "./httpRequest.ts",
      format(HTTP_REQUEST, { parser: "jsdoc-parser" } as any),
    );
  } catch (error) {
    console.log({ error });
  }
}

function getDefineParam(
  name: string,
  required: boolean = false,
  schema: Schema,
): string {
  return `${name}${required ? "" : "?"}: ${getTsType(schema)}`;
}

export { generate };
