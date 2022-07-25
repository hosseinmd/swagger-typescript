import type { ConstantsAST } from "../types";
import { isAscending } from "../utils";

function generateConstants(types: ConstantsAST[]): string {
  try {
    return types
      .sort(({ name }, { name: _name }) => isAscending(name, _name))
      .reduce((prev, { name, value }) => {
        prev += `export const ${name} = ${value};`;

        return prev;
      }, "");
  } catch (error) {
    console.error({ error });
    return "";
  }
}

export { generateConstants };
