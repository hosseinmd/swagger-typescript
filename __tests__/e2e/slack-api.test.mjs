import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanOutputDir, generate } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "slack-api.config.json");

describe("E2E: Slack API Tests", () => {
  beforeEach(async () => {
    await cleanOutputDir(configPath);
  });

  afterEach(async () => {
    await cleanOutputDir(configPath);
  });

  test("should generate Slack API files with infinite query support", async () => {
    const generatedFiles = await generate(configPath);

    // Verify critical content exists
    expect(generatedFiles["services.ts"]).toContain("export const");
    expect(generatedFiles["types.ts"]).toContain("export interface");
    expect(generatedFiles["hooks.ts"]).toContain("useQuery");
    expect(generatedFiles["config.ts"]).toContain("SwaggerResponse");
    expect(generatedFiles["httpRequest.ts"]).toContain("axios");
    expect(generatedFiles["hooksConfig.ts"]).toContain("paginationFlattenData");

    // Create snapshot of all generated files
    delete generatedFiles["swagger.json"];
    expect(generatedFiles).toMatchSnapshot("slack-api-generated-files");
  }, 30000);
});
