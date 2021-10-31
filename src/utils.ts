import {
  Schema,
  Parameter,
  SwaggerConfig,
  JsdocAST,
  AssignToDescriptionObj,
} from "./types";

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
  config: SwaggerConfig,
): string {
  const { methodName, methodParamsByTag, prefix = "" } = config;

  const _endPoint = endPoint.replace(new RegExp(`^${prefix}`, "i"), "");
  let endPointArr = _endPoint.split("/");
  let paramsCount = 0;
  endPointArr = endPointArr.map((value) => {
    if (value.includes("{")) {
      return methodParamsByTag
        ? `P${paramsCount++}`
        : toPascalCase(value.replace("{", "").replace("}", ""));
    }

    return replaceWithUpper(value, "-");
  });
  const path = endPointArr.join("");

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
  schema: Schema,
  description?: string,
): string {
  return getParamString(name, required, getTsType(schema), description);
}
function getParamString(
  name: string,
  required: boolean = false,
  type: string,
  description?: string,
): string {
  return `${getJsdoc({
    description,
  })}${name}${required ? "" : "?"}: ${type}`;
}

function getTsType(schema: true | {} | Schema): string {
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
  } = schema as Schema;

  if (type === "object" && !properties) {
    if (additionalProperties) {
      return `{[x: string]: ${getTsType(additionalProperties)}}`;
    }

    return "{[x in string | number ]: any}";
  }

  if ($ref) {
    const refArray = $ref.split("/");
    if (refArray[refArray.length - 2] === "requestBodies") {
      return `RequestBody${getRefName($ref)}`;
    } else {
      return getRefName($ref);
    }
  }
  if (Enum) {
    return `${Enum.map((t) => `"${t}"`).join(" | ")}`;
  }

  if (items) {
    return `${getTsType(items)}[]`;
  }

  if (oneOf) {
    return `${oneOf.map((t) => `(${getTsType(t)})`).join(" | ")}`;
  }

  if (properties) {
    return getObjectType(
      Object.entries(properties).map(([pName, _schema]) => ({
        schema: {
          ..._schema,
          nullable: required?.find((name) => name === pName)
            ? false
            : _schema.nullable !== undefined
            ? _schema.nullable
            : true,
        },
        name: pName,
      })),
    );
  }

  if (allOf) {
    return allOf.map((_schema) => getTsType(_schema)).join(" & ");
  }

  return TYPES[type as keyof typeof TYPES];
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
    .reduce(
      (
        prev,
        {
          schema: {
            deprecated,
            "x-deprecatedMessage": deprecatedMessage,
            example,
            nullable,
          },
          schema,
          name,
        },
      ) => {
        return `${prev}${getJsdoc({
          description: schema,
          tags: {
            deprecated: {
              value: Boolean(deprecated),
              description: deprecatedMessage,
            },
            example,
          },
        })}"${name}"${nullable ? "?" : ""}: ${getTsType(schema)};`;
      },
      "",
    );

  return object ? `{${object}}` : "";
}
function getSchemaName(name: string): string {
  const removeDot = replaceWithUpper(name, ".");
  const removeBackTick = replaceWithUpper(removeDot, "`");
  const removeFirstBracket = replaceWithUpper(removeBackTick, "[");
  const removeLastBracket = replaceWithUpper(removeFirstBracket, "]");
  return removeLastBracket;
}

function getRefName($ref: string): string {
  const parts = $ref.split("/");
  return getSchemaName(parts[parts.length - 1]);
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

function assignToDescription({
  description,
  title,
  format,
  maxLength,
  minLength,
  max,
  min,
  minimum,
  maximum,
  pattern,
}: AssignToDescriptionObj) {
  return `${
    title
      ? `
        * ${title}
      `
      : ""
  }${
    description
      ? `
        * ${description}`
      : ""
  }${
    format
      ? `
        * Format: ${format}`
      : ""
  }${
    maxLength
      ? `
        * maxLength: ${maxLength}`
      : ""
  }${
    minLength
      ? `
        * minLength: ${minLength}`
      : ""
  }${
    min
      ? `
        * min: ${min}`
      : ""
  }${
    max
      ? `
        * max: ${max}`
      : ""
  }${
    minimum
      ? `
        * minimum: ${minimum}`
      : ""
  }${
    maximum
      ? `
        * max: ${maximum}`
      : ""
  }${
    pattern
      ? `
        * pattern: ${pattern}`
      : ""
  }`;
}

function getJsdoc({
  description,
  tags: { deprecated, example } = {},
}: JsdocAST) {
  description =
    typeof description === "object"
      ? assignToDescription(description)
      : description;

  return deprecated?.value || description || example
    ? `
/**${
        description
          ? `
* ${description}`
          : ""
      }${
        deprecated?.value
          ? `
* @deprecated ${deprecated.description || ""}`
          : ""
      }${
        example
          ? `
* @example 
*   ${example}`
          : ""
      }
*/
`
    : "";
}

function majorVersionsCheck(expectedV: string, inputV?: string) {
  if (!inputV) {
    throw new Error(
      `Swagger-Typescript working with openApi v3/ swagger v2, seem your json is not openApi openApi v3/ swagger v2`,
    );
  }

  const expectedVMajor = expectedV.split(".")[0];
  const inputVMajor = inputV.split(".")[0];
  function isValidPart(x: string) {
    return /^\d+$/.test(x);
  }
  if (!isValidPart(expectedVMajor) || !isValidPart(inputVMajor)) {
    throw new Error(
      `Swagger-Typescript working with openApi v3/ swagger v2 your json openApi version is not valid "${inputV}"`,
    );
  }

  const expectedMajorNumber = Number(expectedVMajor);
  const inputMajorNumber = Number(inputVMajor);

  if (expectedMajorNumber <= inputMajorNumber) {
    return;
  }

  throw new Error(
    `Swagger-Typescript working with openApi v3/ swagger v2 your json openApi version is ${inputV}`,
  );
}

function isTypeAny(type: true | {} | Schema) {
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

function isMatchWholeWord(stringToSearch: string, word: string) {
  return new RegExp("\\b" + word + "\\b").test(stringToSearch);
}

export {
  majorVersionsCheck,
  getPathParams,
  getHeaderParams,
  generateServiceName,
  getTsType,
  getRefName,
  isAscending,
  getDefineParam,
  getParamString,
  getParametersInfo,
  getJsdoc,
  isTypeAny,
  template,
  toPascalCase,
  getSchemaName,
  isMatchWholeWord,
};
