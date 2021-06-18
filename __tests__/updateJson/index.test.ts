import { partialUpdateJson } from "../../src/updateJson";
import newJson from "./new.json";
import oldJson from "./old.json";

test("update json", () => {
  //@ts-ignore
  const result = partialUpdateJson(oldJson, newJson, "Account");

  expect(result).toHaveProperty([
    "components",
    "schemas",
    "SeptaPay.Core.Models.Enums.CurrencyType",
    "isNew",
  ]);

  expect(result).toHaveProperty([
    "components",
    "schemas",
    "SeptaPay.Client.Api.Models.AccountCreationApiModel",
    "properties",
    "isNew",
  ]);

  expect(result).not.toHaveProperty([
    "paths",
    "/Account/{accountId}/balance",
    "get",
  ]);

  expect(result).toMatchSnapshot();
});
