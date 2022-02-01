import { readFile } from "fs/promises";
import { REPO_DOCS_CACHE, TS_DOCS_CACHE } from "~/constants";
import { ConsolidatedMapper, IConsolidatedModel } from "~/mappers/ConsolidatedMapper";
import {
  ConsolidatedModel,
  IApiModel,
  IMonitoredTask,
  IProseModel,
  IRepoModel,
} from "..";
import { proseDocsCacheFile } from "./refreshProse";

export async function pushConsolidatedDocs(repo: string, branch: string) {
  // gather documents
  const ts: IConsolidatedModel[] = (
    JSON.parse(await readFile(TS_DOCS_CACHE, "utf-8")) as IApiModel[]
  ).map((c) => ConsolidatedMapper(c));
  // TODO: add in Rust API docs
  const prose: IConsolidatedModel[] = (
    JSON.parse(await readFile(proseDocsCacheFile(repo, branch), "utf-8")) as IProseModel[]
  ).map((i) => ConsolidatedMapper(i));
  const repos: IConsolidatedModel[] = (
    JSON.parse(await readFile(REPO_DOCS_CACHE, "utf-8")) as IRepoModel[]
  ).map((i) => ConsolidatedMapper(i));

  // push into MeiliSearch task queue
  const errors: IConsolidatedModel[] = [];
  const tasks: IMonitoredTask[] = [];
  const docs = [...ts, ...prose, ...repos];
  for (const doc of docs) {
    const res = await ConsolidatedModel.query.addOrReplaceDocuments(doc);
    if (res.status !== "enqueued") {
      process.stdout.write("x");
      errors.push(doc);
    } else {
      process.stdout.write(".");
      tasks.push({ docId: doc.docId, taskId: res.uid });
    }
  }
  return { docs, tasks, errors };
}
