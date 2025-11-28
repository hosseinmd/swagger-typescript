import {
  getPathParams,
  generateServiceName,
  getHeaderParams,
  getParametersInfo,
  getRefName,
  toPascalCase,
} from "./utils.mjs";
import type {
  SwaggerRequest,
  SwaggerJson,
  SwaggerResponse,
  Config,
  ApiAST,
  TypeAST,
  Schema,
  Parameter,
  ConstantsAST,
  Method,
  PathItem,
} from "../types.mjs";
import { generateApis } from "./generateApis.mjs";
import { generateTypes } from "./generateTypes.mjs";
import { generateConstants } from "./generateConstants.mjs";
import { generateHook } from "./generateHook.mjs";

type GeneratorContext = {
  apis: ApiAST[];
  types: TypeAST[];
  constants: ConstantsAST[];
  constantsCounter: number;
  input: SwaggerJson;
  config: Config;
  includeFilters: RegExp[];
  excludeFilters: RegExp[];
};

function generator(
  input: SwaggerJson,
  config: Config,
): { code: string; hooks: string; type: string } {
  const context: GeneratorContext = {
    apis: [],
    types: [],
    constants: [],
    constantsCounter: 0,
    input,
    config,
    includeFilters: (config.includes || []).map(
      (pattern) => new RegExp(pattern),
    ),
    excludeFilters: (config.excludes || []).map(
      (pattern) => new RegExp(pattern),
    ),
  };

  try {
    // Process API paths
    processApiPaths(context);

    // Extract types from components
    extractComponentTypes(context);

    // Generate final code
    let code = generateApis(context.apis, context.types, config);
    code += generateConstants(context.constants);
    const type = generateTypes(context.types, config);
    const hooks = config.reactHooks
      ? generateHook(context.apis, context.types, config)
      : "";

    return { code, hooks, type };
  } catch (error) {
    console.error({ error });
    return { code: "", hooks: "", type: "" };
  }
}

/** Get or create a constant and return its name */
function getConstantName(context: GeneratorContext, value: string): string {
  const existing = context.constants.find((c) => c.value === value);
  if (existing) {
    return existing.name;
  }

  const name = `_CONSTANT${context.constantsCounter++}`;
  context.constants.push({ name, value });
  return name;
}

/** Check if a method should be included based on filters */
function shouldIncludeMethod(
  context: GeneratorContext,
  serviceName: string,
): boolean {
  const matchesInclude =
    !context.includeFilters.length ||
    context.includeFilters.some((regex) => regex.test(serviceName));

  const matchesExclude = context.excludeFilters.some((regex) =>
    regex.test(serviceName),
  );

  return matchesInclude && !matchesExclude;
}

/** Resolve parameter references */
function resolveParameters(
  context: GeneratorContext,
  parameters?: Parameter[],
): Parameter[] | undefined {
  return parameters?.map((parameter) => {
    const { $ref } = parameter;
    if (!$ref) {
      return parameter;
    }

    const name = $ref.replace("#/components/parameters/", "");
    return {
      ...context.input.components?.parameters?.[name]!,
      $ref,
      schema: { $ref } as Schema,
    };
  });
}

/** Create query params type if needed */
function createQueryParamsType(
  context: GeneratorContext,
  serviceName: string,
  parameters?: Parameter[],
): string | false {
  const {
    exist: isQueryParamsExist,
    isNullable: isQueryParamsNullable,
    params: queryParameters,
  } = getParametersInfo(parameters, "query");

  if (!isQueryParamsExist) {
    return false;
  }

  const typeName = `${toPascalCase(serviceName)}QueryParams`;
  const properties = queryParameters?.reduce(
    (prev, { name, schema, $ref, required: _required, description }) => ({
      ...prev,
      [name]: {
        ...($ref ? { $ref } : schema),
        nullable: !_required,
        description,
      } as Schema,
    }),
    {},
  );

  context.types.push({
    name: typeName,
    schema: {
      type: "object",
      nullable: isQueryParamsNullable,
      properties,
    },
  });

  return typeName;
}

/** Get content type from request body */
function getContentType(
  context: GeneratorContext,
  requestBody?: SwaggerRequest["requestBody"],
): string {
  const content = requestBody?.content ||
    (requestBody?.$ref &&
      context.input.components?.requestBodies?.[
        getRefName(requestBody.$ref as string)
      ]?.content) || { "application/json": null };

  return Object.keys(content)[0];
}

/** Get accept header from responses */
function getAcceptHeader(responses?: SwaggerRequest["responses"]): string {
  const content = responses?.[200]?.content || { "application/json": null };
  return Object.keys(content)[0];
}

/** Build path params reference string */
function buildPathParamsRefString(pathParams: Parameter[]): string | undefined {
  if (pathParams.length === 0) {
    return undefined;
  }

  const paramNames = pathParams.map(({ name }) => name).join(",");
  return `{${paramNames}}`;
}

/** Build Axios configuration object */
function buildAxiosConfig(
  context: GeneratorContext,
  contentType: string,
  accept: string,
  headerParams?: string,
): string {
  if (headerParams) {
    return `{
      headers:{
        ...${getConstantName(
          context,
          `{
              "Content-Type": "${contentType}",
              Accept: "${accept}",
           }`,
        )},
        ...headerParams,
      },
    }`;
  }

  return getConstantName(
    context,
    `{
        headers: {
          "Content-Type": "${contentType}",
          Accept: "${accept}",
        },
     }`,
  );
}

/** Process a single API endpoint method */
function processEndpointMethod(
  context: GeneratorContext,
  endPoint: string,
  method: string,
  options: SwaggerRequest,
  pathLevelParams?: Parameter[],
): void {
  const { operationId, security } = options;

  // Merge path-level and operation-level parameters
  const allParameters = [
    ...(pathLevelParams || []),
    ...(options.parameters || []),
  ];
  const parameters = resolveParameters(
    context,
    allParameters.length > 0 ? allParameters : undefined,
  );

  const serviceName = generateServiceName(
    endPoint,
    method,
    operationId,
    context.config,
  );

  if (!shouldIncludeMethod(context, serviceName)) {
    return;
  }

  // Extract parameters
  const pathParams = getPathParams(parameters);
  const { params: headerParams, isNullable: isHeaderParamsNullable } =
    getHeaderParams(parameters, context.config);
  const { isNullable: isQueryParamsNullable, params: queryParameters } =
    getParametersInfo(parameters, "query");

  // Create query params type
  const queryParamsTypeName = createQueryParamsType(
    context,
    serviceName,
    parameters,
  );

  // Extract body and response info
  const requestBody = getBodyContent(options.requestBody);
  const responses = getBodyContent(options.responses?.[200]);
  const contentType = getContentType(context, options.requestBody);
  const accept = getAcceptHeader(options.responses);

  // Build API object
  context.apis.push({
    contentType: contentType as ApiAST["contentType"],
    summary: options.summary,
    deprecated: options.deprecated,
    serviceName,
    queryParamsTypeName,
    pathParams,
    requestBody,
    headerParams,
    isQueryParamsNullable,
    isHeaderParamsNullable,
    responses,
    pathParamsRefString: buildPathParamsRefString(pathParams),
    endPoint,
    method: method as Method,
    security: security
      ? getConstantName(context, JSON.stringify(security))
      : "undefined",
    additionalAxiosConfig: buildAxiosConfig(
      context,
      contentType,
      accept,
      headerParams,
    ),
    queryParameters,
  });
}

/** Process all API paths */
function processApiPaths(context: GeneratorContext): void {
  Object.entries(context.input.paths).forEach(([endPoint, pathItem]) => {
    const pathLevelParams = pathItem.parameters as Parameter[] | undefined;

    Object.entries(pathItem).forEach(([method, options]) => {
      if (method === "parameters") {
        return;
      }

      processEndpointMethod(
        context,
        endPoint,
        method,
        options as SwaggerRequest,
        pathLevelParams,
      );
    });
  });
}

/** Extract types from OpenAPI components */
function extractComponentTypes(context: GeneratorContext): void {
  const { components } = context.input;

  // Extract schemas
  if (components?.schemas) {
    Object.entries(components.schemas).forEach(([name, schema]) => {
      context.types.push({ name, schema });
    });
  }

  // Extract parameters
  if (components?.parameters) {
    Object.entries(components.parameters).forEach(([key, value]) => {
      context.types.push({ ...value, name: key });
    });
  }

  // Extract request bodies
  if (components?.requestBodies) {
    Object.entries(components.requestBodies).forEach(([name, requestBody]) => {
      const schema = Object.values(requestBody.content || {})[0]?.schema;
      if (schema) {
        context.types.push({
          name: `RequestBody${name}`,
          schema,
          description: requestBody.description,
        });
      }
    });
  }
}

/** Extract body content from response or request body */
function getBodyContent(responses?: SwaggerResponse): Schema | undefined {
  if (!responses) {
    return undefined;
  }

  if (responses.content) {
    return Object.values(responses.content)[0].schema;
  }

  if (responses.$ref) {
    return { $ref: responses.$ref } as Schema;
  }

  return undefined;
}

export { generator };
