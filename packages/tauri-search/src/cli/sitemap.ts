import { writeFile } from "fs/promises";
import { buildDocsSitemap } from "~/utils/github/buildDocsSitemap";
import { config } from "dotenv";

(async () => {
  config();
  const repo = process.env.REPO || "tauri";
  const ref = process.env.BRANCH || "dev";
  const sitemap = await buildDocsSitemap({ ref, repo });
  await writeFile(
    `src/generated/sitemap-${repo}-${ref}.json`,
    JSON.stringify(sitemap),
    "utf-8"
  );
})();
