/* eslint-disable no-console */
import { refreshProse } from "~/pipelines/refreshProse";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  const { repo, branch } = getEnv();
  console.log(`- refreshing all prose from ${repo}@${branch}`);

  const { docs, cacheFile } = await refreshProse();

  console.log(`- prose documents [${docs?.length}] saved to cache file: ${cacheFile}`);
})();
