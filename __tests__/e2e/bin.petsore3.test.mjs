import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "output");
const configPath = path.join(__dirname, "test-config.json");

describe("swag-ts CLI E2E Tests", () => {
  beforeEach(async () => {
    await cleanOutputDir(outputDir);
  });

  afterEach(async () => {
    await cleanOutputDir(outputDir);
  });

  describe("Configuration Tests", () => {
    test("E2E-VALIDATION-002: Generated Files Snapshots", async () => {
      const generatedFiles = await generate(configPath, outputDir);
      // Create snapshot of all generated files

      // Verify critical content exists
      expect(generatedFiles["services.ts"]).toContain("export const");
      expect(generatedFiles["types.ts"]).toContain("export interface");
      expect(generatedFiles["hooks.ts"]).toContain("useQuery");
      expect(generatedFiles["config.ts"]).toContain("SwaggerResponse");
      expect(generatedFiles["httpRequest.ts"]).toContain("axios");
      expect(generatedFiles["hooksConfig.ts"]).toContain(
        "paginationFlattenData",
      );

      delete generatedFiles["swagger.json"];

      expect(generatedFiles).toMatchSnapshot("e2e-generated-files");
    }, 30000);
  });
});
