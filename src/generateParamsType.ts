import { isAscending } from "./utils";

interface ApiParameters {
  queryParams: string;
  serviceParametersName: string;
}

function generateParamsType(parameters: ApiParameters[]): string {
  let code = "\n /** Generate parameters type */ \n";
  try {
    code += parameters
      .sort(
        ({ serviceParametersName }, { serviceParametersName: _serviceName }) =>
          isAscending(serviceParametersName, _serviceName),
      )
      .reduce((prev, { serviceParametersName, queryParams }) => {
        if (queryParams) {
          return (
            prev +
            `
  export interface ${serviceParametersName}QueryParams 
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
