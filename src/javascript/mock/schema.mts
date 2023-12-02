import { Schema, SwaggerJson } from "../../types.mjs";
import { getSchemaData } from "./parse.mjs";

export type Schemas = {
  [schema: string]: Schema;
};

export const extractSchemas = (obj: SwaggerJson): Schemas => {
  const { components } = obj;
  const schemas = components && components.schemas ? components.schemas : {};
  return Object.keys(schemas).reduce((acc: any, name: string) => {
    acc[name] = getSchemaData(schemas, name);
    return acc;
  }, {});
};
