/* eslint-disable no-console */
import { rebuildCaches } from "~/pipelines/rebuildCaches";

(async () => {
  console.log(`- Rebuilding all caches files`);
  await rebuildCaches();
})();
