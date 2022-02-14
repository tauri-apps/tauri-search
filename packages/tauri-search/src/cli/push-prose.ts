/* eslint-disable no-console */
import { pushProseDocs } from "~/pipelines";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { ProseModel } from "~/models";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  const o = getEnv();
  console.log(`- Pushing "prose" documents to MeiliSearch [${o.stage}]`);

  const tasks = await pushProseDocs(o);
  console.log(
    `- all ${tasks.length} documents were pushed via API; monitoring task status ...`
  );

  await communicateTaskStatus(ProseModel(o.stage, { admin_key: o.adminKey }), tasks, {
    timeout: 75000,
  });
})();
