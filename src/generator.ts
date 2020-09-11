import {
  getPathParams,
  getQueryParams,
  generateServiceName,
  getTsType,
  getHeaderParams,
} from "./utils";
import type {
  SwaggerSchemas,
  SwaggerRequest,
  SwaggerJson,
  SwaggerResponse,
  SwaggerConfig,
  ApiAST,
} from "./types";
import { generateApis } from "./generateApis";

function generator(input: SwaggerJson, config: SwaggerConfig): string {
  const apis: ApiAST[] = [];

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

          apis.push({
            summary: options.summary,
            deprecated: options.deprecated,
            serviceName,
            pathParams,
            requestBody,
            queryParams,
            headerParams,
            isQueryParamsNullable: hasNullable,
            isHeaderParamsNullable: hasNullableHeaderParams,
            responses,
            pathParamsRefString,
            endPoint,
            contentType,
            accept,
            method,
          });
        },
      );
    });

    let code = generateApis(apis);

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

export { generator };
