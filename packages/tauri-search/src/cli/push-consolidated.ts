/* eslint-disable no-console */
import { pushConsolidatedDocs } from "~/pipelines/pushConsolidatedDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { ConsolidatedModel } from "~/models";

(async () => {
  console.log(`- pushing all individual models into a consolidated index`);

  const { tasks } = await pushConsolidatedDocs();
  console.log();
  console.log(
    `- all consolidated documents [${tasks.length}] have been pushed to MeiliSearch queue`
  );

  communicateTaskStatus(ConsolidatedModel(), tasks, { timeout: 75000 });
})();
