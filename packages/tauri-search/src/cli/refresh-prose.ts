/* eslint-disable no-console */
import { refreshProse } from "~/pipelines/refreshProse";
import { getEnv } from "~/utils/getEnv";

(async () => {
  const { repo, branch, force } = getEnv();
  console.log(`- refreshing all prose from ${repo}@${branch}`);
  
  await refreshProse(repo, branch, { force });
  console.log(`- completed updates of prose [${repo}@${branch}] `);
})();
