import { cleanOutputDir, generator } from "./utils.mjs";
import swaggerJson from "./swagger.json";

describe("excludes and include", () => {
  beforeAll(async () => {
    await cleanOutputDir("./__tests__/main/outputs/excludes");
  });

  afterEach(async () => {
    await cleanOutputDir("./__tests__/main/outputs/excludes");
  });

  test("excludes post methods", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/main/outputs/excludes/swagger.json",
        dir: "./__tests__/main/outputs/excludes",
        reactHooks: true,
        excludes: ["^post"],
      },
      swaggerJson,
    );
    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });

  test("only includes get methods does not ends with Id", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/main/outputs/excludes/swagger.json",
        dir: "./__tests__/main/outputs/excludes",
        reactHooks: true,
        includes: ["^get"],
        excludes: ["Id$"],
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });
});
