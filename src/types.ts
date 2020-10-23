export interface Schema {
  title?: string;
  nullable?: boolean;
  type: "object" | "array" | "string";
  items?: Schema;
  maxLength?: number,
  max?: number,
  min?: number,
  pattern?: string,
  format?: "int64" | "binary" | "date-time" | "date";
  additionalProperties?: Schema;
  properties?: { [name: string]: Schema };
  description?: string;
  example?: string;
  "x-enumNames"?: ["Rial"];
  deprecated?: boolean;
  "x-deprecatedMessage"?: string;
  enum?: string[];
  $ref?: string;
  allOf?: Schema[];
  oneOf?: Schema[];
  required?: string[];
}

export type Parameter = {
  /**
   * The name of the parameter. Parameter names are case sensitive. If in is
   * "path", the name field MUST correspond to a template expression occurring
   * within the path field in the Paths Object. See Path Templating for further
   * information. If in is "header" and the name field is "Accept",
   * "Content-Type" or "Authorization", the parameter definition SHALL be
   * ignored. For all other cases, the name corresponds to the parameter name
   * used by the in property.
   */
  name: string;
  /** The location of the parameter. */
  in: "query" | "header" | "cookie" | "path";
  /**
   * Determines whether this parameter is mandatory. If the parameter location
   * is "path", this property is REQUIRED and its value MUST be true.
   * Otherwise, the property MAY be included and its default value is false.
   */
  required?: boolean; // true;
  /** The schema defining the type used for the parameter. */
  schema: Schema;
  $ref?: string;
  /**
   * A brief description of the parameter. This could contain examples of use.
   * CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of
   * usage. Default value is false.
   */
  deprecated?: boolean;
};

export interface SwaggerResponse {
  $ref?: string;
  description?: string;
  content?: {
    "application/json": {
      schema: Schema;
    };
  };
}

export interface SwaggerRequest {
  tags: string[]; // ["Account"];
  summary: string; // "Get user account balance";
  operationId: string; // "Account_GetBalance";
  parameters?: Parameter[];
  requestBody?: SwaggerResponse;
  responses: { [x: string]: SwaggerResponse };
  deprecated: boolean;
  security: [
    {
      "JWT token": [];
    },
  ];
}

export interface SwaggerSchemas {
  [x: string]: Schema;
}

export interface SwaggerJson {
  openapi: string;
  tags: { name: string }[]
  paths: {
    [url: string]: SwaggerRequest;
  };
  components?: {
    schemas?: SwaggerSchemas;
    parameters?: { [x: string]: Parameter };
    requestBodies?: { [x: string]: SwaggerResponse };
  };
}

export interface SwaggerConfig {
  url: string;
  dir: string;
  prettierPath: string;
  language: "javascript" | "typescript";
  ignore: {
    headerParams: string[];
  };
}

export type ApiAST = {
  tags: string[],
  summary: string;
  deprecated: boolean;
  serviceName: string;
  pathParams: Parameter[];
  requestBody: Schema | undefined;
  queryParamsTypeName: string | false;
  headerParams: string;
  isQueryParamsNullable: boolean;
  isHeaderParamsNullable: boolean;
  responses: Schema | undefined;
  pathParamsRefString: string | undefined;
  endPoint: string;
  contentType: string;
  accept: string;
  method: string;
};

export type TypeAST = {
  name: string;
  schema: Schema;
  description?: string;
};

export type JsdocAST = {
  title?: string;
  description?: string;
  format?: string,
  pattern?: string,
  maxLength?: number,
  min?: number,
  max?: number,
  tags?: {
    deprecated?: {
      value: boolean;
      description?: string;
    };
    example?: string;
  };
};
