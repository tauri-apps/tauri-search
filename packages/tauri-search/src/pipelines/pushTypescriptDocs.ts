import { readFile } from "fs/promises";
import { TS_DOCS_CACHE } from "~/constants";
import { ApiModel, IApiModel } from "~/models";
import { IMonitoredTask } from "~/types";

/**
 * Iterates over each Typescript module and all of the
 * modules symbols and uses the `addOrUpdate` call to ensure
 * the index is fully up-to-date.
 */
export async function pushTypescriptDocs() {
  const docs = JSON.parse(await readFile(TS_DOCS_CACHE, "utf-8")) as IApiModel[];
  const errors: IApiModel[] = [];
  const tasks: IMonitoredTask[] = [];

  for (const doc of docs) {
    const res = await ApiModel.query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      process.stdout.write("x");
      errors.push(doc);
    } else {
      process.stdout.write(".");
      tasks.push({ docId: doc.id, taskId: res.uid });
    }
  }

  return { docs, tasks, errors };
}
