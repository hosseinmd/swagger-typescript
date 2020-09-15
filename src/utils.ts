import { Schema, Parameter, SwaggerConfig } from "./types";

function getPathParams(parameters?: Parameter[]): Parameter[] {
  return (
    parameters?.filter(({ in: In }) => {
      return In === "path";
    }) || []
  );
}

function getHeaderParams(parameters?: Parameter[], config?: SwaggerConfig) {
  return getParams(parameters, "header", config?.ignore?.headerParams);
}

function getParams(
  parameters: Parameter[] | undefined,
  type: "query" | "header",
  ignoreParams?: string[],
) {
  const queryParamsArray =
    parameters?.filter(({ in: In, name }) => {
      return In === type && !ignoreParams?.includes(name);
    }) || [];

  const params = getObjectType(queryParamsArray);

  return {
    params,
    hasNullable: queryParamsArray.every(({ schema }) => schema.nullable),
  };
}

function generateServiceName(endPoint: string): string {
  function replaceWithUpper(str: string, sp: string) {
    let pointArray = str.split(sp);
    pointArray = pointArray.map(
      (point) => `${point.substring(0, 1).toUpperCase()}${point.substring(1)}`,
    );

    return pointArray.join("");
  }

  const name = replaceWithUpper(
    replaceWithUpper(replaceWithUpper(endPoint, "/"), "{"),
    "}",
  );

  return name;
}

const TYPES = {
  integer: "number",
  number: "number",
  boolean: "boolean",
  object: "object",
  string: "string",
  array: "array",
};

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

function getTsType({
  type,
  $ref,
  enum: Enum,
  items,
  properties,
  oneOf,
}: Schema): string {
  let tsType = TYPES[type as keyof typeof TYPES];

  if ($ref) {
    tsType = getRefName($ref);
  }
  if (Enum) {
    tsType = JSON.stringify(Enum);
  }

  if (items) {
    tsType = `${getTsType(items)}[]`;
  }

  if (oneOf) {
    tsType = `${oneOf.map((t) => `(${getTsType(t)})`).join(" | ")}`;
  }

  if (properties) {
    tsType = getObjectType(
      Object.entries(properties).map(([pName, schema]) => ({
        schema,
        name: pName,
      })),
    );
  }

  // if (nullable) {
  //   tsType + "| null";
  // }

  return tsType;
}

function getObjectType(parameter: { schema: Schema; name: string }[]) {
  const object = parameter
    .sort(
      (
        { name, schema: { nullable } },
        { name: _name, schema: { nullable: _nullable } },
      ) => {
        if (!nullable && _nullable) {
          return -1;
        } else if (nullable && !_nullable) {
          return 1;
        }

        return isAscending(name, _name);
      },
    )
    .reduce((prev, { schema, name }) => {
      return `${prev}${name}${schema.nullable ? "?" : ""}: ${getTsType(
        schema,
      )},`;
    }, "");

  return object ? `{${object}}` : "";
}

function getRefName($ref: string): string {
  return $ref.replace("#/components/schemas/", "");
}

function isAscending(a: string, b: string) {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}

function getParametersInfo(
  parameters: Parameter[] | undefined,
  type: "query" | "header",
) {
  const params =
    parameters?.filter(({ in: In }) => {
      return In === type;
    }) || [];

  return {
    params,
    exist: params.length > 0,
    isNullable: params.every(({ schema }) => schema.nullable),
  };
}

export {
  getPathParams,
  getHeaderParams,
  generateServiceName,
  getTsType,
  getRefName,
  isAscending,
  getDefineParam,
  getParamString,
  getParametersInfo,
};
