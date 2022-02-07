import { ApiModel, IApiModel } from "~/models";
import { IMonitoredTask } from "~/types";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv, IEnv } from "~/utils/getEnv";
import { refreshTypescript } from ".";

/**
 * Iterates over each Typescript module and all of the
 * modules symbols and uses the `addOrUpdate` call to ensure
 * the index is fully up-to-date.
 */
export async function pushTypescriptDocs(options: Partial<IEnv> = {}) {
  const o = { ...getEnv(), ...options };
  // eslint-disable-next-line prefer-const
  let { cache: docs, cacheFile } = await getCache(CacheKind.typescriptDocs, o);
  if (docs.length === 0) {
    docs = (await refreshTypescript(o)).docs;
  }
  const errors: IApiModel[] = [];
  const tasks: IMonitoredTask[] = [];

  for (const doc of docs) {
    const res = await ApiModel().query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      errors.push(doc);
    } else {
      tasks.push({ docId: doc.id, taskId: res.uid });
    }
  }

  return { docs, tasks, errors, cacheFile };
}
