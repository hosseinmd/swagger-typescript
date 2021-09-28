import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
  getJsdoc,
  toPascalCase,
  getSchemaName,
} from "./utils";
import { ApiAST, TypeAST } from "./types";
import { HOOKS_BEGINNING, DEPRECATED_WARM_MESSAGE } from "./strings";

function generateHook(apis: ApiAST[], types: TypeAST[]): string {
  let code = HOOKS_BEGINNING;
  try {
    apis = apis.sort(({ serviceName }, { serviceName: _serviceName }) =>
      isAscending(serviceName, _serviceName),
    );

    let apisCode =
      apis.reduce((prev, { serviceName, method }) => {
        if (method !== "get") {
          return prev;
        }

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
        if (method !== "get") {
          return prev;
        }

        const hasPaging = queryParameters.find(
          ({ name }) => name.toLowerCase() === "page",
        );

        const paramsString = ` ${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
          ${
            queryParamsTypeName
              ? hasPaging
                ? `{
              ${hasPaging.name}:pageParam,
              ...queryParams,
            },`
                : "queryParams,"
              : ""
          }
          ${requestBody ? "requestBody," : ""}`;

        const TQueryFnData = `SwaggerResponse<${
          responses ? getTsType(responses) : "any"
        }>`;
        const TError = "RequestError | Error";

        const deps = `[${serviceName}.key,${
          pathParams.length ? `${pathParams.map(({ name }) => name)},` : ""
        }
            ${queryParamsTypeName ? "queryParams," : ""}
            ${requestBody ? "requestBody," : ""}]`;

        return (
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
      })}export const use${toPascalCase(serviceName.slice(3))} = (
          ${
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
          }
                  options?:UseQueryOptions<${TQueryFnData}, ${TError}>,
                  configOverride?:AxiosRequestConfig
      ) => {
        ${
          hasPaging
            ? `const {
            data: { pages } = {},
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
        
          const list = useMemo(
            () => pages?.flatMap(({ data }) => data || []),
            [pages],
          );
          
          return {...rest, list}
          `
            : `return useQuery<${TQueryFnData}, ${TError}>(${deps},()=>${serviceName}(
                  ${paramsString}
                  configOverride,
                ),
                options
               )`
        }  
      }
`
        );
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
        }, "import {") + '}  from "./services"\n';

    code += apisCode;
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateHook };
