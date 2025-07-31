import fs from "node:fs";
import path from "node:path";

export function generateJsrJon() {
  const filePath = path.resolve(process.cwd(), "package.json");
  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);
  const packageJSON = {
    name: data.name,
    version: data.version || "1.0.0",
    license: "MIT",
    exports: "./src/index.ts",
    publish: {
      include: [
        "LICENSE",
        "README.md",
        "src/**/*.ts",
      ],
    },
  };
  return JSON.stringify(packageJSON, null, 2) + "\n";
}
