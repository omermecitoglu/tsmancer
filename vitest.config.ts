import path from "node:path";
import rawPlugin from "vite-raw-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    rawPlugin({ fileRegex: /\.hbs$/ }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
