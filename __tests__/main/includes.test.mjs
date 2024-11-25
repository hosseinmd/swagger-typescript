import { generator } from "../../lib/javascript/generator.mjs";
import swaggerJson from "./swagger.json";

describe("only includes get methods", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    dir: "",
    reactHooks: true,
    includes: ["^get"],
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

describe("only includes methods ends with Id", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    dir: "",
    reactHooks: true,
    includes: ["Id$"],
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
