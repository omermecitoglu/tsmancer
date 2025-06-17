import path from "node:path";
import rawPlugin from "vite-raw-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
    },
  },
  plugins: [
    rawPlugin({ fileRegex: /\.hbs$/ }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
