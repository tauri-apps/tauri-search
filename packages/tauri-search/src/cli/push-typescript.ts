import { existsSync } from "node:fs";
import { TS_DOCS_CACHE } from "~/constants";
import { pushTypescriptDocs } from "~/pipelines/pushTypescriptDocs";
import { refreshTypescript } from "~/pipelines/refreshTypescript";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { getEnv } from "~/utils/getEnv";
import { ApiModel } from "..";

(async () => {
  const { repo, branch } = getEnv();
  if (!existsSync(TS_DOCS_CACHE)) {
    console.log(`- The Typescript documents cache wasn't found; creating first`);
    await refreshTypescript(repo, branch);
  }

  console.log(`- Starting update process for Typescript API documents`);
  const { errors, tasks } = await pushTypescriptDocs();
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
    communicateTaskStatus(ApiModel, tasks, { timeout: 45000 });
  }
})();
