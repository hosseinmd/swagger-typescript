import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import {
  SwaggerJson,
  SwaggerConfig,
  Config,
  CLIConfig,
  FileConfig,
} from "./types.mjs";
import { getJson } from "./getJson.mjs";
import { generateJavascriptService } from "./javascript/index.mjs";
import { getCurrentUrl, majorVersionsCheck } from "./utils.mjs";
import { swaggerToOpenApi } from "./utilities/swaggerToOpenApi.mjs";
import chalk from "chalk";
import { partialUpdateJson } from "./updateJson.mjs";
import { default as postmanToOpenApi } from "postman-to-openapi";
import yaml from "js-yaml";
import path from "path";
import { generateKotlinService } from "./kotlin/index.mjs";

/** @param config If isn't defined will be use swagger.config.json instead */
async function generate(config?: SwaggerConfig, cli?: Partial<CLIConfig>) {
  config = config ?? getSwaggerConfig(cli);
  const configs = Array.isArray(config) ? config : [config];
  for (const con of configs) {
    await generateService(con, cli);
  }
}

const generateService = async (
  _config: FileConfig,
  cli?: Partial<CLIConfig>,
) => {
  const config: Config = {
    ..._config,
    tag: cli?.tag ?? _config.tag,
    local: cli?.local ?? _config.local,
    branch: cli?.branch ?? _config.branch,
    config: cli?.config,
  };

  const { url, dir, tag, keepJson, local } = config;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

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
        input = await swaggerToOpenApi(input);
      } else if (input.openapi) {
        majorVersionsCheck("3.0.0", input.openapi);
      } else {
        input = yaml.load(
          await postmanToOpenApi(JSON.stringify(input), undefined),
        ) as SwaggerJson;
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
        console.log(chalk.red(error));
        console.log(chalk.red("keepJson failed"));
      }
    }
    switch (config.language) {
      case "kotlin": {
        await generateKotlinService(config, input);

        break;
      }
      default:
        await generateJavascriptService(config, input);
        break;
    }
  } catch (error) {
    console.log(chalk.redBright(error));
    console.log(chalk.redBright("failed"));
  }
};

function getSwaggerConfig(cli?: CLIConfig): SwaggerConfig {
  try {
    const isAbsolutePath = cli?.config?.startsWith("/");

    let rawPath = cli?.config || "";
    rawPath = rawPath.endsWith(".json")
      ? rawPath
      : path.join(rawPath, "swagger.config.json");

    const configPath = path.join(isAbsolutePath ? "" : process.cwd(), rawPath);

    console.log(chalk.grey(`Your config path: ${configPath}`));

    const config = JSON.parse(readFileSync(configPath).toString());

    if (!config) {
      throw "";
    }

    return config;
  } catch (error) {
    throw new Error("Please define swagger.config.json");
  }
}

function getLocalJson(dir: string) {
  const swaggerJsonPath = `${dir}/swagger.json`;

  try {
    return readJson(swaggerJsonPath);
  } catch (error) {
    console.log(
      chalk.red(
        "swagger.json file not found. You should set keepJson true to save json then run swag-ts without tag to save that",
      ),
    );
    throw error;
  }
}

function readJson(path: string) {
  const old = readFileSync(path).toString();
  return JSON.parse(old);
}

export { generate };
