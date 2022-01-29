import { getRepo, GithubRepoResp } from "./github/getRepo";
import { getRepoReadme } from "./github/getRepoReadme";
import { REPOS } from "~/constants";
import { GithubMapper } from "~/mappers";

/**
 * Responsible for iterating through each of the designated repos
 * and then saving a cached version of the README's AST and the search
 * indexes.
 */
export async function refreshRepos() {
  const repoPromise: Promise<GithubRepoResp["data"]>[] = [];
  const readmePromise: Promise<[string, string | undefined]>[] = [];
  for (const repo of REPOS) {
    const resp = getRepo(repo);
    repoPromise.push(resp);
    readmePromise.push(getRepoReadme(repo).then((i) => [repo, i]));
    // waitFor.push(model.query.addOrReplaceDoc(GithubMapper(resp)))
  }
  const readmes = (await Promise.all(readmePromise)).reduce((acc, tuple) => {
    return { ...acc, [tuple[0]]: tuple[1] };
  }, {} as Record<string, string | undefined>);
  const repos = await Promise.all(repoPromise);
  console.log(`- all repo's meta info has been retrieved from Github API`);
  for (const r of repos) {
    GithubMapper({...r, text: readmes[r.name]) 
  }
}
