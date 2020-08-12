import { readFileSync, writeFileSync } from "fs";
import { format } from "prettier";
import {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
} from "./utils";
import {
  SwaggerSchemas,
  SwaggerRequest,
  SwaggerJson,
  Schema,
  SwaggerResponse,
} from "./types";
import { HTTP_REQUEST, SERVICE_BEGINNING } from "./strings";

function generate() {
  let code = SERVICE_BEGINNING;

  try {
    const input: SwaggerJson = JSON.parse(
      readFileSync("./swagger.json", "utf8"),
    ); // Input can be any JS object (OpenAPI format)
    //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)

    Object.entries(input.paths).forEach(([endPoint, value]) => {
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          const pathParams = getPathParams(options.parameters);

          let { queryParams, hasNullable } = getQueryParams(options.parameters);

          let requestBody = getBodyContent(options.requestBody);

          let contentType = Object.keys(
            options.requestBody?.content || {
              "application/json": null,
            },
          )[0];

          let accept = Object.keys(
            options.responses?.[200].content || {
              "application/json": null,
            },
          )[0];

          let responses = getBodyContent(options.responses?.[200]);

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
      ${
        queryParams
          ? `queryParams${hasNullable ? "?" : ""}:${queryParams},`
          : ""
      }
      ${
        requestBody
          ? `${getDefineParam("requestBody", true, requestBody)},`
          : ""
      }
      configOverride?:AxiosRequestConfig
      
): Promise<AxiosResponse<${responses ? getTsType(responses) : "any"}>> {

    return await Http.${method}Request(
      template("${endPoint}",${pathParamsRefString}),
      ${queryParams ? "queryParams" : "undefined"},
      ${requestBody ? "requestBody" : "undefined"},
      {
        ...configOverride,
        headers: {
          ...configOverride?.headers,
          "Content-Type": "${contentType}",
          Accept: "${accept}",
        },
      },
    )
}
`;
        },
      );
    });

    Object.entries(
      (input.components.schemas as unknown) as SwaggerSchemas,
    ).forEach(([name, schema]) => {
      const { type, enum: Enum, allOf } = schema;
      if (type === "object") {
        let typeObject = getTsType(schema);

        code += `
export interface ${name} ${typeObject}
        `;
      }
      if (Enum) {
        code += `
export enum ${name} {${Enum.map(
          (e) => `${e}=${typeof e === "string" ? `"${e}"` : ""}`,
        )}}
`;
      }

      if (allOf) {
        code += `
        export interface ${name} extends ${allOf
          .map((_schema) => getTsType(_schema))
          .join(" ")}
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

function getBodyContent(responses?: SwaggerResponse) {
  if (!responses) {
    return responses;
  }

  return Object.values(responses.content)[0].schema;
}

function getDefineParam(
  name: string,
  required: boolean = false,
  schema: Schema,
): string {
  return `${name}${required ? "" : "?"}: ${getTsType(schema)}`;
}

export { generate };
