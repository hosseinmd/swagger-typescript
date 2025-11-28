import { cleanOutputDir, generator } from "./main/utils.mjs";
import swaggerJson from "./swagger.json";

describe("enums", () => {
  beforeAll(async () => {
    await cleanOutputDir("./__tests__/outputs/enums");
  });

  afterEach(async () => {
    await cleanOutputDir("./__tests__/outputs/enums");
  });

  test("generate enum as type", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/outputs/enums/swagger.json",
        dir: "./__tests__/outputs/enums",
        generateEnumAsType: true,
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });

  test("generate enum", async () => {
    const {
      "services.ts": code,
      "hooks.ts": hooks,
      "types.ts": type,
    } = await generator(
      {
        url: "./__tests__/outputs/enums/swagger.json",
        dir: "./__tests__/outputs/enums",
      },
      swaggerJson,
    );

    expect(code).toMatchSnapshot("generate Code");
    expect(hooks).toMatchSnapshot("generate hooks");
    expect(type).toMatchSnapshot("generate type");
  });
});
