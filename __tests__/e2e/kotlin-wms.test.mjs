import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "kotlin-wms.config.json");

describe("E2E: Kotlin WMS API Tests", () => {
  beforeEach(async () => {
    await cleanOutputDir(configPath);
  });

  afterEach(async () => {
    await cleanOutputDir(configPath);
  });

  test("should generate Kotlin WMS API files correctly", async () => {
    const generatedFiles = await generate(configPath);

    // For Kotlin tests, verify the generation completed successfully
    // Note: Kotlin files have different structure than TypeScript
    expect(generatedFiles).toBeDefined();

    // Create snapshot for Kotlin files
    expect(generatedFiles).toMatchSnapshot("kotlin-wms-generated-files");
  }, 30000);
});
