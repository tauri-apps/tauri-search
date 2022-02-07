/* eslint-disable no-console */
import { ApiModel } from "~/models";
import { pushTypescriptDocs } from "~/pipelines/pushTypescriptDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";

(async () => {
  console.log(`- pushing Typescript API documents to Meilisearch`);
  const { errors, tasks } = await pushTypescriptDocs({ branch: "feat/generate-js-ast" });
  console.log();

  if (errors.length > 0) {
    console.log(
      `- Completed pushing Typescript docs to MeiliSearch but ${errors.length} of ${
        tasks.length
      } encountered errors and were not processed:\n\t${errors
        .map((e) => e.name)
        .join(", ")}`
    );
    process.exit(1);
  } else {
    console.log(
      `- Completed pushing all Typescript docs [${tasks.length}] to MeiliSearch. Now monitoring task progress ...`
    );
    communicateTaskStatus(ApiModel(), tasks, { timeout: 65000 });
  }
})();
