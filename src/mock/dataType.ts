import { SchemaObject, ReferenceObject } from "openapi3-ts";

export enum DataType {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
  array = "array",
  object = "object",
}

export namespace DataType {
  export function defaultValue(schema: SchemaObject): any {
    if (schema.example) {
      return schema.example;
    }
    switch (schema.type) {
      case DataType.string:
        return getStringDefaultValue(schema);
      case DataType.number:
      case DataType.integer:
        return 0;
      case DataType.boolean:
        return true;
      case DataType.array:
        return [];
      case DataType.object:
        return {};
      default:
        return {};
    }
  }

  export function getStringDefaultValue(schema: SchemaObject): string {
    if (schema.format) {
      switch (schema.format) {
        case "date":
          return "2017-07-21";
        case "date-time":
          return "2017-07-21T17:32:28Z";
        case "password":
          return "password";
        case "byte":
          return "U3dhZ2dlciByb2Nrcw==";
        case "binary":
          return "binary";
        default:
          return "";
      }
    }
    // TODO: pattern support
    return "";
  }
}

export const isArray = (
  property: SchemaObject,
): property is SchemaObject & { items: SchemaObject | ReferenceObject } => {
  return property.type === DataType.array;
};

export const isObject = (
  schema: SchemaObject,
): schema is SchemaObject & { type: "object" } => {
  return schema.type === DataType.object || schema.properties !== undefined;
};

export const isAllOf = (
  schema: SchemaObject,
): schema is SchemaObject & { allOf: (SchemaObject | ReferenceObject)[] } => {
  return schema.allOf !== undefined;
};

export const isOneOf = (
  schema: SchemaObject,
): schema is SchemaObject & { oneOf: (SchemaObject | ReferenceObject)[] } => {
  return schema.oneOf !== undefined;
};

export const isAnyOf = (
  schema: SchemaObject,
): schema is SchemaObject & { anyOf: (SchemaObject | ReferenceObject)[] } => {
  return schema.anyOf !== undefined;
};

export const isReferenceObject = (
  schema: SchemaObject | ReferenceObject,
): schema is ReferenceObject => {
  return "$ref" in schema;
};
