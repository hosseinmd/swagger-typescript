export interface Schema {
  type?: string;
  title?: string;
  nullable?: boolean;
  format?: "int64" | "binary";
  additionalProperties?: Schema;
  properties?: { [name: string]: Schema };
  description?: string;
  example?: string;
  "x-enumNames"?: ["Rial"];
  deprecated?: boolean;
  "x-deprecatedMessage"?: string;
  enum?: string[];
  $ref?: string;
  items?: Schema;
  allOf?: Schema[];
  oneOf?: Schema[];
}

export interface Parameter {
  name: string; // "id";
  in: "path" | "query" | "header"; // "path";
  required: boolean; // true;
  schema: Schema;
  $ref: string;
  description?: string;
  "x-position": number;
}

export interface SwaggerResponse {
  description: "";
  content: {
    "application/json": {
      schema: Schema;
    };
  };
}

export interface SwaggerRequest {
  tags: string; // ["Account"];
  summary: string; // "Get user account balance";
  operationId: string; // "Account_GetBalance";
  parameters?: Parameter[];
  requestBody?: SwaggerResponse;
  responses: {
    "200": SwaggerResponse;
  };
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
  paths: {
    [url: string]: SwaggerRequest;
  };
  components: {
    schemas: SwaggerSchemas;
    parameters: { [x: string]: Parameter };
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
  tags?: {
    deprecated?: {
      value: boolean;
      description?: string;
    };
    example?: string;
  };
};
