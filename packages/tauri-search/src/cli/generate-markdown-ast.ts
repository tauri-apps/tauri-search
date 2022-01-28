import { readFile } from "fs/promises";
import { config } from "dotenv";

(async () => {
  config();
  const repo = process.env.REPO || "tauri";
  const branch = process.env.BRANCH || "dev";
  const currentSitemap = await readFile(`src/generated/sitemap-${repo}-${branch}`);
})();
