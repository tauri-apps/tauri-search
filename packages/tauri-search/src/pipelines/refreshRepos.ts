/* eslint-disable no-console */
import { getRepo } from "~/utils/github/getRepo";
import { getRepoReadme } from "~/utils/github/getRepoReadme";
import { REPOS, REPO_DOCS_CACHE } from "~/constants";
import { GithubMapper } from "~/mappers";
import { GithubRepoResp } from "~/types";
import { IRepoModel } from "~/models";
import { writeFile } from "fs/promises";

/**
 * Responsible for iterating through each of the designated repos
 * and then saving a cached version of the README's AST and the search
 * indexes.
 */
export async function refreshRepos() {
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
  console.log(`- all repo's meta info has been retrieved from Github API`);
  const docs: IRepoModel[] = [];
  for (const r of repos) {
    docs.push(GithubMapper({ ...r, text: readmes[r.full_name] }));
  }
  await writeFile(REPO_DOCS_CACHE, JSON.stringify(docs), "utf-8");
  console.log(`- repo documents have been written to cache: ${REPO_DOCS_CACHE} `);

  return REPOS;
}
