import { Schema, Parameter, Config } from "../types";
import { getJsdoc } from "../utilities/jsdoc";
import { exec } from "child_process";

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
    return `${Enum.map((t) => `"${t}"`).join(" | ")}`;
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
          nullable: config._isSwagger2
            ? required
              ? !required.includes(pName)
              : true
            : _schema.nullable,
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
    result = `${result} & (${allOf
      .map((_schema) => getTsType(_schema, config))
      .join(" & ")})`;
  }

  if (type === "object" && !result) {
    if (additionalProperties) {
      return `{[x: string]: ${getTsType(additionalProperties, config)}}`;
    }

    return "{[x in string | number ]: any}";
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
  const removeDot = replaceWithUpper(name, ".");
  const removeBackTick = replaceWithUpper(removeDot, "`");
  const removeFirstBracket = replaceWithUpper(removeBackTick, "[");
  const removeLastBracket = replaceWithUpper(removeFirstBracket, "]");
  return removeLastBracket;
}

function getRefName($ref: string): string {
  const parts = $ref.split("/").pop();
  return getSchemaName(parts || "");
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
    isNullable: params.every(({ schema }) => !schema?.required),
  };
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

function isMatchWholeWord(stringToSearch: string, word: string) {
  return new RegExp("\\b" + word + "\\b").test(stringToSearch);
}

async function getCurrentUrl({ url, branch: branchName }: Config) {
  const urls = url as Exclude<Config["url"], undefined | string>;
  if (!branchName) {
    branchName = await execAsync("git branch --show-current");

    branchName = branchName?.split("/")[0];

    branchName = urls.find((item) => branchName === item.branch)?.branch;
  }
  if (!branchName) {
    branchName = (await getSourceBranch()).find((treeItem) =>
      urls.find((item) => treeItem === item.branch),
    ) as string;
  }

  const currentUrl =
    urls.find((item) => branchName === item.branch)?.url || urls[0].url;

  return currentUrl;
}

async function getSourceBranch() {
  const result = await execAsync('git log --format="%D"');
  const branchesTree = result
    .split("\n")
    .flatMap((item) => item.split(", "))
    .map((branch) => {
      branch = branch.trim();

      branch = branch.replace("HEAD -> ", "");
      branch = branch.trim();

      return branch;
    });

  return branchesTree;
}

async function execAsync(command: string) {
  return new Promise<string>((resolve, reject) => {
    const child = exec(command, (error, stdout) => {
      child.kill();
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

export {
  getCurrentUrl,
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
  isTypeAny,
  template,
  toPascalCase,
  getSchemaName,
  isMatchWholeWord,
};
