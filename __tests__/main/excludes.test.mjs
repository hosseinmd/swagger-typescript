import { generator } from "../../lib/javascript/generator.mjs";
import swaggerJson from "./swagger.json";

describe("excludes post methods", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    dir: "",
    reactHooks: true,
    excludes: ["^post"],
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

describe("only includes get methods does not ends with Id", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    dir: "",
    reactHooks: true,
    includes: ["^get"],
    excludes: ["Id$"],
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
