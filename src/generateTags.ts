import {
  isAscending,
} from "./utils";
import { ApiAST } from "./types";

function generateTags(apis: ApiAST[], tags: { name: string }[]): string {
  let code = "";
  try {
    code += tags
      .reduce(
        (
          prev,
          tag,
        ) => {
          
          const apisFilterByTag = apis.filter((api) => {
            return api.tags && api.tags.filter((tagApi) => tagApi == tag.name).length>0;
          });

          if (apisFilterByTag.length === 0) {
            return "";
          }

          let nameApi = "Api" + tag.name.substr(0, 1).toUpperCase() + tag.name.substr(1);

          return (
            prev +
            `
export const Api${nameApi} = {
    ${apisFilterByTag.map(({ serviceName }) => serviceName + ":" + serviceName)} }`)
        }, "");
    return code;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export { generateTags };
