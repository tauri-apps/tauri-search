import { readFile } from "fs/promises";
import { REPO_DOCS_CACHE } from "~/constants";
import { IRepoModel, RepoModel } from "~/models";
import { IMonitoredTask } from "..";

/**
 * Pushes the cached REPO documents into the MeiliSearch "repo" index
 */
export async function pushRepoDocs() {
  const docs = JSON.parse(await readFile(REPO_DOCS_CACHE, "utf-8")) as IRepoModel[];
  const errors: IRepoModel[] = [];
  const tasks: IMonitoredTask[] = [];

  process.stdout.write(" ");
  for (const doc of docs) {
    const res = await RepoModel.query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      process.stdout.write("x");
      errors.push(doc);
    } else {
      process.stdout.write(".");
      tasks.push({ docId: doc.id, taskId: res.uid });
    }
  }

  return { docs, errors, tasks };
}
