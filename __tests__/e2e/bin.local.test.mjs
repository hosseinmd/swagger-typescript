import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localOutputDir = path.join(__dirname, "local-output");
const localConfigPath = path.join(__dirname, "local-openapi-config.json");

describe("swag-ts CLI E2E Tests", () => {
  beforeEach(async () => {
    await cleanOutputDir(localOutputDir);
  });

  afterEach(async () => {
    await cleanOutputDir(localOutputDir);
  });

  describe("Local OpenAPI Tests", () => {
    test("E2E-LOCAL-001: Django Allauth API Generation", async () => {
      const generatedFiles = await generate(localConfigPath, localOutputDir);

      // Create snapshot of all generated files for local OpenAPI

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
      expect(generatedFiles).toMatchSnapshot("local-openapi-generated-files");
    }, 30000);
  });
});
