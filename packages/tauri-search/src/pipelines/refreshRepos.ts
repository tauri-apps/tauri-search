/* eslint-disable no-console */
import { getRepo } from "~/utils/github/getRepo";
import { getRepoReadme } from "~/utils/github/getRepoReadme";
import { REPOS } from "~/constants";
import { GithubMapper } from "~/mappers";
import { GithubRepoResp } from "~/types";
import { IRepoModel } from "~/models";
import { CacheKind, getCache } from "~/utils/getCache";
import { writeCacheFile } from "~/utils/writeCacheFile";

/**
 * Responsible for iterating through each of the designated repos
 * and then saving a cached version of the README's AST and the search
 * indexes.
 */
export async function refreshRepos() {
  const { cacheFile } = await getCache(CacheKind.repoDocs);

  const repoPromise: Promise<GithubRepoResp>[] = [];
  const readmePromise: Promise<[string, string | undefined]>[] = [];
  for (const repo of REPOS) {
    const resp = getRepo(repo);
    repoPromise.push(resp);
    readmePromise.push(getRepoReadme(repo).then((i) => [repo, i]));
  }
  const readmes = (await Promise.all(readmePromise)).reduce((acc, tuple) => {
    return { ...acc, [tuple[0]]: tuple[1] };
  }, {} as Record<string, string | undefined>);

  const repos = await Promise.all(repoPromise);
  const docs: IRepoModel[] = [];
  for (const r of repos) {
    docs.push(GithubMapper({ ...r, text: readmes[r.full_name] }));
  }
  await writeCacheFile(cacheFile, docs);

  return { cacheFile, docs };
}
