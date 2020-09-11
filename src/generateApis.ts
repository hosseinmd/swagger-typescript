import { getTsType } from "./utils";
import { Schema, ApiAST } from "./types";
import { SERVICE_BEGINNING, DEPRECATED_WARM_MESSAGE } from "./strings";

function generateApis(apis: ApiAST[]): string {
  let code = SERVICE_BEGINNING;
  try {
    code += apis.reduce(
      (
        prev,
        {
          summary,
          deprecated,
          serviceName,
          pathParams,
          requestBody,
          queryParams,
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
          ? `
      /**${summary ? `\n * ${summary}` : ""}${
              deprecated ? `\n * @deprecated ${DEPRECATED_WARM_MESSAGE}` : ""
            }
       */`
          : ""
      }
      export const ${serviceName}${deprecated ? ": any" : ""} = async (
          ${pathParams
            .map(({ name, required, schema }) =>
              getDefineParam(name, required, schema),
            )
            .join(",")}${pathParams.length > 0 ? "," : ""}${
            requestBody
              ? `${getDefineParam("requestBody", true, requestBody)},`
              : ""
          }${
            queryParams
              ? `${getParamString(
                  "queryParams",
                  !isQueryParamsNullable,
                  queryParams,
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
      ): Promise<SwaggerResponse<${
        responses ? getTsType(responses) : "any"
      }>> => {
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
        return await responseWrapper(await Http.${method}Request(
          template("${endPoint}",${pathParamsRefString}),
          ${queryParams ? "queryParams" : "undefined"},
          ${requestBody ? "requestBody" : "undefined"},
          overrideConfig({
              headers: {
                "Content-Type": "${contentType}",
                Accept: "${accept}",
                ${headerParams ? "...headerParams," : ""}
              },
            },
            configOverride,
          )
        ))
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

function getDefineParam(
  name: string,
  required: boolean = false,
  schema: Schema,
): string {
  return getParamString(name, required, getTsType(schema));
}

function getParamString(
  name: string,
  required: boolean = false,
  type: any,
): string {
  return `${name}${required ? "" : "?"}: ${type}`;
}

export { generateApis };
