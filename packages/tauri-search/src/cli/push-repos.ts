import { existsSync } from "fs";
import { REPO_DOCS_CACHE } from "~/constants";
import { pushRepoDocs, refreshRepos } from "~/pipelines";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { RepoModel } from "..";

(async () => {
  console.log(`- Pushing Repo document cache into MeiliSearch`);

  if (!existsSync(REPO_DOCS_CACHE)) {
    console.log("- No cache for Repo documents found, so refreshing cache first");
    await refreshRepos();
  }
  const { docs, errors, tasks } = await pushRepoDocs();
  console.log();
  if (errors.length > 0) {
    console.log(
      `- Completed pushing Repo docs to MeiliSearch but ${errors.length} of ${
        docs.length
      } encountered errors:\n\t${errors.map((e) => e.name).join(", ")}`
    );
    process.exit(1);
  } else {
    console.log(
      `- Completed pushing all ${docs.length} Repo docs to MeiliSearch; monitoring queue status`
    );

    await communicateTaskStatus(RepoModel, tasks);
  }
})();
