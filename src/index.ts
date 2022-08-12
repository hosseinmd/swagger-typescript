import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { SwaggerJson, SwaggerConfig, Config } from "./types";
import { getJson } from "./getJson";
import { generateJavascriptService } from "./javascript";
import { getCurrentUrl, majorVersionsCheck } from "./utils";
import { swaggerToOpenApi } from "./utilities/swaggerToOpenApi";
import chalk from "chalk";
import { partialUpdateJson } from "./updateJson";

/** @param config If isn't defined will be use swagger.config.json instead */
async function generate(config?: SwaggerConfig, cli?: Partial<Config>) {
  config = config ?? getSwaggerConfig();
  const configs = Array.isArray(config) ? config : [config];
  for(const con of configs){
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
