/* eslint-disable no-console */
import { ProseModel, ApiModel, RepoModel, ConsolidatedModel } from "~/models";
import { ISearchModel, Stage, IEnv } from "~/types";
import { getEnv } from "~/utils/getEnv/esm/getEnv";

const models = (stage: Stage, admin_key: string) => ({
  api: ApiModel(stage, { admin_key }),
  repo: RepoModel(stage, { admin_key }),
  prose: ProseModel(stage, { admin_key }),
  consolidated: ConsolidatedModel(stage, { admin_key }),
});

/**
 * Will add -- and configure -- all known indexes to MeiliSearch which aren't already
 * present in server.
 */
export async function createIndexes(options: Partial<IEnv> = {}) {
  const { stage, adminKey } = { ...getEnv(), ...options };
  if (!adminKey && stage !== "local") {
    throw new Error(
      `- To publish to ${stage}, you will need set an ADMIN key!\n${Object.keys(
        import.meta.env || {}
      ).join(", ")}`
    );
  }
  const skipping = (
    await ProseModel(stage, { admin_key: adminKey }).query.currentIndexes()
  ).map((i) => i.name);
  const created: string[] = [];
  for (const key of ["api", "repo", "prose", "consolidated"]) {
    const model = models(stage, adminKey || "")[
      key as keyof typeof models
    ] as ISearchModel<any>;
    if (!skipping.includes(model.name)) {
      created.push(key);
      // create the index and configure it
      await model.query.createIndex();
    }
  }

  return { skipping, created };
}
