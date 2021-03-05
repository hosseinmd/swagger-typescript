import { Schema } from "../types";

let guid = 0;

export enum DataType {
  string = "string",
  number = "number",
  integer = "integer",
  boolean = "boolean",
  array = "array",
  object = "object",
}

export namespace DataType {
  export function defaultValue(schema: Schema): any {
    if (schema.example) {
      return schema.example;
    }
    switch (schema.type) {
      case DataType.string:
        return getStringDefaultValue(schema);
      case DataType.number:
      case DataType.integer:
        return schema.minimum || schema.maximum || 0;
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

  export function getStringDefaultValue(schema: Schema): string {
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
        case "binary":
          return "binary";
        case "guid":
        case "uuid":
          return `3ba89b92-8c02-4e5a-9843-${guid++}`;
        default:
          return "";
      }
    }
    // TODO: pattern support
    return "";
  }
}

export const isArray = (
  property: Schema,
): property is Schema & { items: Schema } => {
  return property.type === DataType.array;
};

export const isObject = (
  schema: Schema,
): schema is Schema & { type: "object" } => {
  return schema.type === DataType.object || schema.properties !== undefined;
};

export const isAllOf = (
  schema: Schema,
): schema is Schema & { allOf: Schema[] } => {
  return schema.allOf !== undefined;
};

export const isOneOf = (
  schema: Schema,
): schema is Schema & { oneOf: Schema[] } => {
  return schema.oneOf !== undefined;
};

export const isAnyOf = (
  schema: Schema,
): schema is Schema & { anyOf: Schema[] } => {
  return schema.anyOf !== undefined;
};

export const isReferenceObject = (
  schema: Schema,
): schema is Schema & { $ref: string } => {
  return "$ref" in schema;
};
