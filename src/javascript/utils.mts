import { Schema, Parameter, Config } from "../types.mjs";
import { getJsdoc } from "../utilities/jsdoc.mjs";
import { isAscending } from "../utils.mjs";

function getPathParams(parameters?: Parameter[]): Parameter[] {
  return (
    parameters?.filter(({ in: In }) => {
      return In === "path";
    }) || []
  );
}

function getHeaderParams(parameters: Parameter[] | undefined, config: Config) {
  const queryParamsArray =
    parameters?.filter(({ in: In, name }) => {
      return In === "header" && !config.ignore?.headerParams?.includes(name);
    }) || [];

  const params = getObjectType(queryParamsArray, config);

  return {
    params,
    isNullable: queryParamsArray.every(({ schema = {} }) => !schema.required),
  };
}

function toPascalCase(str: string): string {
  return `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;
}
function replaceWithUpper(str: string, sp: string) {
  let pointArray = str.split(sp);
  pointArray = pointArray.map((point) => toPascalCase(point));

  return pointArray.join("");
}

function generateServiceName(
  endPoint: string,
  method: string,
  operationId: string | undefined,
  config: Config,
): string {
  const { methodName, prefix = "" } = config;

  const _endPoint = endPoint.replace(new RegExp(`^${prefix}`, "i"), "");
  const path = getSchemaName(_endPoint);

  const methodNameTemplate = getTemplate(methodName, operationId);

  const serviceName = template(methodNameTemplate, {
    path,
    method,
    ...(operationId ? { operationId } : {}),
  });
  return serviceName;
}

function getTemplate(methodName?: string, operationId?: string) {
  const defaultTemplate = "{method}{path}";
  if (!methodName) {
    return defaultTemplate;
  }

  const hasMethodNameOperationId = /(\{operationId\})/i.test(methodName);

  if (hasMethodNameOperationId) {
    return operationId ? methodName : defaultTemplate;
  }

  return methodName;
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
  schema: Schema | undefined,
  config: Config,
  description?: string,
): string {
  return getParamString(name, required, getTsType(schema, config), description);
}

function getParamString(
  name: string,
  required: boolean = false,
  type: string,
  description?: string,
  isPartial?: boolean,
): string {
  return `${getJsdoc({
    description,
  })}${name}${required ? "" : "?"}: ${isPartial ? `Partial<${type}>` : type}`;
}
//x-nullable
function normalizeObjectPropertyNullable(
  propertyName: string,
  schema: Schema,
  required?: string[],
) {
  if (schema.nullable !== undefined) {
    return schema.nullable;
  }
  if (schema["x-nullable"] !== undefined) {
    return schema["x-nullable"];
  }
  if (required) {
    return !required.includes(propertyName);
  }
  return true;
}

function getTsType(
  schema: undefined | true | {} | Schema,
  config: Config,
): string {
  if (isTypeAny(schema)) {
    return "any";
  }

  const {
    type,
    $ref,
    enum: Enum,
    items,
    properties,
    oneOf,
    additionalProperties,
    required,
    allOf,
    anyOf,
    nullable,
  } = schema as Schema;

  if ($ref) {
    const refArray = $ref.split("/");
    if (refArray[refArray.length - 2] === "requestBodies") {
      return `RequestBody${getRefName($ref)}`;
    } else {
      return getRefName($ref);
    }
  }
  if (Enum) {
    return `${Enum.map((e) => JSON.stringify(e)).join(" | ")}`;
  }

  if (items) {
    return `${getTsType(items, config)}[]`;
  }

  let result = "";

  if (properties) {
    result += getObjectType(
      Object.entries(properties).map(([pName, _schema]) => ({
        schema: {
          ..._schema,
          nullable: normalizeObjectPropertyNullable(pName, _schema, required),
        },
        name: pName,
      })),
      config,
    );
  }

  if (oneOf) {
    result = `${result} & (${oneOf
      .map((t) => `(${getTsType(t, config)})`)
      .join(" | ")})`;
  }

  if (allOf) {
    result = `${result ? `${result} &` : ""}(${allOf
      .map((_schema) => getTsType(_schema, config))
      .join(" & ")})`;
  }

  if (anyOf) {
    result = `${result ? `${result} |` : ""}(${anyOf
      .map((_schema) => getTsType(_schema, config))
      .join(" | ")})`;
  }

  if (type === "object" && !result) {
    if (additionalProperties) {
      return `{[x: string]: ${getTsType(additionalProperties, config)}}`;
    }

    return "{[x in string | number ]: any}";
  }

  if (!result && !type && nullable) {
    return "null";
  }

  return result || TYPES[type as keyof typeof TYPES];
}

function getObjectType(
  parameter: { schema?: Schema; name: string }[],
  config: Config,
) {
  const object = parameter
    .sort(
      (
        { name, schema: { nullable } = {} },
        { name: _name, schema: { nullable: _nullable } = {} },
      ) => {
        if (!nullable && _nullable) {
          return -1;
        } else if (nullable && !_nullable) {
          return 1;
        }

        return isAscending(name, _name);
      },
    )
    .reduce(
      (
        prev,
        {
          schema: {
            deprecated,
            "x-deprecatedMessage": deprecatedMessage,
            example,
            nullable,
          } = {},
          schema,
          name,
        },
      ) => {
        return `${prev}${getJsdoc({
          ...schema,
          deprecated:
            deprecated || deprecatedMessage ? deprecatedMessage : undefined,
          example,
        })}"${name}"${nullable ? "?" : ""}: ${getTsType(schema, config)};`;
      },
      "",
    );

  return object ? `{${object}}` : "";
}
function getSchemaName(name: string): string {
  ["/", ".", "`", "[", "]", "-", "*", "{", "}"].forEach((str) => {
    name = replaceWithUpper(name, str);
  });

  return name;
}

function getRefName($ref: string): string {
  const parts = $ref.split("/").pop();
  return getSchemaName(parts || "");
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
    isNullable: !params.some(
      ({ schema, required }) =>
        //swagger 2
        required ||
        // openapi 3
        schema?.required,
    ),
  };
}

function isTypeAny(type: true | undefined | {} | Schema) {
  if (type === true) {
    return true;
  }

  if (typeof type === "object" && Object.keys(type).length <= 0) {
    return true;
  }

  if (!type || (type as Schema).AnyValue) {
    return true;
  }

  return false;
}

/** Used to replace {name} in string with obj.name */
function template(str: string, obj: { [x: string]: string } = {}) {
  Object.entries(obj).forEach(([key, value]) => {
    const re = new RegExp(`{${key}}`, "i");
    str = str.replace(re, value);
  });

  const re = new RegExp("{*}", "g");
  if (re.test(str)) {
    throw new Error(`methodName: Some A key is missed "${str}"`);
  }
  return str;
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
  isTypeAny,
  template,
  toPascalCase,
  getSchemaName,
};
