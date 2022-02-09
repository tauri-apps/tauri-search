import { ConsolidatedMapper } from "~/mappers/ConsolidatedMapper";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { ConsolidatedModel, IConsolidatedModel } from "~/models";
import { IMonitoredTask, IEnv } from "~/types";

export async function pushConsolidatedDocs(options: Partial<IEnv> = {}) {
  const o = { ...getEnv(), ...options };

  const docs: IConsolidatedModel[] = [
    ...(await getCache(CacheKind.typescriptDocs, {
      ...o,
    }).then((c) => c.cache.map((c) => ConsolidatedMapper(c)))),
    ...(await getCache(CacheKind.proseDocs, o).then((c) =>
      c.cache.map((c) => ConsolidatedMapper(c))
    )),
    ...(await getCache(CacheKind.repoDocs, o).then((c) =>
      c.cache.map((c) => ConsolidatedMapper(c))
    )),
  ];

  // push into MeiliSearch task queue
  const errors: IConsolidatedModel[] = [];
  const tasks: IMonitoredTask[] = [];
  for (const doc of docs) {
    const res = await ConsolidatedModel(o.stage, {
      admin_key: o.adminKey,
    }).query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      errors.push(doc);
    } else {
      tasks.push({ docId: doc.objectID, taskId: res.uid });
    }
  }
  return { docs, tasks, errors };
}
