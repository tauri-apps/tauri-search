import { getEnv } from "~/utils/getEnv";
import { refreshProse } from "~/utils/refreshProse";

(async () => {
  const { repo, branch, force } = getEnv();
  await refreshProse(repo, branch, { force });
})();
