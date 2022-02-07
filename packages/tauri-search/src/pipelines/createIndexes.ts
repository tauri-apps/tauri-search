/* eslint-disable no-console */
import { ProseModel, ApiModel, RepoModel, ConsolidatedModel } from "~/models";

const models = {
  api: ApiModel(),
  repo: RepoModel(),
  prose: ProseModel(),
  consolidated: ConsolidatedModel(),
};

/**
 * Will add -- and configure -- all known indexes to MeiliSearch which aren't already
 * present in server.
 */
export async function createIndexes() {
  const skipping = (await ProseModel().query.currentIndexes()).map((i) => i.name);
  const created: string[] = [];
  for (const key of Object.keys(models)) {
    const model = models[key as keyof typeof models];
    if (!skipping.includes(model.name)) {
      created.push(key);
      // create the index and configure it
      await model.query.createIndex();
    }
  }

  return { skipping, created };
}
