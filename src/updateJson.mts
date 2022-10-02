import { default as chalk } from "chalk";
import type {
  SwaggerRequest,
  SwaggerJson,
  PathItem,
  Components,
} from "./types.mjs";

function partialUpdateJson(
  input: SwaggerJson,
  newJson: SwaggerJson,
  tag: string[],
): SwaggerJson {
  let refs: string[] = [];

  const filteredPaths = Object.fromEntries(
    Object.entries(input.paths).map(([name, value]) => [
      name,
      Object.fromEntries(
        (Object.entries(value) as [string, SwaggerRequest][]).filter(
          ([_, { tags }]) => !tags?.find((item) => tag.find((i) => i === item)),
        ),
      ),
    ]),
  );

  const paths: SwaggerJson["paths"] = { ...filteredPaths };
  Object.entries(newJson.paths).forEach(([endPoint, value]) => {
    (Object.entries(value) as [keyof PathItem, SwaggerRequest][]).forEach(
      ([method, options]) => {
        if (typeof options !== "object") {
          return;
        }

        if (tag.find((t) => options.tags?.includes(t))) {
          refs = refs.concat(findRefs(options));

          if (!paths[endPoint]) {
            paths[endPoint] = {
              ...newJson.paths[endPoint],
            };
          }
          paths[endPoint][method] = options as any;
        }
      },
    );
  });

  refs = findRelatedRef(newJson, refs);

  const components = replaceComponents(input, newJson, refs);

  return {
    ...input,
    paths,
    components,
  };
}

function findRelatedRef(newJson: SwaggerJson, refs: string[]): string[] {
  try {
    (["schemas", "requestBodies", "parameters"] as const).map((key) => {
      if (newJson?.components?.[key]) {
        Object.entries(newJson.components[key]!).forEach(([name, schema]) => {
          if (refs.includes(name)) {
            const schemaRefs = findRefs(schema);

            const newRefs = schemaRefs.filter((ref) => !refs.includes(ref));

            if (newRefs.length > 0) {
              refs = findRelatedRef(newJson, [...refs, ...newRefs]);
            }
          }
        });
      }
    });
  } catch (error) {
    chalk.red(error);
  }

  return refs;
}

function replaceComponents(
  input: SwaggerJson,
  newJson: SwaggerJson,
  refs: string[],
) {
  const components: Components = {
    ...input.components,
  };

  (["schemas", "requestBodies", "parameters"] as const).map((key) => {
    if (newJson?.components?.[key]) {
      Object.entries(newJson.components[key]!).forEach(([name, schema]) => {
        if (refs.includes(name)) {
          if (!components[key]) {
            components[key] = {
              ...input.components![key],
            } as any;
          }
          components[key]![name] = schema;
        }
      });
    }
  });

  return components;
}

function findRefs(
  obj?: Record<string, any> | string | number | any[],
): string[] {
  if (typeof obj !== "object") {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj.flatMap((value) => {
      return findRefs(value);
    });
  }

  return Object.entries(obj).flatMap(([key, value]) => {
    if (key === "$ref") {
      return [value.replace(/#\/components\/[\w]+\//g, "")];
    }
    return findRefs(value);
  });
}

export { partialUpdateJson };
