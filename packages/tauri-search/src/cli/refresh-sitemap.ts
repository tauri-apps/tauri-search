/* eslint-disable no-console */
import { refreshSitemap } from "~/pipelines/refreshSitemap";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  console.log(`- refreshing sitemap for prose content`);

  const o = getEnv();
  const r = await refreshSitemap(o);

  console.log(`- updated sitemap has ${r.count} documents`);
  if (r.hasDeltaInfo) {
    if (r.changes?.added?.length > 0) {
      console.log(
        `- ${
          r.changes.added.length
        } files r.changes.added since last check: ${r.changes.added.join(", ")}`
      );
    }
    if (r.changes.changed.length > 0) {
      console.log(
        `- ${
          r.changes.changed.length
        } files changed since last check: ${r.changes.changed.join(", ")}`
      );
    }
    if (r.changes.removed.length > 0) {
      console.log(
        `- ${
          r.changes.removed.length
        } files removed since last check: ${r.changes.removed.join(", ")}`
      );
    }
    if (
      [r.changes.added, r.changes.changed, r.changes.removed].every((i) => i.length === 0)
    ) {
      console.log(`- no files changed since the last check`);
    }
  } else {
    console.log(`- no prior cache info so no delta analysis was done`);
  }

  console.log(`- cache file now resides at: ${r.cacheFile}`);
})();
