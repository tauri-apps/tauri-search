import { IRepoModel, RepoModel } from "~/models";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { IMonitoredTask, IEnv } from "~/types";

/**
 * Pushes the cached REPO documents into the MeiliSearch "repo" index
 */
export async function pushRepoDocs(options: Partial<IEnv> = {}) {
  const o = { ...getEnv(), ...options };
  const { cache: docs, cacheFile } = await getCache(CacheKind.repoDocs, o);
  const errors: IRepoModel[] = [];
  const tasks: IMonitoredTask[] = [];

  for (const doc of docs) {
    const res = await RepoModel(o.stage, {
      admin_key: o.adminKey,
    }).query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      errors.push(doc);
    } else {
      tasks.push({ docId: doc.id, taskId: res.uid });
    }
  }

  return { docs, errors, tasks, cacheFile };
}
