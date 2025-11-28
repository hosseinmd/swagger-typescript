import { cleanOutputDir, generator } from "./utils.mjs";
import swaggerJson from "./swagger.json";

describe("includes", () => {
  beforeAll(async () => {
    await cleanOutputDir("./__tests__/main/outputs/includes/temp2");
  });

  afterEach(async () => {
    await cleanOutputDir("./__tests__/main/outputs/includes/temp2");
  });

  test("only includes methods ends with Id", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/main/outputs/includes/temp2/swagger.json",
        dir: "./__tests__/main/outputs/includes/temp2",
        reactHooks: true,
        includes: ["Id$"],
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });
});
