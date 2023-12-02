import {
  getTsType,
  getDefineParam,
  getParamString,
  toPascalCase,
  getSchemaName,
} from "./utils.mjs";
import { ApiAST, Config, TypeAST } from "../types.mjs";
import {
  DEPRECATED_WARM_MESSAGE,
  getHooksFunctions,
  getHooksImports,
} from "./strings.mjs";
import { getJsdoc } from "../utilities/jsdoc.mjs";
import { isAscending, isMatchWholeWord } from "../utils.mjs";

const allowedPageParametersNames = ["page", "pageno", "pagenumber", "offset"];

function generateHook(
  apis: ApiAST[],
  types: TypeAST[],
  config: Config,
): string {
  let code = getHooksImports({
    hasInfinity: !!config.useInfiniteQuery?.length,
  });
  try {
    apis = apis.sort(({ serviceName }, { serviceName: _serviceName }) =>
      isAscending(serviceName, _serviceName),
    );

    const apisCode = apis.reduce(
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
        const hookName = `use${toPascalCase(serviceName)}`;

        const hasPaging = config.useInfiniteQuery?.find(
          (name) =>
            name.toLowerCase() === serviceName.toLowerCase() ||
            name.toLowerCase() === hookName.toLowerCase(),
        );

        const isGet =
          hasPaging ||
          method === "get" ||
          config.useQuery?.find(
            (name) =>
              name.toLowerCase() === serviceName.toLowerCase() ||
              name.toLowerCase() === hookName.toLowerCase(),
          );
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
          }
          ${headerParams ? "headerParams," : ""}`;

        const TData = `${responses ? getTsType(responses, config) : "any"}`;
        const TQueryFnData = `SwaggerResponse<${TData}>`;
        const TError = "RequestError | Error";

        const getQueryParamName = (
          name: string,
          nullable: boolean = isQueryParamsNullable,
          isPartial?: boolean,
        ) =>
          queryParamsTypeName
            ? `${getParamString(
                name,
                !nullable,
                queryParamsTypeName,
                undefined,
                isPartial,
              )},`
            : "";

        const TVariables = `${
          /** Path parameters */
          pathParams
            .map(({ name, required, schema, description }) =>
              getDefineParam(name, required, schema, config, description),
            )
            .join(",")
        }${pathParams.length > 0 ? "," : ""}${
          /** Request Body */
          requestBody
            ? `${getDefineParam("requestBody", true, requestBody, config)},`
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
                headerParams as string,
              )},`
            : ""
        }`;

        const deps = `[${serviceName}.key,${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
            ${requestBody ? "requestBody," : ""}
            ${queryParamsTypeName ? "queryParams," : ""}
            ${headerParams ? "headerParams," : ""}]`;

        let result: string =
          prev +
          `
      ${getJsdoc({
        description: summary,
        deprecated: deprecated ? DEPRECATED_WARM_MESSAGE : undefined,
      })}`;

        result += `export const ${hookName} =`;
        if (!isGet) {
          result += `<TExtra>`;
        }

        const params = [
          `${isGet ? TVariables : ""}`,
          `options?:${
            hasPaging
              ? `SwaggerTypescriptUseInfiniteQueryOptions<${TQueryFnData}>`
              : isGet
              ? `SwaggerTypescriptUseQueryOptions<${TData}>`
              : `${
                  TVariables
                    ? `SwaggerTypescriptUseMutationOptions<${TData}, {${TVariables}}, TExtra>`
                    : `SwaggerTypescriptUseMutationOptionsVoid<${TData}, TExtra>`
                }`
          },`,
          `${isGet ? `configOverride?:AxiosRequestConfig` : ""}`,
        ];

        result += ` (
           ${params.join("")}
           ) => {`;
        if (isGet) {
          result += `
          const { onSuccess, onSettled, onError, ...restOptions } = options ?? {};

          const { key, fun } = ${hookName}.info(${getParamsString()} configOverride,{
            onError,
            onSettled,
            onSuccess,
          });
          `;
          if (hasPaging) {
            result += `const {
            data: { pages } = {},
            data,
            ...rest
          } = useInfiniteQuery({
            queryKey:key,
            queryFn:({ pageParam }) =>
              fun({
                  ${queryParameters.find(({ name }) =>
                    allowedPageParametersNames.includes(name.toLowerCase()),
                  )?.name}:pageParam,
              }),
              initialPageParam: 1,
              getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
              ...(restOptions as any),
          });
        
          const list = useMemo(() => paginationFlattenData(pages), [pages]);
          const total = getTotal(pages);

          const hasMore = useHasMore(pages, list, queryParams);
          
          return {...rest, data, list, hasMore, total}
          `;
          } else {
            result += `return useQuery(
               {
                queryKey: key, 
                queryFn:fun,
                ...restOptions
              }
               )`;
          }
        } else {
          result += `return useMutation({mutationFn:(_o)=>{
            const {${getParamsString()} configOverride } = _o || {};

            return ${serviceName}(
                ${getParamsString()} configOverride,
              )
          },
          ...options
        }
         )`;
        }

        result += `  
          }
        `;

        if (isGet) {
          result += `${hookName}.info = (${params
            .filter((param) => !param.startsWith("options?:"))
            .join("")}, callbacks: UseQueryCallbacks<${TData}>,) => {
              return {
                key: ${deps} as QueryKey,
                fun: (${
                  hasPaging ? getQueryParamName("_param", true, true) : ""
                }) =>
                ${serviceName}(
                  ${getParamsString(true)}
                  configOverride,callbacks
                ),
              };
            };`;

          result += `${hookName}.prefetch = (
            client: QueryClient,
            ${params.join("")}) => {
              const { onSuccess, onSettled, onError, ...restOptions } = options ?? {};

              const { key, fun } = ${hookName}.info(${getParamsString()} configOverride,{
                onError,
                onSettled,
                onSuccess,
              });

                return client.getQueryData(key)
                ? Promise.resolve()
                : client.prefetchQuery(
                {
                  queryKey:key,
                  queryFn:()=>fun(),
                  ...restOptions
                }
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
        }, "import type {") + '}  from "./types"\n';

    code +=
      apis.reduce((prev, { serviceName }) => {
        return prev + ` ${serviceName},`;
      }, "import {") + '}  from "./services"\n';

    code += getHooksFunctions({
      hasInfinity: !!config.useInfiniteQuery?.length,
    });

    code += `
    export type SwaggerTypescriptMutationDefaultParams<TExtra> = {_extraVariables?:TExtra, configOverride?:AxiosRequestConfig}
    type SwaggerTypescriptUseQueryOptions<TData> = Omit<UseQueryOptions<SwaggerResponse<TData>,RequestError | Error>,"queryKey"> & UseQueryCallbacks<TData>;
    type SwaggerTypescriptUseInfiniteQueryOptions<TData> = Omit<UseInfiniteQueryOptions<SwaggerResponse<TData>,RequestError | Error>,"queryKey"> & UseQueryCallbacks<TData>;

    type SwaggerTypescriptUseMutationOptions<TData, TRequest, TExtra> = UseMutationOptions<
      SwaggerResponse<TData>,
      RequestError | Error,
      TRequest & SwaggerTypescriptMutationDefaultParams<TExtra>
    >;

    type SwaggerTypescriptUseMutationOptionsVoid<
      TData,
      TExtra
    > = UseMutationOptions<
      SwaggerResponse<TData>,
      RequestError | Error,
      SwaggerTypescriptMutationDefaultParams<TExtra> | void
    >;  
    `;

    code += apisCode;

    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateHook };
