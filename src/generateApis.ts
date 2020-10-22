import {
  getTsType,
  isAscending,
  getDefineParam,
  getParamString,
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
            contentType,
            accept,
          },
        ) => {
          return (
            prev +
            `
${
  summary || deprecated
    ? `/**${summary ? `\n * ${summary}` : ""}${
        deprecated ? `\n * @deprecated ${DEPRECATED_WARM_MESSAGE}` : ""
      }\n */`
    : ""
}
export const ${serviceName} = async (
    ${pathParams
      .map(({ name, required, schema, description }) =>
        getDefineParam(name, required, schema, description),
      )
      .join(",")}${pathParams.length > 0 ? "," : ""}${
              requestBody
                ? `${getDefineParam("requestBody", true, requestBody)},`
                : ""
            }${
              queryParamsTypeName
                ? `${getParamString(
                    "queryParams",
                    !isQueryParamsNullable,
                    queryParamsTypeName,
                  )},`
                : ""
            }${
              headerParams
                ? `${getParamString(
                    "headerParams",
                    !isHeaderParamsNullable,
                    headerParams,
                  )},`
                : ""
            }configOverride?:AxiosRequestConfig
): Promise<AxiosResponse<${responses ? getTsType(responses) : "any"}>> => {
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
    ${requestBody ? "requestBody" : "undefined"},
    {
      headers: {
        "Content-Type": "${contentType}",
        Accept: "${accept}",
        ${headerParams ? "...headerParams," : ""}
      },
      ...configOverride,
    },
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
