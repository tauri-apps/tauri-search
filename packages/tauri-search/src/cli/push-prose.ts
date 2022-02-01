import { existsSync } from "fs";
import { pushProseDocs } from "~/pipelines/pushProseDocs";
import { proseDocsCacheFile, refreshProse } from "~/pipelines/refreshProse";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";
import { getEnv } from "~/utils/getEnv";
import { ProseModel } from "..";

(async () => {
  const { repo, branch } = getEnv();
  if (!existsSync(proseDocsCacheFile(repo, branch))) {
    await refreshProse(repo, branch);
  }
  console.log(`- Pushing "prose" documents to MeiliSearch`);
  const tasks = await pushProseDocs(repo, branch);
  console.log(
    `- all ${tasks.length} documents were pushed via API; monitoring task status ...`
  );

  await communicateTaskStatus(ProseModel, tasks, { timeout: 30000 });
})();
