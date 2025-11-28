import { cleanOutputDir, generator } from "./utils.mjs";
import swaggerJson from "./swagger.json";

describe("generate", () => {
  beforeAll(async () => {
    await cleanOutputDir("./__tests__/main/outputs/index");
  });

  afterEach(async () => {
    await cleanOutputDir("./__tests__/main/outputs/index");
  });

  test("generate Code, hooks, and type", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/main/outputs/index/swagger.json",
        dir: "./__tests__/main/outputs/index",
        reactHooks: true,
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });
});
