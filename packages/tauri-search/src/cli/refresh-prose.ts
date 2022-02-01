import { refreshProse } from "~/pipelines/refreshProse";
import { getEnv } from "~/utils/getEnv";

(async () => {
  const { repo, branch, force } = getEnv();
  await refreshProse(repo, branch, { force });
})();
