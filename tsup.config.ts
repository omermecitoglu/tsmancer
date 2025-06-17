import InlineImportPlugin from "esbuild-plugin-inline-import";
import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "bin",
  entry: [
    "src/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  clean: true,
  external: [
    "typescript",
  ],
  esbuildPlugins: [
    InlineImportPlugin({ filter: /\.hbs$/ }),
  ],
});
