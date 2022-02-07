/* eslint-disable no-console */
import { refreshRepos } from "~/pipelines/refreshRepos";

(async () => {
  console.log(`- refresh Repo document cache`);
  const { docs, cacheFile } = await refreshRepos();
  console.log(`- all ${docs.length} repos have been updated and saved to: ${cacheFile}`);
})();
