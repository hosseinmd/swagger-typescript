import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
} from "fs";
import { format } from "prettier";
import { SwaggerJson, SwaggerConfig, Config } from "./types";
import { HTTP_REQUEST, CONFIG, FILE_HOOKS_CONFIG } from "./strings";
import { getJson } from "./getJson";
import { generator } from "./generator";
import { build } from "tsc-prog";
import { getCurrentUrl, majorVersionsCheck } from "./utils";
import { HubJson, signalRGenerator } from "./signalR/generator";
import { swaggerToOpenApi } from "./utilities/swaggerToOpenApi";
import { generateMock } from "./mock";
import chalk from "chalk";
import { partialUpdateJson } from "./updateJson";
//@ts-ignore
import recursive from "recursive-readdir";

/** @param config If isn't defined will be use swagger.config.json instead */
async function generate(config?: SwaggerConfig, cli?: Partial<Config>) {
  config = config ?? getSwaggerConfig();
  const configs = Array.isArray(config) ? config : [config];
  configs.forEach((con) => {
    generateService(con, cli);
  });
}

const generateService = async (config: Config, cli?: Partial<Config>) => {
  config = {
    ...config,
    tag: cli?.tag ?? config.tag,
    local: cli?.local ?? config.local,
    branch: cli?.branch ?? config.branch,
  };

  const {
    url,
    hub,
    dir,
    prettierPath,
    language,
    mock,
    tag,
    keepJson,
    reactHooks,
    local,
  } = config;

  const isToJs = language === "javascript";

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  const prettierOptions = getPrettierOptions(prettierPath);

  try {
    const swaggerJsonPath = `${dir}/swagger.json`;

    let input: SwaggerJson;

    if (local) {
      input = getLocalJson(dir);
    } else {
      if (!url) {
        throw new Error("Add url in swagger.config.json ");
      }

      if (typeof url === "string") {
        input = await getJson(url);
      } else {
        input = await getJson(await getCurrentUrl(config));
      }

      if (input.swagger) {
        majorVersionsCheck("2.0.0", input.swagger);
        // convert swagger v2 to openApi v3
        config._isSwagger2 = true;
        input = await swaggerToOpenApi(input);
      } else {
        majorVersionsCheck("3.0.0", input.openapi);
      }
    }

    if (keepJson) {
      try {
        if (!tag?.length) {
          writeFileSync(swaggerJsonPath, JSON.stringify(input));
        } else {
          const oldJson = getLocalJson(dir);

          input = partialUpdateJson(oldJson, input, tag);
          writeFileSync(swaggerJsonPath, JSON.stringify(input));
        }
      } catch (error) {
        chalk.red(error);
        chalk.red("keepJson failed");
      }
    }

    const { code, hooks, type } = generator(input, config);

    if (mock) {
      generateMock(input, config);
    }

    writeFileSync(`${dir}/services.ts`, code);
    console.log(chalk.yellowBright("services Completed"));

    writeFileSync(`${dir}/types.ts`, type);
    console.log(chalk.yellowBright("types Completed"));

    if (reactHooks && hooks) {
      writeFileSync(`${dir}/hooks.ts`, hooks);
      if (!existsSync(`${dir}/hooksConfig.${isToJs ? "js" : "ts"}`)) {
        writeFileSync(`${dir}/hooksConfig.ts`, FILE_HOOKS_CONFIG);
      }
      console.log(chalk.yellowBright("hooks Completed"));
    }

    writeFileSync(`${dir}/httpRequest.ts`, HTTP_REQUEST);
    console.log(chalk.yellowBright("httpRequest Completed"));

    if (!existsSync(`${dir}/config.${isToJs ? "js" : "ts"}`)) {
      writeFileSync(
        `${dir}/config.ts`,
        CONFIG.replace(
          "${AUTO_REPLACE_BASE_URL}",
          input.servers?.[0]?.url || "",
        ),
      );
      console.log(chalk.yellowBright("config Completed"));
    }

    // signalR hub definition
    let hubCode = null;
    if (hub) {
      const hubJson: HubJson = hub ? await getJson(hub) : null;

      hubCode = signalRGenerator(hubJson, config);
      hubCode && writeFileSync(`${dir}/hub.ts`, hubCode);

      console.log(chalk.yellowBright("hub Completed"));
    }

    if (isToJs) {
      const files = [
        hubCode && "hub",
        ...(url || local
          ? [
              ...(reactHooks ? ["hooks", "hooksConfig"] : []),
              "config",
              "httpRequest",
              "services",
              "types",
            ]
          : []),
      ].filter(Boolean) as string[];
      convertTsToJs(dir, files);
    }

    recursive(dir, function (err: Error | null, files: any[]) {
      if (err) {
        console.log(chalk.redBright(Error));
        return;
      }
      files.forEach((file) => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
          formatFile(file, prettierOptions);
        }
        if (file.endsWith(".json")) {
          formatFile(file, { ...prettierOptions, parser: "json" });
        }
      });
    });
    console.log(chalk.greenBright("All Completed"));
  } catch (error) {
    console.log(chalk.redBright(error));
    console.log(chalk.redBright("failed"));
  }
};

function formatFile(filePath: string, prettierOptions: any) {
  const code = readFileSync(filePath).toString();
  writeFileSync(filePath, format(code, prettierOptions));
}

function convertTsToJs(dir: string, files: string[]) {
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
    files: files.map((file) => `${dir}/${file}.ts`),
  });

  files.forEach((file) => {
    if (existsSync(`${dir}/${file}.ts`)) {
      rmdirSync(`${dir}/${file}.ts`, { recursive: true });
    }
  });
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

function getLocalJson(dir: string) {
  const swaggerJsonPath = `${dir}/swagger.json`;

  try {
    const old = readFileSync(swaggerJsonPath).toString();
    return JSON.parse(old);
  } catch (error) {
    chalk.red(
      "swagger.json file not found. You should set keepJson true to save json then run swag-ts without tag to save that",
    );
    throw error;
  }
}

export { generate };
