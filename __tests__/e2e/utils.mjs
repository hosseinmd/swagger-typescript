import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");
const binPath = path.join(rootDir, "bin/index.mjs");

// Helper function to run CLI commands
const runCommand = (args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [binPath, ...args], {
      cwd: rootDir,
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({
        code,
        stdout,
        stderr,
      });
    });

    child.on("error", (error) => {
      reject(error);
    });

    // Set a timeout to prevent hanging
    setTimeout(() => {
      child.kill();
      reject(new Error("Command timeout"));
    }, 60000); // 60 seconds timeout for large OpenAPI files
  });
};

// Helper function to check if file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Helper function to clean up output directory
export const cleanOutputDir = async (configPath) => {
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));

  try {
    await fs.rm(config.dir, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, that's okay
  }
};

export const generate = async (configPath) => {
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  const result = await runCommand(["--config", configPath]);

  if (result.code !== 0) {
    console.log("result.stderr ", result.stderr);
  }
  expect(result.code).toBe(0);

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
