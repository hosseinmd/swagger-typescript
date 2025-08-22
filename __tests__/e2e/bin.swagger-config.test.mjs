import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localConfigPath = path.join(__dirname, "swagger.config.json");

describe("swag-ts CLI E2E Tests", () => {
  //   beforeEach(async () => {
  //     await cleanOutputDir(localConfigPath);
  //   });

  //   afterEach(async () => {
  //     await cleanOutputDir(localConfigPath);
  //   });

  describe("Local OpenAPI Tests", () => {
    test("E2E-LOCAL-001: Django Allauth API Generation", async () => {
      const generatedFiles = await generate(localConfigPath);

      // Create snapshot of all generated files for local OpenAPI

      // Verify critical content exists

      delete generatedFiles["swagger.json"];
      expect(generatedFiles).toMatchSnapshot("local-openapi-generated-files");
    }, 30000);
  });
});
