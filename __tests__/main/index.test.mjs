import { generator } from "../../lib/javascript/generator.mjs";
import swaggerJson from "./swagger.json";

describe("generate", () => {
  const { code, hooks, type } = generator(swaggerJson, {
    dir: "",
    reactHooks: true,
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
