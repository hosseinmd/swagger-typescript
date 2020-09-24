import { getJsdoc, getTsType, isAscending } from "./utils";
import type { TypeAST } from "./types";

function generateTypes(types: TypeAST[]): string {
  try {
    return types
      .sort(({ name }, { name: _name }) => isAscending(name, _name))
      .reduce((prev, { name, schema, description }) => {
        const { type, enum: Enum, allOf, oneOf, items } = schema;
        if (type === "object") {
          const typeObject = getTsType(schema);

          prev += `
        export interface ${name} ${typeObject}
        `;
        }

        if (Enum) {
          prev += `
         ${getJsdoc({ description })}export enum ${name} {${Enum.map(
            (e) => `${e}=${typeof e === "string" ? `"${e}"` : ""}`,
          )}}
         `;
        }

        if (allOf) {
          prev += `
        export interface ${name} extends ${allOf
            .map((_schema) => getTsType(_schema))
            .join(" ")}
                `;
        }
        if (oneOf) {
          prev += `
        export type ${name} = ${oneOf
            .map((_schema) => getTsType(_schema))
            .join(" | ")}
                `;
        }
        if (type === "array" && items) {
          prev += `
        export type ${name} = ${getTsType(items)}`;
        }

        return prev;
      }, "");
  } catch (error) {
    console.error({ error });
    return "";
  }
}

export { generateTypes };
