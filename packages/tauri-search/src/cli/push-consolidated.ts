/* eslint-disable no-console */
import { existsSync } from "node:fs";
import { REPO_DOCS_CACHE, TS_DOCS_CACHE } from "~/constants";
import {
  proseDocsCacheFile,
  refreshProse,
  refreshRepos,
  refreshTypescript,
} from "~/pipelines";
import { pushConsolidatedDocs } from "~/pipelines/pushConsolidatedDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { getEnv } from "~/utils/getEnv";
import { ConsolidatedModel } from "~/models";

(async () => {
  console.log(`- pushing all models into consolidated index`);
  const { repo, branch } = getEnv();

  if (!existsSync(TS_DOCS_CACHE)) {
    console.log(`- The Typescript documents cache wasn't found; creating first`);
    await refreshTypescript(repo, branch);
  }
  if (!existsSync(REPO_DOCS_CACHE)) {
    console.log("- No cache for Repo documents found, so refreshing cache first");
    await refreshRepos();
  }
  if (!existsSync(proseDocsCacheFile(repo, branch))) {
    await refreshProse(repo, branch);
  }

  const { tasks } = await pushConsolidatedDocs(repo, branch);
  console.log();
  console.log(
    `- all consolidated documents [${tasks.length}] have been pushed to MeiliSearch queue`
  );

  communicateTaskStatus(ConsolidatedModel, tasks, { timeout: 75000 });
})();
