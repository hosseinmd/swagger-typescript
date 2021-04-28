import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
  getJsdoc,
} from "./utils";
import { ApiAST } from "./types";
import { SERVICE_BEGINNING, DEPRECATED_WARM_MESSAGE } from "./strings";

function generateApis(apis: ApiAST[]): string {
  let code = SERVICE_BEGINNING;
  try {
    code += apis
      .sort(({ serviceName }, { serviceName: _serviceName }) =>
        isAscending(serviceName, _serviceName),
      )
      .reduce(
        (
          prev,
          {
            contentType,
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
            endPoint,
            pathParamsRefString,
            additionalAxiosConfig,
            security,
          },
        ) => {
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
})}export const ${serviceName} = (
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
            }configOverride?:AxiosRequestConfig
): Promise<SwaggerResponse<${responses ? getTsType(responses) : "any"}>> => {
  ${
    deprecated
      ? `
  if (__DEV__) {
    console.warn(
      "${serviceName}",
      "${DEPRECATED_WARM_MESSAGE}",
    );
  }`
      : ""
  }
  return Http.${method}Request(
    ${
      pathParamsRefString
        ? `template("${endPoint}",${pathParamsRefString})`
        : `"${endPoint}"`
    },
    ${queryParamsTypeName ? "queryParams" : "undefined"},
    ${
      requestBody
        ? contentType === "multipart/form-data"
          ? "objToForm(requestBody)"
          : "requestBody"
        : "undefined"
    },
    ${security},
    overrideConfig(${additionalAxiosConfig},
      configOverride,
    )
  )
}
`
          );
        },
        "",
      );
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateApis };
