import { readFile } from "fs/promises";
import { config } from "dotenv";

(async () => {
  config();
  const repo = process.env.REPO || "tauri";
  const branch = process.env.BRANCH || "dev";
  await readFile(`src/generated/sitemap-${repo}-${branch}`);
})();
