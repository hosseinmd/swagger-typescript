import { SwaggerJson } from "../types";
//@ts-ignore
import converter from "swagger2openapi";

/** Support swagger v2 */
function swaggerToOpenApi(input: SwaggerJson) {
  const options: any = {};
  options.patch = true; // fix up small errors in the source definition
  options.warnOnly = true; // Do not throw on non-patchable errors
  return new Promise<SwaggerJson>((resolve, reject) => {
    converter.convertObj(input, options, function (err: Error, result: any) {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.openapi);
    });
  });
}

export { swaggerToOpenApi };
