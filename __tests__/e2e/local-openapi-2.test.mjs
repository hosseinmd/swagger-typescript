import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "local-openapi-2.config.json");

describe("E2E: Local OpenAPI Tests", () => {
  beforeEach(async () => {
    await cleanOutputDir(configPath);
  });

  afterEach(async () => {
    await cleanOutputDir(configPath);
  });

  test("should generate Django Allauth API files correctly", async () => {
    const generatedFiles = await generate(configPath);

    // Verify critical content exists
    expect(generatedFiles["services.ts"]).toContain("export const");
    expect(generatedFiles["types.ts"]).toContain("export interface");
    expect(generatedFiles["hooks.ts"]).toContain("useQuery");
    expect(generatedFiles["config.ts"]).toContain("SwaggerResponse");
    expect(generatedFiles["httpRequest.ts"]).toContain("axios");
    expect(generatedFiles["hooksConfig.ts"]).toContain("paginationFlattenData");

    // Create snapshot of all generated files for local OpenAPI
    delete generatedFiles["swagger.json"];
    expect(generatedFiles).toMatchSnapshot("local-openapi-generated-files");
  }, 30000);
});
