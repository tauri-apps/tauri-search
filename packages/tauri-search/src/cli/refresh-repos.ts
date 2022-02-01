/* eslint-disable no-console */
import { refreshRepos } from "~/pipelines/refreshRepos";

(async () => {
  console.log(`- writing Repo docs to cache`);
  const repos = await refreshRepos();
  console.log(`- all ${repos.length} repos have been updated`);
})();
