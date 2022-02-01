import { GithubMapper } from "~/mappers/GithubMapper";
import { RepoModel } from "~/models/RepoModel";
import { IMeilisearchAddOrReplace } from "~/types";
import { getRepo } from "~/utils/github/getRepo";

/**
 * Iterates over all marked repos and updates Meilisearch documents
 * associated to them.
 */
export async function githubPipeline() {
  const model = await RepoModel;
  const waitFor: Promise<IMeilisearchAddOrReplace>[] = [];
  for (const repo of REPOS) {
    const resp = await getRepo(repo);
    waitFor.push(model.query.addOrReplaceDoc(GithubMapper(resp)));
  }

  await Promise.all(waitFor);
}
