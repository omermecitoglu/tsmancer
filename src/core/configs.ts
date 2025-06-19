import fs from "node:fs";
import path from "node:path";

/**
 * Filters dependencies based on a whitelist.
 *
 * @param deps - A record of dependencies with their versions.
 * @param whiteList - An array of dependency names to include.
 * @returns A filtered record of dependencies or undefined if no matches are found.
 */
function filterDependencies(deps: Record<string, string> | undefined, whiteList: string[]) {
  const entries = Object.entries(deps ?? {}).filter(([name]) => whiteList.includes(name));
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/**
 * Generates a configuration object for a project based on the package.json file.
 *
 * @param outputFolder - The folder where the output files will be stored.
 * @param dependencies - An array of dependency names to include in the configuration.
 * @returns A JSON string representing the configuration object.
 */
export default function generateConfigs(outputFolder: string, dependencies: string[]) {
  const filePath = path.resolve(process.cwd(), "package.json");
  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);
  const packageJSON = {
    ...data,
    files: [
      `${outputFolder}/`,
    ],
    exports: {
      ".": {
        import: `./${outputFolder}/index.js`,
        types: `./${outputFolder}/index.d.ts`,
      },
      "./*": `./${outputFolder}/schemas/*.d.ts`,
      "./zod/*": {
        import: `./${outputFolder}/zod-schemas/*.js`,
        types: `./${outputFolder}/zod-schemas/*.d.ts`,
      },
    },
    scripts: {
      test: "echo \"Error: no test specified\" && exit 1",
    },
    dependencies: filterDependencies(data.dependencies, dependencies),
    devDependencies: filterDependencies(data.devDependencies, dependencies),
    optionalDependencies: filterDependencies(data.optionalDependencies, dependencies),
  };
  return JSON.stringify(packageJSON, null, 2);
}
