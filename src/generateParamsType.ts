import { isAscending, getDefineParam } from "./utils";
import { Parameter } from "./types";

interface ApiParameters {
  pathParams: Parameter[];
  serviceName: string;
}

function generateParamsType(parameters: ApiParameters[]): string {
  let code = "\n/** Generate parameters type */ \n";
  try {
    code += parameters
      .sort(({ serviceName }, { serviceName: _serviceName }) =>
        isAscending(serviceName, _serviceName),
      )
      .reduce((prev, { serviceName, pathParams }) => {
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
