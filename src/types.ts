export interface Schema {
  type: string;
  format: "int64" | "binary";
  nullable: boolean;
  additionalProperties: false;
  properties: { [name: string]: Schema };
  description: string;
  "x-enumNames": ["Rial"];
  enum: string[];
  $ref: string;
  items: Schema;
  allOf: Schema[];
}

export interface Parameter {
  name: string; // "id";
  in: "path" | "query" | "header"; // "path";
  required: boolean; // true;
  schema: Schema;
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
  };
}
