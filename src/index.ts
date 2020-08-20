import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { format } from "prettier";
import { SwaggerJson, SwaggerConfig } from "./types";
import { HTTP_REQUEST, CONFIG } from "./strings";
import { getSwaggerJson } from "./getJson";
import { generator } from "./generator";

function getParam(name: string): string {
  name += "=";
  const index = process.argv.findIndex((v) => v.startsWith(name));

  return process.argv[index]?.substring(name.length);
}

async function generate() {
  const configUrl = getParam("config") || "./swaggerConfig.json";
  let config: SwaggerConfig;

  try {
    config = JSON.parse(readFileSync(configUrl).toString());

    if (!config) {
      throw "";
    }
  } catch (error) {
    console.log(error);
    throw new Error("Please define swaggerConfig.json");
  }

  const { url, dir, prettierPath } = config;

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  let prettierOptions;

  if (prettierPath && existsSync(prettierPath)) {
    prettierOptions = JSON.parse(readFileSync(prettierPath).toString());
  } else {
    if (existsSync(".prettierrc")) {
      prettierOptions = JSON.parse(readFileSync(".prettierrc").toString());
    } else {
      prettierOptions = JSON.parse(readFileSync("prettier.json").toString());
    }
  }

  try {
    const input: SwaggerJson = await getSwaggerJson(url);

    const code = generator(input, config);

    writeFileSync(`${dir}/services.ts`, format(code, prettierOptions as any));

    writeFileSync(
      `${dir}/httpRequest.ts`,
      format(HTTP_REQUEST, prettierOptions as any),
    );

    if (!existsSync(`${dir}/config.ts`)) {
      writeFileSync(`${dir}/config.ts`, format(CONFIG, prettierOptions as any));
    }
  } catch (error) {
    console.log({ error });
  }
}

generate();

export { generate };
