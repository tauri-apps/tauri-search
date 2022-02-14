import path from "path";
import { defineConfig, UserConfig } from "vite";
import inspect from "vite-plugin-inspect";
import dts from "vite-plugin-dts";
import { config } from "dotenv";

config();

export default defineConfig({
  resolve: {
    dedupe: ["vue"],
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  esbuild: {
    exclude: ["test", "dist"],
  },
  clearScreen: false,
  build: {
    lib: {
      name: "tauri-search",
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
    },
    // watch: {},
  },
  test: {
    include: ["test/**{test,spec}.{js,mjs,cjs,ts,mts}"],
    exclude: ["test/e2e/**"],
    // environment: "jsdom",
    types: ["vitest/global"],
    api: {
      port: 5555,
      host: "localhost",
    },
    deps: {
      // inline: ["@vue/test-utils", "@vue", "@vueuse", "vue-demi"],
    },
  },
  plugins: [dts({ logDiagnostics: true }), inspect()],
} as UserConfig);
