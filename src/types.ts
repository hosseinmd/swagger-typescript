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
}

export interface Parameter {
  name: string; // "id";
  in: "path" | "query"; // "path";
  required: boolean; // true;
  schema: Schema;
  "x-position": number;
}

export interface SwaggerRequest {
  tags: string; // ["Account"];
  summary: string; // "Get user account balance";
  operationId: string; // "Account_GetBalance";
  parameters?: Parameter[];
  requestBody?: {
    "x-name"?: "model";
    content: {
      "multipart/form-data": {
        schema: Schema;
      };
      "application/json": {
        schema: Schema;
      };
    };
    required?: true;
    "x-position"?: 1;
  };
  responses2: {
    "200": {
      description: "";
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AccountBalanceSummaryQuery";
          };
        };
      };
    };
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
