/** Is A fork from https://github.com/yayoc/swagger-to-mock */

import chalk from "chalk";
import { extractResponses } from "./response";
import { writeFiles } from "./util";
import { extractSchemas } from "./schema";
import { composeMockData } from "./compose";
import { existsSync, mkdirSync } from "fs";
import { Config } from "../types";

function generateMock(content: any, config: Config) {
  const { dir } = config;
  try {
    const output = `${dir}/mocks`;
    const responses = extractResponses(content, config);
    const schemas = extractSchemas(content);
    const composed = composeMockData(responses, schemas);

    if (!existsSync(output)) {
      mkdirSync(output);
    }
    writeFiles(composed, output);

    console.log(chalk.yellowBright("Mocks Completed"));
  } catch (e) {
    console.log(chalk.redBright(e));
    console.log(chalk.redBright("Mocks Failed"));
  }
}

export { generateMock };
