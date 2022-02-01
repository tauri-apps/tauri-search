import { writeFile } from "fs/promises";
import { config } from "dotenv";
import { refreshSitemap } from "~/pipelines/refreshSitemap";

(async () => {
  config();
  const repo = process.env.REPO || "tauri";
  const ref = process.env.BRANCH || "dev";
  const sitemap = await refreshSitemap({ ref, repo });
  await writeFile(
    `src/generated/sitemap-${repo}-${ref}.json`,
    JSON.stringify(sitemap),
    "utf-8"
  );
})();
