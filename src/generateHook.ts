import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
  getJsdoc,
  toPascalCase,
  getSchemaName,
  isMatchWholeWord,
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

        const getParamsString = (override?: boolean) => ` ${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
          ${requestBody ? "requestBody," : ""}
          ${
            queryParamsTypeName
              ? hasPaging && override
                ? `{
                  ..._param,
                  ...queryParams,
                },`
                : "queryParams,"
              : ""
          }`;

        const TQueryFnData = `SwaggerResponse<${
          responses ? getTsType(responses) : "any"
        }>`;
        const TError = "RequestError | Error";

        const getQueryParamName = (
          name: string,
          nullable: boolean = isQueryParamsNullable,
        ) =>
          queryParamsTypeName
            ? `${getParamString(name, !nullable, queryParamsTypeName)},`
            : "";

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
          getQueryParamName("queryParams")
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

        const hookName = `use${toPascalCase(serviceName)}`;

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
        result += `export const ${hookName} =`;
        if (!isGet) {
          result += `<TExtra extends any>`;
        }

        const params = [
          `${isGet ? TVariables : ""}`,
          `options?:${
            hasPaging
              ? `UseInfiniteQueryOptions<${TQueryFnData}, ${TError}>`
              : isGet
              ? `UseQueryOptions<${TQueryFnData}, ${TError}>`
              : `UseMutationOptions<${TQueryFnData}, ${TError},${
                  TVariables === ""
                    ? "{_extraVariables?:TExtra} | undefined"
                    : `{${TVariables} _extraVariables?:TExtra}`
                }>`
          },`,
          `configOverride?:AxiosRequestConfig`,
        ];

        result += ` (
           ${params.join("")}
           ) => {`;
        if (isGet) {
          result += `
          const { key, fun } = ${hookName}.info(${getParamsString()} options,configOverride);
          `;
          if (hasPaging) {
            result += `const {
            data: { pages } = {},
            data,
            ...rest
          } = useInfiniteQuery(
            key,
            ({ pageParam = 1 }) =>
              fun({
                  ${hasPaging.name}:pageParam,
              }),
            {
              getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
              ...(options as any),
            },
          );
        
          const list = useMemo(() => paginationFlattenData(pages), [pages]);

          const hasMore = useHasMore(pages, list, queryParams);
          
          return {...rest, data, list, hasMore}
          `;
          } else {
            result += `return useQuery<${TQueryFnData}, ${TError}>(key,()=>
                fun(),
                options
               )`;
          }
        } else {
          result += `return useMutation<${TQueryFnData}, ${TError}, ${
            TVariables === ""
              ? "{_extraVariables?:TExtra} | undefined"
              : `{${TVariables} _extraVariables?: TExtra }`
          }>((
             ${TVariables === "" ? "" : `{${getParamsString()}}`}
          )=>${serviceName}(
            ${getParamsString()}
            configOverride,
          ),
          options
         )`;
        }

        result += `  
          }
        `;

        if (isGet) {
          result += `${hookName}.info = (${params.join("")}) => {
              return {
                key: ${deps},
                fun: (${getQueryParamName("_param", true)}) =>
                ${serviceName}(
                  ${getParamsString(true)}
                  configOverride
                ),
              };
            };`;

          result += `${hookName}.prefetch = (
            client: QueryClient,
            ${params.join("")}) => {
                const { key, fun } = ${hookName}.info(${getParamsString()} options,configOverride);

                return client.getQueryData(${deps})
                ? Promise.resolve()
                : client.prefetchQuery(
                    key,
                    ()=>fun(),
                    options
                  );
              }`;
        }

        return result;
      },
      "",
    );

    code +=
      types
        .sort(({ name }, { name: _name }) => isAscending(name, _name))
        .reduce((prev, { name: _name }) => {
          const name = getSchemaName(_name);
          if (!isMatchWholeWord(apisCode, name)) {
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
