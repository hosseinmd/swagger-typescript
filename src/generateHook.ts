import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
  toPascalCase,
  getSchemaName,
  isMatchWholeWord,
} from "./utils";
import { ApiAST, Config, TypeAST } from "./types";
import {
  DEPRECATED_WARM_MESSAGE,
  getHooksFunctions,
  getHooksImports,
} from "./strings";
import { getJsdoc } from "./utilities/jsdoc";

const allowedPageParametersNames = ["page", "pageno", "pagenumber"];

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

        const deps = `[${serviceName}.key,${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
            ${requestBody ? "requestBody," : ""}
            ${queryParamsTypeName ? "queryParams," : ""}
            ${headerParams ? "headerParams," : ""}]`;

        let result =
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
              ? `UseInfiniteQueryOptions<${TQueryFnData}, ${TError}>`
              : isGet
              ? `UseQueryOptions<${TQueryFnData}, ${TError}>`
              : `UseMutationOptions<${TQueryFnData}, ${TError},${
                  TVariables === ""
                    ? "{_extraVariables?:TExtra, configOverride?:AxiosRequestConfig} | void"
                    : `{${TVariables} _extraVariables?:TExtra, configOverride?:AxiosRequestConfig}`
                }>`
          },`,
          `${isGet ? `configOverride?:AxiosRequestConfig` : ""}`,
        ];

        result += ` (
           ${params.join("")}
           ) => {`;
        if (isGet) {
          result += `
          const { key, fun } = ${hookName}.info(${getParamsString()} configOverride);
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
                  ${
                    queryParameters.find(({ name }) =>
                      allowedPageParametersNames.includes(name.toLowerCase()),
                    )?.name
                  }:pageParam,
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
            result += `return useQuery(key,()=>
                fun(),
                options
               )`;
          }
        } else {
          result += `return useMutation((
             ${
               TVariables === ""
                 ? "{configOverride} = {} as {configOverride?:AxiosRequestConfig}"
                 : `{${getParamsString()} configOverride}`
             }
          )=>${serviceName}(
            ${getParamsString()} configOverride,
          ),
          options
         )`;
        }

        result += `  
          }
        `;

        if (isGet) {
          result += `${hookName}.info = (${params
            .filter((param) => !param.startsWith("options?:"))
            .join("")}) => {
              return {
                key: ${deps} as QueryKey,
                fun: (${hasPaging ? getQueryParamName("_param", true) : ""}) =>
                ${serviceName}(
                  ${getParamsString(true)}
                  configOverride
                ),
              };
            };`;

          result += `${hookName}.prefetch = (
            client: QueryClient,
            ${params.join("")}) => {
                const { key, fun } = ${hookName}.info(${getParamsString()} configOverride);

                return client.getQueryData(key)
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
    code += getHooksFunctions({
      hasInfinity: !!config.useInfiniteQuery?.length,
    });
    code += apisCode;
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateHook };
