import { defaults } from "jest-config";
const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "mts"],
  testMatch: [
    "**/__tests__/**/*.m[jt]s?(x)",
    "**/?(*.)+(spec|test).m[tj]s?(x)",
  ],
  moduleNameMapper: {
    ...defaults.moduleNameMapper,
    "#(.*)": "<rootDir>/node_modules/$1",
  },
  preset: "ts-jest",
  verbose: true,
};
export default config;
//# sourceMappingURL=jest.config.js.map
