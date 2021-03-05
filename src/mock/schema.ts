import { OpenAPIObject, SchemaObject } from "openapi3-ts";
import { getSchemaData } from "./parse";

export type Schemas = {
  [schema: string]: SchemaObject;
};

export const extractSchemas = (obj: OpenAPIObject): Schemas => {
  const { components } = obj;
  const schemas = components && components.schemas ? components.schemas : {};
  return Object.keys(schemas).reduce((acc: any, name: string) => {
    acc[name] = getSchemaData(schemas, name);
    return acc;
  }, {});
};
