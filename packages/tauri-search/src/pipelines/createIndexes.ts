import { ProseModel, ApiModel, RepoModel } from "~/models";
import { MsSettingsUpdate } from "..";

const models = {
  api: ApiModel,
  repo: RepoModel,
  prose: ProseModel,
  // consolidated: ConsolidatedModel,
};

/**
 * Will add -- and configure -- all known indexes to MeiliSearch which aren't already
 * present in server.
 */
export async function createIndexes() {
  const skipping = (await ProseModel.query.currentIndexes()).map((i) => i.name);
  const created: string[] = [];
  for (const key of Object.keys(models)) {
    const model = models[key as keyof typeof models];
    if (!skipping.includes(model.name)) {
      created.push(key);
      // create the index
      console.log(await model.query.createIndex());
      // then update settings
      const indexSettings: MsSettingsUpdate<any> = {
        ...(model.index.displayed ? { displayedAttributes: model.index.displayed } : {}),
        ...(model.index.searchable
          ? { searchableAttributes: model.index.searchable }
          : {}),
        ...(model.index.filterable
          ? { filterableAttributes: model.index.filterable }
          : {}),
        ...(model.index.sortable ? { sortableAttributes: model.index.sortable } : {}),
        ...(model.index.rules ? { rankingRules: model.index.rules } : {}),
      };
      await model.query.updateIndexSettings(indexSettings);
    }
  }

  return { skipping, created };
}
