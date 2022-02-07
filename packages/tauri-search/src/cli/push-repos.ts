/* eslint-disable no-console */
import { pushRepoDocs } from "~/pipelines";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { RepoModel } from "..";

(async () => {
  console.log(`- Pushing Repo document cache into MeiliSearch`);

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
