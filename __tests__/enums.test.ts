import { generator } from "../src/generator";
import swaggerJson from "./swagger.json";

describe("generate", () => {
  //@ts-ignore
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
