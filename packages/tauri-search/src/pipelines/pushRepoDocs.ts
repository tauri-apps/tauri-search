import { IRepoModel, RepoModel } from "~/models";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv, IEnv } from "~/utils/getEnv";
import { IMonitoredTask } from "..";

/**
 * Pushes the cached REPO documents into the MeiliSearch "repo" index
 */
export async function pushRepoDocs(options: Partial<IEnv> = {}) {
  const o = { ...getEnv(), ...options };
  const { cache: docs, cacheFile } = await getCache(CacheKind.repoDocs, o);
  const errors: IRepoModel[] = [];
  const tasks: IMonitoredTask[] = [];

  for (const doc of docs) {
    const res = await RepoModel().query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      errors.push(doc);
    } else {
      tasks.push({ docId: doc.id, taskId: res.uid });
    }
  }

  return { docs, errors, tasks, cacheFile };
}
