type DataType =
  /** This includes dates and files */
  "string" | "number" | "integer" | "boolean" | "array" | "object";

export interface Schema {
  title?: string;
  nullable?: boolean;
  maxLength?: number;
  max?: number;
  min?: number;
  pattern?: string;
  type: DataType;
  /**
   * An array of arbitrary types can be defined as:
   *
   *     Type: array
   *     items: {}
   */
  items?: Schema | {};

  /**
   * Files are defined as strings: "binary" | "byte"
   *
   *     - integer int32	signed 32 bits
   *     - integer int64	signed 64 bits (a.k.a long)
   *     - number float
   *     - number double
   *     - string
   *     - string byte	base64 encoded characters
   *     - string binary	any sequence of octets
   *     - boolean
   *     - string date	As defined by full-date - RFC3339
   *     - string date-time	As defined by date-time - RFC3339
   *     - string password	A hint to UIs to obscure input.
   */
  format?:
    | "int32"
    | "int64"
    | "float"
    | "double"
    | "byte"
    | "binary"
    | "date"
    | "date"
    | "password";
  /**
   * A free-form object (arbitrary property/value pairs) is defined as:
   *
   *     Type: object
   *     additionalProperties: {}
   *     Or additionalProperties: true
   */
  additionalProperties?: Schema | true | {};
  properties?: { [name: string]: Schema };
  /**
   * By default, all object properties are optional. You can specify the
   * required properties in the required list:
   */
  required?: string[];
  description?: string;
  example?: string;
  "x-enumNames"?: ["Rial"];
  deprecated?: boolean;
  "x-deprecatedMessage"?: string;
  enum?: string[];
  $ref?: string;
  allOf?: Schema[];
  oneOf?: Schema[];
  /** Is something link oneOf */
  anyOf?: Schema[];
  /**
   * Use the minimum and maximum keywords to specify the range of possible
   * values:
   *
   *     Type: integer
   *     minimum: 1
   *     maximum: 20
   *
   * By default, the minimum and maximum values are included in the range, that
   * is:
   *
   *     Minimum ≤ value ≤ maximum
   *
   * To exclude the boundary values, specify exclusiveMinimum: true and
   * exclusiveMaximum: true. For example, you can define a floating-point
   * number range as 0–50 and exclude the 0 value:
   */
  minimum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  maximum?: number;

  /**
   * A schema without a type matches any data type – numbers, strings, objects,
   * and so on. {} is shorthand syntax for an arbitrary-type schema:
   *
   * @example
   *   components: {
   *     schemas: {
   *       AnyValue: {
   *       }
   *     }
   *   }
   */
  AnyValue?: {
    nullable?: boolean;
    description?: string;
  };
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
  summary?: string; // "Get user account balance";
  operationId?: string; // "Account_GetBalance";
  parameters?: Parameter[];
  requestBody?: SwaggerResponse;
  responses: { [x: string]: SwaggerResponse };
  deprecated?: boolean;
  security?: any[];
}

export interface SwaggerSchemas {
  [x: string]: Schema;
}

export interface SwaggerJson {
  openapi: string;
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
  methodName: string;
  ignore: {
    headerParams: string[];
  };
}

export type ApiAST = {
  summary: string | undefined;
  deprecated: boolean | undefined;
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
  method: string;
  security: string;
  additionalAxiosConfig: string;
};

export type TypeAST = {
  name: string;
  schema: Schema;
  description?: string;
};

export type JsdocAST = {
  description?: string;
  tags?: {
    deprecated?: {
      value: boolean;
      description?: string;
    };
    example?: string;
  };
};

export type ConstantsAST = { value: string; name: string };
