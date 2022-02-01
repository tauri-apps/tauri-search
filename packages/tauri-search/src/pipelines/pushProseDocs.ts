import { readFile } from "fs/promises";
import { IProseModel, ProseModel } from "~/models/ProseModel";
import { IMonitoredTask } from "..";
import { proseDocsCacheFile } from "./refreshProse";

/**
 * Pushes the cached prose documents into the MeiliSearch "prose" index
 */
export async function pushProseDocs(repo: string, branch: string) {
  const filename = proseDocsCacheFile(repo, branch);
  const cache = JSON.parse(await readFile(filename, "utf-8")) as IProseModel[];
  const tasks: IMonitoredTask[] = [];

  for (const doc of cache) {
    tasks.push(
      await ProseModel.query
        .addOrReplaceDocuments(doc)
        .then((i) => ({ docId: doc.id, taskId: i.uid }))
    );
  }

  return tasks;
}
