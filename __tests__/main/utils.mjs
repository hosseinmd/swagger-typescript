import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generate } from "../../lib/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");
// Helper function to clean up output directory
export const cleanOutputDir = async (dirPath) => {
  try {
    await fs.rm(path.join(rootDir, dirPath), { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, that's okay
  }
};

export const generator = async (config, swaggerJson) => {
  // write swagger.json in a temporary file
  const tempSwaggerJsonPath = path.join(rootDir, config.dir, "swagger.json");
  await fs.mkdir(path.join(rootDir, config.dir), { recursive: true });

  await fs.writeFile(tempSwaggerJsonPath, JSON.stringify(swaggerJson, null, 2));

  await generate(config);

  // Helper function to read file content
  const readFileContent = async (fileName) => {
    try {
      return await fs.readFile(path.join(config.dir, fileName), "utf8");
    } catch {
      return "";
    }
  };

  // Create snapshots for key generated files
  const generatedFiles = {
    "services.ts": await readFileContent("services.ts"),
    "types.ts": await readFileContent("types.ts"),
    "hooks.ts": await readFileContent("hooks.ts"),
    "config.ts": await readFileContent("config.ts"),
    "httpRequest.ts": await readFileContent("httpRequest.ts"),
    "hooksConfig.ts": await readFileContent("hooksConfig.ts"),
  };

  // Parse and normalize swagger.json for consistent formatting
  const swaggerJsonContent = await readFileContent("swagger.json");
  if (swaggerJsonContent) {
    try {
      const swaggerJson = JSON.parse(swaggerJsonContent);
      generatedFiles["swagger.json"] = JSON.stringify(swaggerJson, null, 2);
    } catch {
      generatedFiles["swagger.json"] = swaggerJsonContent;
    }
  }

  return generatedFiles;
};
