import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleFileExtensions: ["ts", "js", "json", "hbs"],
  modulePathIgnorePatterns: [
    "<rootDir>/.next",
    "<rootDir>/bin",
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.hbs$": "<rootDir>/hbs-transformer.cjs",
    "^.+\\.[tj]s$": ["ts-jest", {
      tsconfig: {
        allowJs: true,
      },
    }],
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!change-case)",
  ],
  collectCoverage: true,
};

export default jestConfig;
