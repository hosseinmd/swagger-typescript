module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js)$": "babel-jest",
  },
  // "preset": "react-native"
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["node_modules", "lib"],
};
