/* eslint-disable no-console */

import { refreshTypescript } from "~/pipelines/refreshTypescript";

(async () => {
  console.log(`- refreshing Typescript ASTs and Docs cache`);
  const { docs, cacheFile, repo } = await refreshTypescript();
  console.log(`- completed caching of ${docs.length} TS API documents from ${repo}:`);
  console.log(`    - Doc Cache: ${cacheFile}`);
  console.log();
})();
