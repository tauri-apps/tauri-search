/* eslint-disable no-console */
import { clearCaches } from "~/pipelines";

(async () => {
  console.log(`- clearing all cache files in repo`);
  const files = await clearCaches();
  console.log(`- removed ${files.length} cache files`);
  console.log("- run 'pnpm run rebuild-caches' to rebuild");
})();
