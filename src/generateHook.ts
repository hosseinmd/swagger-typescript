import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
  getJsdoc,
  toPascalCase,
  getSchemaName,
} from "./utils";
import { ApiAST, SwaggerConfig, TypeAST } from "./types";
import { HOOKS_BEGINNING, DEPRECATED_WARM_MESSAGE } from "./strings";

function generateHook(
  apis: ApiAST[],
  types: TypeAST[],
  config: SwaggerConfig,
): string {
  let code = HOOKS_BEGINNING;
  try {
    apis = apis.sort(({ serviceName }, { serviceName: _serviceName }) =>
      isAscending(serviceName, _serviceName),
    );

    let apisCode =
      apis.reduce((prev, { serviceName }) => {
        return prev + ` ${serviceName},`;
      }, "import {") + '}  from "./services"\n';

    apisCode += apis.reduce(
      (
        prev,
        {
          summary,
          deprecated,
          serviceName,
          queryParamsTypeName,
          pathParams,
          requestBody,
          headerParams,
          isQueryParamsNullable,
          isHeaderParamsNullable,
          responses,
          method,
          queryParameters,
        },
      ) => {
        const hasPaging = queryParameters.find(
          ({ name }) => name.toLowerCase() === "page",
        );

        const isGet =
          config.useQuery?.includes(serviceName) || method === "get";

        const paramsString = ` ${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
        ${requestBody ? "requestBody," : ""}
          ${
            queryParamsTypeName
              ? hasPaging
                ? `{
              ${hasPaging.name}:pageParam,
              ...queryParams,
            },`
                : "queryParams,"
              : ""
          }`;

        const TQueryFnData = `SwaggerResponse<${
          responses ? getTsType(responses) : "any"
        }>`;
        const TError = "RequestError | Error";

        const TVariables = `${
          /** Path parameters */
          pathParams
            .map(({ name, required, schema, description }) =>
              getDefineParam(name, required, schema, description),
            )
            .join(",")
        }${pathParams.length > 0 ? "," : ""}${
          /** Request Body */
          requestBody
            ? `${getDefineParam("requestBody", true, requestBody)},`
            : ""
        }${
          /** Query parameters */
          queryParamsTypeName
            ? `${getParamString(
                "queryParams",
                !isQueryParamsNullable,
                queryParamsTypeName,
              )},`
            : ""
        }${
          /** Header parameters */
          headerParams
            ? `${getParamString(
                "headerParams",
                !isHeaderParamsNullable,
                headerParams,
              )},`
            : ""
        }`;

        const deps = `[${serviceName}.key,${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
            ${queryParamsTypeName ? "queryParams," : ""}
            ${requestBody ? "requestBody," : ""}]`;

        let result =
          prev +
          `
      ${getJsdoc({
        description: summary,
        tags: {
          deprecated: {
            value: Boolean(deprecated),
            description: DEPRECATED_WARM_MESSAGE,
          },
        },
      })}`;
        result += `export const use${toPascalCase(serviceName)} =`;
        result += ` (
        ${isGet ? TVariables : ""}
                  options?:${
                    hasPaging
                      ? `UseInfiniteQueryOptions<${TQueryFnData}, ${TError}>`
                      : isGet
                      ? `UseQueryOptions<${TQueryFnData}, ${TError}>`
                      : `UseMutationOptions<${TQueryFnData}, ${TError},${
                          TVariables === "" ? "void" : `{${TVariables}}`
                        }>`
                  },
                  configOverride?:AxiosRequestConfig
      ) => {`;
        if (isGet) {
          if (hasPaging) {
            result += `const {
            data: { pages } = {},
            data,
            ...rest
          } = useInfiniteQuery(
            ${deps},
            ({ pageParam = 1 }) =>
              ${serviceName}(
                ${paramsString}
                configOverride
              ),
            {
              getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
              ...options,
            },
          );
        
          const list = useMemo(() => paginationFlattenData(pages), [pages]);
          
          return {...rest, data, list}
          `;
          } else {
            result += `return useQuery<${TQueryFnData}, ${TError}>(${deps},()=>${serviceName}(
                  ${paramsString}
                  configOverride,
                ),
                options
               )`;
          }
        } else {
          result += `return useMutation<${TQueryFnData}, ${TError}, ${
            TVariables === "" ? "void" : `{${TVariables}}`
          }>((
             ${TVariables === "" ? "" : `{${paramsString}}`}
          )=>${serviceName}(
            ${paramsString}
            configOverride,
          ),
          options
         )`;
        }

        result += `  
          }
        `;

        return result;
      },
      "",
    );

    code +=
      types
        .sort(({ name }, { name: _name }) => isAscending(name, _name))
        .reduce((prev, { name: _name }) => {
          const name = getSchemaName(_name);
          if (!apisCode.includes(name)) {
            return prev;
          }
          return prev + ` ${name},`;
        }, "import {") + '}  from "./types"\n';

    code += apisCode;
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateHook };
