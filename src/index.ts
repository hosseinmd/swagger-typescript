import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
} from "fs";
import { format } from "prettier";
import { SwaggerJson, SwaggerConfig } from "./types";
import { HTTP_REQUEST, CONFIG } from "./strings";
import { getJson } from "./getJson";
import { generator } from "./generator";
import { build } from "tsc-prog";
import { majorVersionsCheck } from "./utils";
import { HubJson, signalRGenerator } from "./signalR/generator";
import { swaggerToOpenApi } from "./utilities/swaggerToOpenApi";
import { generateMock } from "./mock";
import chalk from "chalk";
import { partialUpdateJson } from "./updateJson";

/** @param config If isn't defined will be use swagger.config.json instead */
async function generate(config?: SwaggerConfig, cli?: Partial<SwaggerConfig>) {
  config = config ?? getSwaggerConfig();

  config = { ...config, ...cli };

  const {
    url,
    hub,
    dir,
    prettierPath,
    language,
    mock,
    tag,
    //@ts-ignore
    __unstable_is_legacy_properties,
    keepJson,
  } = config;
  //@ts-ignore
  global.__unstable_is_legacy_properties = __unstable_is_legacy_properties;

  const isToJs = language === "javascript";

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  const prettierOptions = getPrettierOptions(prettierPath);

  try {
    if (url) {
      let input: SwaggerJson = await getJson(url);

      if (input.swagger) {
        majorVersionsCheck("2.0.0", input.swagger);
        // convert swagger v2 to openApi v3
        input = await swaggerToOpenApi(input);
      } else {
        majorVersionsCheck("3.0.0", input.openapi);
      }

      if (keepJson) {
        const swaggerJsonPath = `${dir}/swagger.json`;
        if (!tag) {
          writeFileSync(swaggerJsonPath, JSON.stringify(input));
          formatFile(swaggerJsonPath, prettierOptions);
        } else {
          try {
            const old = readFileSync(swaggerJsonPath).toString();
            if (old) {
              const oldJson = JSON.parse(old);

              input = partialUpdateJson(oldJson, input, tag);
            }
          } catch {
            chalk.red(
              "swagger.json file not found. You should set keepJson true to save json then run swag-ts without tag to save that",
            );
          }
        }
      }

      const code = generator(input, config);

      if (mock) {
        generateMock(input, config);
      }

      writeFileSync(`${dir}/services.ts`, code);

      writeFileSync(`${dir}/httpRequest.ts`, HTTP_REQUEST);

      if (!existsSync(`${dir}/config.${isToJs ? "js" : "ts"}`)) {
        writeFileSync(
          `${dir}/config.ts`,
          CONFIG.replace(
            "${AUTO_REPLACE_BASE_URL}",
            input.servers?.[0].url || "",
          ),
        );
      }
      console.log(chalk.yellowBright("services Completed"));
    }

    // signalR hub definition
    let hubCode = null;
    if (hub) {
      const hubJson: HubJson = hub ? await getJson(hub) : null;

      hubCode = signalRGenerator(hubJson);
      hubCode && writeFileSync(`${dir}/hub.ts`, hubCode);

      console.log(chalk.yellowBright("hub Completed"));
    }

    if (isToJs) {
      convertTsToJs(dir);
      if (hubCode) {
        formatFile(`${dir}/hub.js`, prettierOptions);
        formatFile(`${dir}/hub.d.ts`, prettierOptions);
      }

      if (url) {
        formatFile(`${dir}/config.js`, prettierOptions);
        formatFile(`${dir}/httpRequest.js`, prettierOptions);
        formatFile(`${dir}/services.js`, prettierOptions);
        formatFile(`${dir}/config.d.ts`, prettierOptions);
        formatFile(`${dir}/httpRequest.d.ts`, prettierOptions);
        formatFile(`${dir}/services.d.ts`, prettierOptions);
      }
    } else {
      if (hubCode) {
        formatFile(`${dir}/hub.ts`, prettierOptions);
      }

      if (url) {
        formatFile(`${dir}/config.ts`, prettierOptions);
        formatFile(`${dir}/httpRequest.ts`, prettierOptions);
        formatFile(`${dir}/services.ts`, prettierOptions);
      }
    }
    console.log(chalk.greenBright("All Completed"));
  } catch (error) {
    console.log(chalk.redBright(error));
    console.log(chalk.redBright("failed"));
  }
}

function formatFile(filePath: string, prettierOptions: any) {
  const code = readFileSync(filePath).toString();
  writeFileSync(filePath, format(code, prettierOptions));
}

function convertTsToJs(dir: string) {
  build({
    basePath: ".", // always required, used for relative paths
    compilerOptions: {
      listFiles: true,
      outDir: dir,
      declaration: true,
      skipLibCheck: true,
      module: "esnext",
      target: "esnext",
      lib: ["esnext"],
    },
    files: [`${dir}/services.ts`, `${dir}/hub.ts`],
  });

  if (existsSync(`${dir}/config.ts`)) {
    rmdirSync(`${dir}/config.ts`, { recursive: true });
  }

  if (existsSync(`${dir}/services.ts`)) {
    rmdirSync(`${dir}/services.ts`, { recursive: true });
  }

  if (existsSync(`${dir}/httpRequest.ts`)) {
    rmdirSync(`${dir}/httpRequest.ts`, { recursive: true });
  }

  if (existsSync(`${dir}/hub.ts`)) {
    rmdirSync(`${dir}/hub.ts`, { recursive: true });
  }
}

function getSwaggerConfig(): SwaggerConfig {
  try {
    const config = JSON.parse(readFileSync("swagger.config.json").toString());

    if (!config) {
      throw "";
    }

    return config;
  } catch (error) {
    try {
      return JSON.parse(readFileSync("./swaggerConfig.json").toString()); // backward compatible for  v1
    } catch {
      throw new Error("Please define swagger.config.json");
    }
  }
}

function getPrettierOptions(prettierPath?: string) {
  let prettierOptions: any = {};
  if (prettierPath && existsSync(prettierPath)) {
    prettierOptions = JSON.parse(readFileSync(prettierPath).toString());
  } else {
    if (existsSync(".prettierrc")) {
      prettierOptions = JSON.parse(readFileSync(".prettierrc").toString());
    } else if (existsSync("prettier.json")) {
      prettierOptions = JSON.parse(readFileSync("prettier.json").toString());
    }
  }

  if (!prettierOptions.parser) {
    prettierOptions.parser = "typescript";
  }

  return prettierOptions;
}

export { generate };
