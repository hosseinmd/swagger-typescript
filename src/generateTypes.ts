import { getJsdoc, getRefName, getTsType, isAscending } from "./utils";
import type { Schema, TypeAST } from "./types";

function generateTypes(types: TypeAST[]): string {
  try {
    return types
      .sort(({ name }, { name: _name }) => isAscending(name, _name))
      .reduce((prev, { name, schema, description }) => {
        prev += getTypeDefinition(name, schema, description);

        return prev;
      }, "");
  } catch (error) {
    console.error({ error });
    return "";
  }
}

function getTypeDefinition(name: string, schema: Schema, description?: string) {
  const { type, enum: Enum, allOf, oneOf, items, $ref } = schema;
  if (type === "object") {
    const typeObject = getTsType(schema);

    return `
  export interface ${name} ${typeObject}
  `;
  }

  if (Enum) {
    return `
   ${getJsdoc({ description })}export enum ${name} {${Enum.map(
      (e) => `${e}=${typeof e === "string" ? `"${e}"` : ""}`,
    )}}
   `;
  }

  if (allOf) {
    return `
  export interface ${name} extends ${allOf
      .map((_schema) => getTsType(_schema))
      .join(" ")}
          `;
  }
  if (oneOf) {
    return `
  export type ${name} = ${oneOf
      .map((_schema) => getTsType(_schema))
      .join(" | ")}
          `;
  }
  if (type === "array" && items) {
    return `
  export type ${name} = ${getTsType(items)}[]`;
  }

  if ($ref) {
    return `
  export type ${name} = ${getRefName($ref)}`;
  }

  return "";
}

export { generateTypes };
