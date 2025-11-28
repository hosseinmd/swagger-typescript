import { writeFileSync, existsSync, readFileSync, rmdirSync } from "fs";
import { format } from "prettier";
import { SwaggerJson, Config } from "../types.mjs";
import { generator } from "./generator.mjs";
import { build } from "tsc-prog";
import { HubJson, signalRGenerator } from "./signalR/generator.mjs";
import { generateMock } from "./mock/index.mjs";
import chalk from "chalk";
//@ts-ignore
import recursive from "recursive-readdir";
import { getJson } from "../getJson.mjs";
import getConfigFile from "./files/config.mjs";
import getHttpRequestFile from "./files/httpRequest.mjs";
import getHooksConfigFile from "./files/hooksConfig.mjs";
import { getPrettierOptions } from "../utils.mjs";

const generateJavascriptService = async (
  config: Config,
  input: SwaggerJson,
) => {
  try {
    const { dir, language, mock, reactHooks } = config;
    const isToJs = language === "javascript";

    // Generate code
    const { code, hooks, type } = generator(input, config);

    if (mock) {
      generateMock(input, config);
    }

    // Write core files
    await writeFile(dir, "services.ts", code, config);
    await writeFile(dir, "types.ts", type, config);

    // Write React hooks if enabled
    if (reactHooks && hooks) {
      await writeFile(dir, "hooks.ts", hooks, config);
      await writeFileIfNotExists(
        dir,
        "hooksConfig",
        isToJs,
        getHooksConfigFile(),
        config,
      );
    }

    // Write config files
    await writeFile(dir, "httpRequest.ts", getHttpRequestFile(), config);
    await writeFileIfNotExists(
      dir,
      "config",
      isToJs,
      getConfigFile({ baseUrl: input.servers?.[0]?.url || "" }),
      config,
    );

    // Generate SignalR hub if configured
    const hubCode = await generateHub(config);

    // Convert TypeScript to JavaScript if needed
    if (isToJs) {
      const filesToConvert = buildFileList(
        config,
        Boolean(reactHooks),
        Boolean(hubCode),
      );
      convertTsToJs(dir, filesToConvert);

      await formatAllFiles(dir, getPrettierOptions(config));
    }

    // Format all generated files

    console.log(chalk.greenBright("All Completed"));
  } catch (error) {
    console.log(chalk.redBright(error), chalk.redBright("Generation failed"));
  }
};

/** Write a file and log completion */
async function writeFile(
  dir: string,
  filename: string,
  content: string,
  config: Config,
): Promise<void> {
  writeFileSync(
    `${dir}/${filename}`,
    await format(content, getPrettierOptions(config)),
  );
  const name = filename.replace(/\.(ts|js)$/, "");
  console.log(chalk.yellowBright(`${name} Completed`));
}

/** Write a file only if it doesn't already exist */
async function writeFileIfNotExists(
  dir: string,
  basename: string,
  isJs: boolean,
  content: string,
  config: Config,
): Promise<void> {
  const ext = isJs ? "js" : "ts";
  const filepath = `${dir}/${basename}.${ext}`;

  if (!existsSync(filepath)) {
    writeFileSync(
      `${dir}/${basename}.ts`,
      await format(content, getPrettierOptions(config)),
    );
    console.log(chalk.yellowBright(`${basename} Completed`));
  }
}

/** Generate SignalR hub code if configured */
async function generateHub(config: Config): Promise<string | null> {
  if (!config.hub) {
    return null;
  }

  const hubJson: HubJson = await getJson(config.hub);
  const hubCode = signalRGenerator(hubJson, config);

  if (hubCode) {
    writeFile(config.dir, "hub.ts", hubCode, config);
  }

  return hubCode;
}

/** Build list of files to convert from TypeScript to JavaScript */
function buildFileList(
  config: Config,
  includeHooks: boolean,
  includeHub: boolean,
): string[] {
  const files: string[] = [];

  if (includeHub) {
    files.push("hub");
  }

  if (config.url || config.local) {
    files.push("httpRequest", "services", "types", "config");

    if (includeHooks) {
      files.push("hooks", "hooksConfig");
    }
  }

  return files;
}

/** Format a single file with Prettier */
async function formatFile(filePath: string, prettierOptions: any) {
  const code = readFileSync(filePath).toString();
  writeFileSync(filePath, await format(code, prettierOptions));
}

/** Format all files in directory */
async function formatAllFiles(dir: string, prettierOptions: any) {
  recursive(dir, async (err: Error | null, files: string[]) => {
    if (err) {
      console.log(chalk.redBright(err));
      return;
    }

    for (const file of files) {
      const options = file.endsWith(".json")
        ? { ...prettierOptions, parser: "json" }
        : prettierOptions;

      if (
        file.endsWith(".ts") ||
        file.endsWith(".js") ||
        file.endsWith(".json")
      ) {
        await formatFile(file, options);
      }
    }
  });
}

/** Convert TypeScript files to JavaScript */
function convertTsToJs(dir: string, files: string[]) {
  build({
    basePath: ".",
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

  // Remove original .ts files after conversion
  files.forEach((file) => {
    const tsFile = `${dir}/${file}.ts`;
    if (existsSync(tsFile)) {
      rmdirSync(tsFile, { recursive: true });
    }
  });
}

export { generateJavascriptService };
