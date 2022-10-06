import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { SwaggerJson, SwaggerConfig, Config } from "./types.mjs";
import { getJson } from "./getJson.mjs";
import { generateJavascriptService } from "./javascript/index.mjs";
import { getCurrentUrl, majorVersionsCheck } from "./utils.mjs";
import { swaggerToOpenApi } from "./utilities/swaggerToOpenApi.mjs";
import chalk from "chalk";
import { partialUpdateJson } from "./updateJson.mjs";
import { default as postmanToOpenApi } from "postman-to-openapi";
import yaml from "js-yaml";
import path from "path";

/** @param config If isn't defined will be use swagger.config.json instead */
async function generate(config?: SwaggerConfig, cli?: Partial<Config>) {
  config = config ?? getSwaggerConfig();
  const configs = Array.isArray(config) ? config : [config];
  for (const con of configs) {
    await generateService(con, cli);
  }
}

const generateService = async (config: Config, cli?: Partial<Config>) => {
  config = {
    ...config,
    tag: cli?.tag ?? config.tag,
    local: cli?.local ?? config.local,
    branch: cli?.branch ?? config.branch,
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
      // case "CSharp": {
      //   await generateCSharpService(config, input);

      //   break;
      // }
      default:
        await generateJavascriptService(config, input);
        break;
    }
  } catch (error) {
    console.log(chalk.redBright(error));
    console.log(chalk.redBright("failed"));
  }
};

function getSwaggerConfig(): SwaggerConfig {
  try {
    const configPath = path.join(process.cwd(), "swagger.config.json");

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
