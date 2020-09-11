import { getTsType } from "./utils";
import type { TypeAST } from "./types";

function generateTypes(types: TypeAST[]): string {
  try {
    return types.reduce((prev, { name, schema }) => {
      const { type, enum: Enum, allOf, oneOf } = schema;
      if (type === "object") {
        const typeObject = getTsType(schema);

        prev += `
export interface ${name} ${typeObject}
        `;
      }
      if (Enum) {
        prev += `
export enum ${name} {${Enum.map(
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
      return prev;
    }, "");
  } catch (error) {
    console.error({ error });
    return "";
  }
}

export { generateTypes };
