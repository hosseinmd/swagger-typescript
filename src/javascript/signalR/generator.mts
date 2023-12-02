import type { TypeAST, Schema, Parameter, Config } from "../../types.mjs";
import { generateTypes } from "../generateTypes.mjs";
import { getDefineParam } from "../utils.mjs";

export interface HubJson {
  SignalrType: string;
  info: {
    title: string;
    termsOfService?: string;
    version: string;
  };
  hubs: {
    [serviceName: string]: {
      name: string;
      operations: { [x: string]: Operation };
      callbacks: { [x: string]: Operation };
    };
  };
  definitions: { [x: string]: Schema };
}

interface Operation {
  parameters: { [x: string]: Schema };
  description?: string;
  returntype?: Schema;
}

interface ParsedOperation {
  name: string;
  parameters: { [x: string]: Parameter };
  description?: string;
}

function signalRGenerator(json: HubJson, config: Config): string {
  const types: TypeAST[] = [];
  const hubs: {
    name: string;
    operations: ParsedOperation[];
    callbacks: ParsedOperation[];
  }[] = [];

  try {
    Object.values(json.hubs).map((hub) => {
      const operations: ParsedOperation[] = [];
      const callbacks: ParsedOperation[] = [];
      Object.entries(hub.operations).map(
        //@ts-ignore
        ([_name, operation]: [string, Operation]) => {
          operations.push({
            name: _name,
            parameters: operation.parameters as any,
            description: operation.description,
          });
        },
      );

      Object.entries(hub.callbacks).map(
        //@ts-ignore
        ([_name, operation]: [string, Operation]) => {
          callbacks.push({
            name: _name,
            parameters: operation.parameters as any,
            description: operation.description,
          });
        },
      );

      hubs.push({
        name: hub.name,
        operations,
        callbacks,
      });
    });

    if (json.definitions) {
      types.push(
        ...Object.entries(json.definitions as { [x: string]: Schema }).map(
          ([name, schema]) => {
            return {
              name,
              schema,
            };
          },
        ),
      );
    }
    let code = "";
    hubs.map(({ name: hubsName, operations, callbacks }) => {
      const operationEnumsName = `${hubsName}OperationsNames`;
      const operationEnums = operations
        .map(({ name: operationKey }) => `${operationKey} = "${operationKey}"`)
        .join(",\n");

      if (operationEnums) {
        code += `
          export enum ${operationEnumsName} {
            ${operationEnums}
            }\n`;

        code += `
          export type ${hubsName}Operations = {
            ${operations
              .map(
                ({ name, parameters }) =>
                  `[${operationEnumsName}.${name}]: (${Object.entries(
                    parameters,
                  ).map(([_name, schema]) =>
                    getDefineParam(
                      _name,
                      schema.required,
                      schema as unknown as Schema,
                      config,
                      schema.description,
                    ),
                  )}) => Promise<void>`,
              )
              .join(";\n")}
            };\n`;
      }

      const callbackEnumsName = `${hubsName}CallbacksNames`;
      const callbackEnums = callbacks
        .map(({ name: callbackKey }) => `${callbackKey} = "${callbackKey}"`)
        .join(",\n");

      if (callbackEnums) {
        code += `
          export enum ${callbackEnumsName} {
            ${callbackEnums}
            }\n`;

        code += `
          export type ${hubsName}Callbacks = {
            ${callbacks
              .map(
                ({ name, parameters }) =>
                  `[${callbackEnumsName}.${name}]: (${Object.entries(
                    parameters,
                  ).map(([_name, schema]) =>
                    getDefineParam(
                      _name,
                      schema.required,
                      schema as unknown as Schema,
                      config,
                      schema.description,
                    ),
                  )}) => void`,
              )
              .join(";\n")}
            };\n`;
      }

      code += `
      export interface ${hubsName} {
        ${
          callbackEnums
            ? `
          callbacksName: ${callbackEnumsName};
          callbacks: ${hubsName}Callbacks;
        `
            : ""
        }
        ${
          operationEnums
            ? `
          methodsName: ${operationEnumsName};
          methods: ${hubsName}Operations;
        `
            : ""
        }
      }
      `;
    });
    code += generateTypes(types, config);

    return code;
  } catch (error) {
    console.error({ error });
    return "";
  }
}

export { signalRGenerator };
