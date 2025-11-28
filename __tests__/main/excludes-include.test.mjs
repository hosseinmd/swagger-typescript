import { cleanOutputDir, generator } from "./utils.mjs";
import swaggerJson from "./swagger.json";

describe("excludes and include", () => {
  beforeAll(async () => {
    await cleanOutputDir("./__tests__/main/outputs/excludes/temp2");
  });

  afterEach(async () => {
    await cleanOutputDir("./__tests__/main/outputs/excludes/temp2");
  });

  test("only includes get methods does not ends with Id", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/main/outputs/excludes/temp2/swagger.json",
        dir: "./__tests__/main/outputs/excludes/temp2",
        reactHooks: true,
        includes: ["^get"],
        excludes: ["Id$"],
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  }, 10000); // 10 seconds timeout for generation with includes/excludes filters
});
