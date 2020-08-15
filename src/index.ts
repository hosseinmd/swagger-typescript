import { writeFileSync, existsSync, mkdirSync } from "fs";
import { format } from "prettier";
import {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
  getHeaderParams,
} from "./utils";
import {
  SwaggerSchemas,
  SwaggerRequest,
  SwaggerJson,
  Schema,
  SwaggerResponse,
} from "./types";
import { HTTP_REQUEST, SERVICE_BEGINNING, CONFIG } from "./strings";
import { getSwaggerJson } from "./getJson";

function getParam(name: string): string {
  name += "=";
  const index = process.argv.findIndex((v) => v.startsWith(name));

  return process.argv[index].substring(name.length);
}

async function generate() {
  let code = SERVICE_BEGINNING;
  const url = getParam("url");
  const dir = getParam("dir") || ".";

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  try {
    const input: SwaggerJson = await getSwaggerJson(url);
    // JSON.parse(
    //   readFileSync("./swagger.json", "utf8"),
    // ); // Input can be any JS object (OpenAPI format)
    //   const output = swaggerToTS(input); // Outputs TypeScript defs as a string (to be parsed, or written to a file)

    Object.entries(input.paths).forEach(([endPoint, value]) => {
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          const pathParams = getPathParams(options.parameters);
          let { params: queryParams, hasNullable } = getQueryParams(
            options.parameters,
          );

          let {
            params: headerParams,
            hasNullable: hasNullableHeaderParams,
          } = getHeaderParams(options.parameters);

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
          ? `${getParamString("queryParams", !hasNullable, queryParams)},`
          : ""
      }
      ${
        requestBody
          ? `${getDefineParam("requestBody", true, requestBody)},`
          : ""
      }
      ${
        headerParams
          ? `${getParamString(
              "headerParams",
              !hasNullableHeaderParams,
              headerParams,
            )},`
          : ""
      }
      configOverride?:AxiosRequestConfig
      
): Promise<SwaggerResponse<${responses ? getTsType(responses) : "any"}>> {

    return await responseWrapper(await Http.${method}Request(
      template("${endPoint}",${pathParamsRefString}),
      ${queryParams ? "queryParams" : "undefined"},
      ${requestBody ? "requestBody" : "undefined"},
      overrideConfig({
          headers: {
            "Content-Type": "${contentType}",
            Accept: "${accept}",
            ${headerParams ? "...headerParams," : ""}
          },
        },
        configOverride,
      )
    ))
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
      `${dir}/services.ts`,
      format(code, { parser: "jsdoc-parser" } as any),
    );

    writeFileSync(
      `${dir}/httpRequest.ts`,
      format(HTTP_REQUEST, { parser: "jsdoc-parser" } as any),
    );

    if (!existsSync(`${dir}/config.ts`)) {
      writeFileSync(
        `${dir}/config.ts`,
        format(CONFIG, { parser: "jsdoc-parser" } as any),
      );
    }
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
  return getParamString(name, required, getTsType(schema));
}

function getParamString(
  name: string,
  required: boolean = false,
  type: any,
): string {
  return `${name}${required ? "" : "?"}: ${type}`;
}

generate();

export { generate };
