import { refreshRepos } from "~/pipelines/refreshRepos";

(async () => {
  console.log(`- Refreshing Repo info to cache`);
  const tasks = await refreshRepos();
})();
