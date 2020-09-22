import {
  getPathParams,
  generateServiceName,
  getHeaderParams,
  getParametersInfo,
} from "./utils";
import type {
  SwaggerSchemas,
  SwaggerRequest,
  SwaggerJson,
  SwaggerResponse,
  SwaggerConfig,
  ApiAST,
  TypeAST,
} from "./types";
import { generateApis } from "./generateApis";
import { generateTypes } from "./generateTypes";

function generator(input: SwaggerJson, config: SwaggerConfig): string {
  const apis: ApiAST[] = [];
  const types: TypeAST[] = [];

  try {
    Object.entries(input.paths).forEach(([endPoint, value]) => {
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          const serviceName = `${method}${generateServiceName(endPoint)}`;

          const pathParams = getPathParams(options.parameters);

          const {
            exist: queryParams,
            isNullable: isQueryParamsNullable,
            params: queryParameters,
          } = getParametersInfo(options.parameters, "query");
          let queryParamsTypeName: string | false = serviceName
            .substring(0, 1)
            .toUpperCase();
          queryParamsTypeName += `${serviceName.substring(1)}QueryParams`;

          queryParamsTypeName = queryParams && queryParamsTypeName;

          if (queryParamsTypeName) {
            types.push({
              name: queryParamsTypeName,
              schema: {
                type: "object",
                nullable: isQueryParamsNullable,
                properties: queryParameters?.reduce(
                  (prev, { name, schema, description }) => {
                    return {
                      ...prev,
                      [name]: { ...schema, description },
                    };
                  },
                  {},
                ),
              },
            });
          }

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

          let pathParamsRefString: string | undefined = pathParams.reduce(
            (prev, { name }) => `${prev}${name},`,
            "",
          );
          pathParamsRefString = pathParamsRefString
            ? `{${pathParamsRefString}}`
            : undefined;

          apis.push({
            summary: options.summary,
            deprecated: options.deprecated,
            serviceName,
            queryParamsTypeName,
            pathParams,
            requestBody,
            headerParams,
            isQueryParamsNullable,
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

    types.push(
      ...Object.entries(
        (input.components.schemas as unknown) as SwaggerSchemas,
      ).map(([name, schema]) => {
        return {
          name,
          schema,
        };
      }),
    );

    let code = generateApis(apis);
    code += generateTypes(types);

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
