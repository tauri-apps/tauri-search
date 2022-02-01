import { getEnv } from "~/utils/getEnv";
import { refreshProse, refreshRepos, refreshTypescript } from ".";
import { refreshSitemap } from "./refreshSitemap";

export async function rebuildCaches() {
  const { repo, branch } = getEnv();

  await refreshSitemap();
  await Promise.all([
    refreshProse(repo, branch),
    refreshRepos(),
    refreshTypescript(repo, branch),
  ]);
}
