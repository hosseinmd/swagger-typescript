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
import { SERVICE_BEGINNING, DEPRECATED_WARM_MESSAGE } from "./strings";

function generator(input: SwaggerJson, config: SwaggerConfig): string {
  let code = SERVICE_BEGINNING;

  try {
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
${
  options.summary || options.deprecated
    ? `
/**${options.summary ? `\n * ${options.summary}` : ""}${
        options.deprecated ? `\n * @deprecated ${DEPRECATED_WARM_MESSAGE}` : ""
      }
 */`
    : ""
}
export const ${serviceName}${options.deprecated ? ": any" : ""} = async (
    ${pathParams
      .map(({ name, required, schema }) =>
        getDefineParam(name, required, schema),
      )
      .join(",")}
    ${pathParams.length > 0 ? "," : ""}
    ${requestBody ? `${getDefineParam("requestBody", true, requestBody)},` : ""}
    ${
      queryParams
        ? `${getParamString("queryParams", !hasNullable, queryParams)},`
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

    return code;
  } catch (error) {
    console.error({ error });
    return "";
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

export { generator };
