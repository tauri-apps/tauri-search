/* eslint-disable no-console */
import { pushProseDocs } from "~/pipelines/pushProseDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { ProseModel } from "..";

(async () => {
  console.log(`- Pushing "prose" documents to MeiliSearch`);
  const tasks = await pushProseDocs();
  console.log(
    `- all ${tasks.length} documents were pushed via API; monitoring task status ...`
  );

  await communicateTaskStatus(ProseModel, tasks, { timeout: 75000 });
})();
