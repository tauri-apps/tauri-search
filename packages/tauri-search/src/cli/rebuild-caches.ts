/* eslint-disable no-console */
import { rebuildCaches } from "~/pipelines/rebuildCaches";

(async () => {
  console.log(`- Rebuilding all caches files`);
  const results = await rebuildCaches();
  console.log(
    `- there were ${results.prose[1]} prose docs; saved to ${results.prose[0]}`
  );
  console.log(
    `- there were ${results.typescript[1]} typescript API docs; saved to ${results.typescript[0]}`
  );
  console.log(
    `- there were ${results.repos[1]} repos docs; saved to ${results.repos[0]}`
  );
})();
