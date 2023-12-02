import {
  getDefineParam,
  getParamString,
  getDefinitionBody,
  getHeaderString,
  getKotlinType,
} from "./utils.mjs";
import { ApiAST, Config, Parameter, TypeAST } from "../types.mjs";
import {
  SERVICE_BEGINNING,
  DEPRECATED_WARM_MESSAGE,
} from "./strings.mjs";
import { getJsdoc } from "../utilities/jsdoc.mjs";
import { isAscending } from "../utils.mjs";

function generateApis(
  apis: ApiAST[],
  types: TypeAST[],
  config: Config,
): string {
  let code = SERVICE_BEGINNING;
  try {
    const apisCode = apis
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
            `${getJsdoc({
              description: summary,
              deprecated: deprecated ? DEPRECATED_WARM_MESSAGE : undefined,
            })}${(headerParams as Parameter[])?.map(
              ({ name, required, description, schema }) => {
                return getHeaderString(
                  name,
                  required,
                  getKotlinType(schema, config),
                  description,
                );
              },
            )}
  @${method.toUpperCase()}("${endPoint}")
  suspend fun ${serviceName}(
    ${pathParams
      ?.map(({ name, required, schema, description }) =>
        getDefineParam(name, required, schema, config, description),
      )
      .join(",\n")}${pathParams.length ? "," : ""}${
              requestBody
                ? `
    ${getDefinitionBody("requestBody", requestBody, config)},`
                : ""
            }${
              queryParamsTypeName
                ? `
    ${getParamString(
      "queryParams",
      !isQueryParamsNullable,
      queryParamsTypeName,
    )},`
                : ""
            }
  ): Response<${responses ? getKotlinType(responses, config) : "Any"}>

`
          );
        },
        "",
      );

    code += `
package ${config.kotlinPackage}

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface IApis {
    ${apisCode}
}`;
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateApis };
