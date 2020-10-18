import {
  getPathParams,
  generateServiceName,
  getHeaderParams,
  getParametersInfo,
  getRefName,
} from "./utils";
import type {
  SwaggerRequest,
  SwaggerJson,
  SwaggerResponse,
  SwaggerConfig,
  ApiAST,
  TypeAST,
  Schema,
  Parameter,
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
          const parameters = options.parameters?.map((parameter) => {
            const { $ref } = parameter;
            if ($ref) {
              const name = $ref.replace("#/components/parameters/", "");
              return {
                ...input.components?.parameters?.[name],
                $ref,
                schema: { $ref } as Schema,
              } as Parameter;
            }
            return parameter;
          });
          const serviceName = `${method}${generateServiceName(endPoint)}`;

          const pathParams = getPathParams(parameters);

          const {
            exist: queryParams,
            isNullable: isQueryParamsNullable,
            params: queryParameters,
          } = getParametersInfo(parameters, "query");
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
                  (prev, { name, schema, $ref, required, description }) => {
                    return {
                      ...prev,
                      [name]: {
                        ...($ref ? { $ref } : schema),
                        nullable: !required,
                        description,
                      } as Schema,
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
            options.requestBody?.content ||
              (options.requestBody?.$ref &&
                input.components?.requestBodies?.[
                  getRefName(options.requestBody.$ref as string)
                ]?.content) || {
                "application/json": null,
              },
          )[0];

          const accept = Object.keys(
            options.responses?.[200]?.content || {
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

    if (input?.components?.schemas) {
      types.push(
        ...Object.entries(input.components.schemas).map(([name, schema]) => {
          return {
            name,
            schema,
          };
        }),
      );
    }

    if (input?.components?.parameters) {
      types.push(...Object.values(input.components.parameters));
    }
    if (input?.components?.requestBodies) {
      types.push(
        ...(Object.entries(input.components.requestBodies)
          .map(([name, _requestBody]) => {
            return {
              name: `RequestBody${name}`,
              schema: _requestBody.content?.["application/json"].schema,
            };
          })
          .filter((v) => v.schema) as any),
      );
    }

    let code = generateApis(apis);
    code += generateTypes(types);

    return code;
  } catch (error) {
    console.error({ error });
    return "";
  }
}

function getBodyContent(responses?: SwaggerResponse): Schema | undefined {
  if (!responses) {
    return responses;
  }

  return responses.content
    ? Object.values(responses.content)[0].schema
    : responses.$ref
    ? ({
        $ref: responses.$ref,
      } as Schema)
    : undefined;
}

export { generator };
