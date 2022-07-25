import {
  getPathParams,
  generateServiceName,
  getHeaderParams,
  getParametersInfo,
  getRefName,
  toPascalCase,
} from "./utils";
import type {
  SwaggerRequest,
  SwaggerJson,
  SwaggerResponse,
  Config,
  ApiAST,
  TypeAST,
  Schema,
  Parameter,
  ConstantsAST,
  Method,
} from "../types";
import { generateApis } from "./generateApis";
import { generateTypes } from "./generateTypes";
import { generateConstants } from "./generateConstants";
import { generateHook } from "./generateHook";

function generator(
  input: SwaggerJson,
  config: Config,
): { code: string; hooks: string; type: string } {
  const apis: ApiAST[] = [];
  const types: TypeAST[] = [];
  let constantsCounter = 0;
  const constants: ConstantsAST[] = [];

  function getConstantName(value: string) {
    const constant = constants.find((_constant) => _constant.value === value);
    if (constant) {
      return constant.name;
    }

    const name = `_CONSTANT${constantsCounter++}`;

    constants.push({
      name,
      value,
    });

    return name;
  }

  try {
    Object.entries(input.paths).forEach(([endPoint, value]) => {
      const parametersExtended = value.parameters as Parameter[] | undefined;
      Object.entries(value).forEach(
        ([method, options]: [string, SwaggerRequest]) => {
          if (method === "parameters") {
            return;
          }

          const { operationId, security } = options;

          const allParameters =
            parametersExtended || options.parameters
              ? [...(parametersExtended || []), ...(options.parameters || [])]
              : undefined;

          const parameters = allParameters?.map<Parameter>((parameter) => {
            const { $ref } = parameter;
            if ($ref) {
              const name = $ref.replace("#/components/parameters/", "");
              return {
                ...input.components?.parameters?.[name]!,
                $ref,
                schema: { $ref } as Schema,
              };
            }
            return parameter;
          });

          const serviceName = generateServiceName(
            endPoint,
            method,
            operationId,
            config,
          );

          const pathParams = getPathParams(parameters);

          const {
            exist: isQueryParamsExist,
            isNullable: isQueryParamsNullable,
            params: queryParameters,
          } = getParametersInfo(parameters, "query");
          const queryParamsTypeName: string | false = isQueryParamsExist
            ? `${toPascalCase(serviceName)}QueryParams`
            : false;

          if (queryParamsTypeName) {
            const required = config._isSwagger2 ? ([] as string[]) : undefined;
            types.push({
              name: queryParamsTypeName,
              schema: {
                type: "object",
                nullable: isQueryParamsNullable,
                required,
                properties: queryParameters?.reduce(
                  (
                    prev,
                    { name, schema, $ref, required: _required, description },
                  ) => {
                    if (_required) {
                      required?.push(name);
                    }
                    return {
                      ...prev,
                      [name]: {
                        ...($ref ? { $ref } : schema),
                        nullable: !_required,
                        description,
                      } as Schema,
                    };
                  },
                  {},
                ),
              },
            });
          }

          const { params: headerParams, isNullable: hasNullableHeaderParams } =
            getHeaderParams(parameters, config);

          const requestBody = getBodyContent(options.requestBody);

          const contentType = Object.keys(
            options.requestBody?.content ||
              (options.requestBody?.$ref &&
                input.components?.requestBodies?.[
                  getRefName(options.requestBody.$ref as string)
                ]?.content) || {
                "application/json": null,
              },
          )[0] as ApiAST["contentType"];

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

          const additionalAxiosConfig = headerParams
            ? `{
              headers:{
                ...${getConstantName(`{
                  "Content-Type": "${contentType}",
                  Accept: "${accept}",

                }`)},
                ...headerParams,
              },
            }`
            : getConstantName(`{
              headers: {
                "Content-Type": "${contentType}",
                Accept: "${accept}",
              },
            }`);

          apis.push({
            contentType,
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
            method: method as Method,
            security: security
              ? getConstantName(JSON.stringify(security))
              : "undefined",
            additionalAxiosConfig,
            queryParameters,
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
      types.push(
        ...Object.entries(input.components.parameters).map(([key, value]) => ({
          ...value,
          name: key,
        })),
      );
    }

    if (input?.components?.requestBodies) {
      types.push(
        ...(Object.entries(input.components.requestBodies)
          .map(([name, _requestBody]) => {
            return {
              name: `RequestBody${name}`,
              schema: Object.values(_requestBody.content || {})[0]?.schema,
              description: _requestBody.description,
            };
          })
          .filter((v) => v.schema) as any),
      );
    }

    let code = generateApis(apis, types, config);
    code += generateConstants(constants);
    const type = generateTypes(types, config);
    const hooks = config.reactHooks ? generateHook(apis, types, config) : "";

    return { code, hooks, type };
  } catch (error) {
    console.error({ error });
    return { code: "", hooks: "", type: "" };
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
