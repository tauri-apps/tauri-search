import { ProseModel } from "~/models/ProseModel";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { IMonitoredTask, IEnv } from "~/types";

/**
 * Pushes the cached prose documents into the MeiliSearch "prose" index
 */
export async function pushProseDocs(options: Partial<IEnv> = {}) {
  const o = { ...getEnv(), ...options };

  const { cache } = await getCache(CacheKind.proseDocs, o);

  const tasks: IMonitoredTask[] = [];

  for (const doc of cache) {
    tasks.push(
      await ProseModel(o.stage, { admin_key: o.adminKey })
        .query.addOrReplaceDocuments(doc)
        .then((i) => ({ docId: doc.id, taskId: i.uid }))
    );
  }

  return tasks;
}
