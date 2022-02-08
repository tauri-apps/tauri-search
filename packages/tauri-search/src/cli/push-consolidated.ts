/* eslint-disable no-console */
import { pushConsolidatedDocs } from "~/pipelines/pushConsolidatedDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { ConsolidatedModel } from "~/models";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  const o = getEnv();
  console.log(
    `- pushing all individual doc caches into a consolidated index [${o.stage}]`
  );
  const { tasks } = await pushConsolidatedDocs(o);
  console.log();
  console.log(
    `- all consolidated documents [${tasks.length}] have been pushed to MeiliSearch queue`
  );

  await communicateTaskStatus(
    ConsolidatedModel(o.stage, { admin_key: o.adminKey }),
    tasks,
    {
      timeout: 75000,
    }
  );
})();
