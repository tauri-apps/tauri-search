/* eslint-disable no-console */
import { ApiModel } from "~/models";
import { pushTypescriptDocs } from "~/pipelines/pushTypescriptDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  const o = getEnv();
  console.log(`- pushing Typescript API documents to Meilisearch [${o.stage}]`);
  const { errors, tasks } = await pushTypescriptDocs({
    ...o,
  });
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
    communicateTaskStatus(ApiModel(o.stage, { admin_key: o.adminKey }), tasks, {
      timeout: 65000,
    });
  }
})();
