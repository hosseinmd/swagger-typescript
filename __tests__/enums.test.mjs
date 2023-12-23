import { generator } from "../lib/javascript/generator.mjs";
import swaggerJson from "./swagger.json";

describe("generate enum as type", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    generateEnumAsType: true,
  });
  it("generate Code", () => {
    expect(code).toMatchSnapshot();
  });
  it("generate hooks", () => {
    expect(hooks).toMatchSnapshot();
  });
  it("generate type", () => {
    expect(type).toMatchSnapshot();
  });
});

describe("generate enum", () => {
  const { code, hooks, type } = generator(swaggerJson, {});

  it("generate Code", () => {
    expect(code).toMatchSnapshot();
  });
  it("generate hooks", () => {
    expect(hooks).toMatchSnapshot();
  });
  it("generate type", () => {
    expect(type).toMatchSnapshot();
  });
});
