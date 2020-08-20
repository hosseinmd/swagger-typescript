import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
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
  SwaggerConfig,
} from "./types";
import {
  HTTP_REQUEST,
  SERVICE_BEGINNING,
  CONFIG,
  DEPRECATED_WARM_MESSAGE,
} from "./strings";
import { getSwaggerJson } from "./getJson";

function getParam(name: string): string {
  name += "=";
  const index = process.argv.findIndex((v) => v.startsWith(name));

  return process.argv[index]?.substring(name.length);
}

async function generate() {
  let code = SERVICE_BEGINNING;
  const configUrl = getParam("config") || "./swaggerConfig.json";
  let config: SwaggerConfig;

  try {
    config = JSON.parse(readFileSync(configUrl).toString());

    if (!config) {
      throw "";
    }
  } catch (error) {
    console.log(error);
    throw new Error("Please define swaggerConfig.json");
  }

  const { url, dir, prettierPath } = config;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  let prettierOptions;

  if (prettierPath && existsSync(prettierPath)) {
    prettierOptions = JSON.parse(readFileSync(prettierPath).toString());
  } else {
    if (existsSync(".prettierrc")) {
      prettierOptions = JSON.parse(readFileSync(".prettierrc").toString());
    } else {
      prettierOptions = JSON.parse(readFileSync("prettier.json").toString());
    }
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
          const serviceName = `${method}${generateServiceName(endPoint)}`;
          const pathParams = getPathParams(options.parameters);
          const { params: queryParams, hasNullable } = getQueryParams(
            options.parameters,
          );

          const {
            params: headerParams,
            hasNullable: hasNullableHeaderParams,
          } = getHeaderParams(options.parameters, config);

          const requestBody = getBodyContent(options.requestBody);

          const contentType = Object.keys(
            options.requestBody?.content || {
              "application/json": null,
            },
          )[0];

          const accept = Object.keys(
            options.responses?.[200].content || {
              "application/json": null,
            },
          )[0];

          const responses = getBodyContent(options.responses?.[200]);

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
 ${options.deprecated ? `* @deprecated ${DEPRECATED_WARM_MESSAGE}` : ""}
 */
export const ${serviceName}${options.deprecated ? ": any" : ""} = async (
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
    ${requestBody ? `${getDefineParam("requestBody", true, requestBody)},` : ""}
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
): Promise<SwaggerResponse<${responses ? getTsType(responses) : "any"}>> => {
  ${
    options.deprecated
      ? `
  if (__DEV__) {
    console.warn(
      "${serviceName}",
      "${DEPRECATED_WARM_MESSAGE}",
    );
  }`
      : ""
  }
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
      const { type, enum: Enum, allOf, oneOf } = schema;
      if (type === "object") {
        const typeObject = getTsType(schema);

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
      if (oneOf) {
        code += `
        export type ${name} = ${oneOf
          .map((_schema) => getTsType(_schema))
          .join(" | ")}
                `;
      }
    });

    writeFileSync(`${dir}/services.ts`, format(code, prettierOptions as any));

    writeFileSync(
      `${dir}/httpRequest.ts`,
      format(HTTP_REQUEST, prettierOptions as any),
    );

    if (!existsSync(`${dir}/config.ts`)) {
      writeFileSync(`${dir}/config.ts`, format(CONFIG, prettierOptions as any));
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
