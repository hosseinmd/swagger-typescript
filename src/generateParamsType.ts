import { isAscending, getDefineParam } from "./utils";
import { Parameter } from "./types";

interface ApiParameters {
  pathParams: Parameter[];
  queryParams: string;
  serviceName: string;
}

function generateParamsType(parameters: ApiParameters[]): string {
  let code = "\n /** Generate parameters type */ \n";
  try {
    code += parameters
      .sort(({ serviceName }, { serviceName: _serviceName }) =>
        isAscending(serviceName, _serviceName),
      )
      .reduce((prev, { serviceName, pathParams, queryParams }) => {
        if (pathParams.length > 0) {
          return (
            prev +
            `
  export interface ${serviceName}Params { 
    ${pathParams
      .map(({ name, required, schema }) =>
        getDefineParam(name, required, schema),
      )
      .join(",")}
    }
  `
          );
        }
        if (queryParams) {
          return (
            prev +
            `
  export interface ${serviceName}QueryParams  
    ${queryParams}
  `
          );
        } else {
          return prev;
        }
      }, "");
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateParamsType };
