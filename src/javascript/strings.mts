//@ts-ignore
// import { default as packageJson } from "../../package.json";

const AUTOGENERATED_COMMENT = `
//@ts-nocheck
/**
* AUTO_GENERATED Do not change this file directly, use config.ts file instead
*
* @version ${6}
*/
`;

const SERVICE_BEGINNING = `${AUTOGENERATED_COMMENT}
import type { AxiosRequestConfig } from "axios";
import type { SwaggerResponse } from "./config";
import { Http } from "./httpRequest";
//@ts-ignore
import qs from "qs";
`;
const SERVICE_NEEDED_FUNCTIONS = `
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __DEV__ = process.env.NODE_ENV !== "production";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function overrideConfig(
  config?: AxiosRequestConfig,
  configOverride?: AxiosRequestConfig,
): AxiosRequestConfig {
  return {
    ...config,
    ...configOverride,
    headers: {
      ...config?.headers,
      ...configOverride?.headers,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      const re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });

    return path;
}

function isFormData(obj: any) {
  // This checks for the append method which should exist on FormData instances
  return (
    (typeof obj === "object" &&
      typeof obj.append === "function" &&
      obj[Symbol.toStringTag] === undefined) ||
    obj[Symbol.toStringTag] === "FormData"
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function objToForm(requestBody: object) {
  if (isFormData(requestBody)) {
    return requestBody;
  }
  const formData = new FormData();

  Object.entries(requestBody).forEach(([key, value]) => {
    value && formData.append(key, value);
  });

  return formData;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function objToUrlencoded(requestBody: object) {
  return qs.stringify(requestBody)
}
`;

const getHooksImports = ({
  hasInfinity,
}: {
  hasInfinity?: boolean;
}) => `${AUTOGENERATED_COMMENT}
${hasInfinity ? `import { useMemo } from "react";` : ""}
import { AxiosRequestConfig } from "axios";
import {
  UseQueryOptions,
  useQuery,
  useMutation,
  UseMutationOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  ${
    hasInfinity
      ? `  useInfiniteQuery,
  UseInfiniteQueryOptions,`
      : ""
  }
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { RequestError, SwaggerResponse } from "./config";
${
  hasInfinity
    ? `import { paginationFlattenData, getPageSize, getTotal } from "./hooksConfig";`
    : ""
}
`;
const getHooksFunctions = ({ hasInfinity }: { hasInfinity?: boolean }) =>
  hasInfinity
    ? `
const useHasMore = (
  pages: Array<SwaggerResponse<any>> | undefined,
  list: any,
  queryParams: any,
) =>
  useMemo(() => {
    if (!pages || (pages && pages.length < 1)) {
      return false;
    }

    const total = getTotal(pages);

    if (total !== undefined) {
      if (list && list.length < total) {
        return true;
      }
      return false;
    }
    if (
      paginationFlattenData([pages[pages.length - 1]])?.length === getPageSize(queryParams as any)
    ) {
      return true;
    }

    return false;
  }, [pages, list, queryParams]);

`
    : "";

const DEPRECATED_WARM_MESSAGE =
  "This endpoint deprecated and will be remove. Please use an alternative";

export {
  AUTOGENERATED_COMMENT,
  SERVICE_NEEDED_FUNCTIONS,
  SERVICE_BEGINNING,
  getHooksFunctions,
  getHooksImports,
  DEPRECATED_WARM_MESSAGE,
};
