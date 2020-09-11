import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { format } from "prettier";
import { SwaggerJson, SwaggerConfig } from "./types";
import { HTTP_REQUEST, CONFIG } from "./strings";
import { getSwaggerJson } from "./getJson";
import { generator } from "./generator";

async function generate() {
  const config: SwaggerConfig = getSwaggerConfig();

  const { url, dir, prettierPath } = config;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  const prettierOptions = getPrettierOptions(prettierPath);

  try {
    const input: SwaggerJson = await getSwaggerJson(url);

    const code = generator(input, config);

    writeFileSync(`${dir}/services.ts`, format(code, prettierOptions));

    writeFileSync(
      `${dir}/httpRequest.ts`,
      format(HTTP_REQUEST, prettierOptions),
    );

    if (!existsSync(`${dir}/config.ts`)) {
      writeFileSync(`${dir}/config.ts`, format(CONFIG, prettierOptions));
    }
  } catch (error) {
    console.error(error);
  }
}

function getSwaggerConfig() {
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

function getPrettierOptions(prettierPath: string) {
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

generate();

export { generate };
